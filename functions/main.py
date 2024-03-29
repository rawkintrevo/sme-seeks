from firebase_functions import https_fn
from firebase_admin import initialize_app
from firebase_functions.params import StringParam
import pinecone
from llama_index.llms import OpenAI, ChatMessage
from llama_index import VectorStoreIndex
from llama_index.vector_stores import PineconeVectorStore
from llama_index.chat_engine import SimpleChatEngine
from llama_index import ServiceContext
from google.cloud import firestore
import openai
from datetime import datetime
from llama_index.chat_engine.types import ChatMode
import traceback

# Initialize Firebase
initialize_app()


@https_fn.on_call()
def sme(req: https_fn.CallableRequest) -> https_fn.Request:
    try:

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

        if verbose: print(f"Top K: {top_k}")

        if not uid or not chat_id or not query:
            return {"error": "Missing required data"}

        user_doc_ref = db.collection('user').document(uid)

        # try:
        user_data = user_doc_ref.get()
        if user_data.exists:
            user_doc_data = user_data.to_dict()
            if verbose: print(f"user_doc_data: {user_doc_data}")
            chats = user_doc_data.get('chats', []) # a list of dictionaries
            if verbose: print(f"chats: {chats}")
            if chat_id not in chats.keys():
                chats[chat_id] = {"title": f"New Chat - {chat_id[-6: ]}", "lastAccessed": datetime.now()}
                user_doc_ref.update({'chats': chats})
        else:
            return {"error": "User does not exist"}

        collection_name = 'chat'
        document_id = chat_id

        if top_k > 0:
            pinecone_api_key = user_doc_data.get('indicies', {}).get(index_name, {}).get('api_key', '')
            if not pinecone_api_key:
                return {"error": "Invalid Pinecone API Key"}
            pinecone.init(api_key=pinecone_api_key, environment="gcp-starter")
            pinecone_index = pinecone.Index(index_name)
            vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
            index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
        openai.api_key = user_doc_data.get('models', {}).get(index_name, {}).get('api_key', '')
        if not openai_api_key:
            return {'error': "Invalid OpenAI API Key"}



        llm = OpenAI(model=model, temperature=temperature, reuse_client=False)
        if verbose: print("llm ", llm)
        # Update Firestore document with response
        chat_ref = db.collection(collection_name).document(chat_id)
        chat_data = chat_ref.get().to_dict()
        messages = chat_data.get('messages', [])

        if verbose: print("loaded chat history")
        if top_k >0:
            query_engine = index.as_chat_engine(similarity_top_k=top_k,
                                                streaming=True,
                                                chat_mode=ChatMode.CONTEXT)
        else:
            service_context = ServiceContext.from_defaults(llm=llm)
            query_engine = SimpleChatEngine.from_defaults(service_context=service_context)

        if verbose: print("query engine built", query_engine )
        role_map = {True: "user", False: "assistant"}
        loaded_messages = [
                              ChatMessage(role="system",
                                          #   content="You capture some of the essence of Mr. Meeseeks' character (from Rick and Morty), who is known for his eagerness to help, his frustration when tasks become too challenging, and his desire for a quick resolution to his existence."
                                          content="You are a helpful AI assistant, who helps the user compose code for their project. You provide examples where possible. You understand the user cannot easily see the context you can see, so when asked for an example or any other task you do it, and do not instruct the user to look at the context."
                                          )
                          ] + [ChatMessage(role=role_map[m['isUser']], content=m["text"]) for m in messages[:-1]]

        if verbose: print("messages: ", loaded_messages)

        response = query_engine.stream_chat(query, chat_history = loaded_messages) #, chat_history: Optional[List[ChatMessage]] = None)

        if messages == []:
            print('WARNING: messages were empty ?')

        if top_k > 0:
            sources = [{'url': source_node.node.metadata.get('src', ''), 'title' : source_node.node.metadata.get('title', '')} for source_node in response.source_nodes]
        metadata = {
            "temperature" : temperature,
            "top_k" : top_k,
            "index" : index_name
        }

        if verbose: print("sources: ", sources)


        # Append tokens to the last message's 'text' field
        for token in response.response_gen:
            last_message = messages[-1]
            last_message_text = last_message.get('text', '')
            new_text = last_message_text + token

            last_message['text'] = new_text
            if top_k > 0:
                last_message['sources'] = sources
            last_message['metadata'] = metadata
            chat_ref.update({'messages': messages})



        return {"status": "success"}

    except Exception as e:
        # Capture the exception and format the stack trace
        error_message = str(e)
        traceback_info = traceback.format_exc()

        # Return the error message and stack trace
        return {
            'status': 'error',
            'error_message': error_message,
            'stack_trace': traceback_info
        }