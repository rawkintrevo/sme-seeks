from firebase_functions import https_fn
from firebase_admin import initialize_app
from firebase_functions.params import StringParam
import pinecone
from llama_index.llms import OpenAI, ChatMessage
from llama_index import VectorStoreIndex
from llama_index.vector_stores import PineconeVectorStore
from google.cloud import firestore
import openai

# Initialize Firebase
initialize_app()

# Parameters
openai_api_key = StringParam("OPENAI_API_KEY")

@https_fn.on_call()
def sme(req: https_fn.CallableRequest) -> https_fn.Request:
    verbose = True
    if verbose: print(req.data)
    db = firestore.Client()

    uid = req.data.get('uid')
    chat_id = req.data.get('chat_id')
    query = req.data.get('query')
    index_name = req.data.get('index', '')
    temperature = float(req.data.get('temperature', 0.1))
    top_k = int(req.data.get('top_k', 3))
    model = req.data.get('model', 'gpt-3.5-turbo')

    if verbose: print(temperature)

    if not uid or not chat_id or not query:
        return {"error": "Missing required data"}

    user_doc_ref = db.collection('user').document(uid)

    try:
        user_data = user_doc_ref.get()
        if user_data.exists:
            user_doc_data = user_data.to_dict()
            chats = user_doc_data.get('chats', [])
            if chat_id not in chats:
                chats.append(chat_id)
                user_doc_ref.update({'chats': chats})
        else:
            return {"error": "User does not exist"}
    except Exception as e:
        return {"error": str(e)}

    if verbose:
        print("retrieved user data")
        print(user_doc_data)

    collection_name = 'chat'
    document_id = chat_id

    try:
        pinecone_api_key = user_doc_data.get('indicies', {}).get(index_name, {}).get('api_key', '')
        if not pinecone_api_key:
            return {"error": "Invalid Pinecone API Key"}

        pinecone.init(api_key=pinecone_api_key, environment="gcp-starter")
        pinecone_index = pinecone.Index(index_name)
        openai.api_key = user_doc_data.get('models', {}).get(index_name, {}).get('api_key', '')
        if not openai_api_key:
            return {'error': "Invalid OpenAI API Key"}

        vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

        llm = OpenAI(model=model, temperature=temperature, reuse_client=False)
        if verbose: print("llm ", llm)
        # Update Firestore document with response
        chat_ref = db.collection(collection_name).document(chat_id)
        chat_data = chat_ref.get().to_dict()
        messages = chat_data.get('messages', [])

        if verbose: print("loaded chat history")
        # query_engine = index.as_query_engine(llm=llm, similarity_top_k=top_k, streaming=True)
        query_engine = index.as_chat_engine(similarity_top_k=top_k, streaming=True)

        if verbose: print("query engine built" )
        role_map = {True: "user", False: "assistant"}
        loaded_messages = [
                              ChatMessage(role="system", content="You capture some of the essence of Mr. Meeseeks' character (from Rick and Morty), who is known for his eagerness to help, his frustration when tasks become too challenging, and his desire for a quick resolution to his existence.")
                          ] + [ChatMessage(role=role_map[m['isUser']], content=m["text"]) for m in messages[:-1]]

        if verbose: print("messages: ", loaded_messages)

        response = query_engine.stream_chat(query, chat_history = loaded_messages) #, chat_history: Optional[List[ChatMessage]] = None)
        # response = query_engine.query(query)

        if messages == []:
            print('WARNING: messages were empty ?')

        sources = [{'url': source_node.node.metadata.get('src', ''), 'title' : ""} for source_node in response.source_nodes]

        # Append tokens to the last message's 'text' field
        for token in response.response_gen:
            last_message = messages[-1]
            last_message_text = last_message.get('text', '')
            new_text = last_message_text + token
            last_message['text'] = new_text
            last_message['sources'] = sources
            chat_ref.update({'messages': messages})

        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}
