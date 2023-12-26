# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_admin import initialize_app

from firebase_functions.params import IntParam, StringParam

import pinecone
from llama_index.llms import OpenAI
from llama_index.storage.storage_context import StorageContext
from llama_index import VectorStoreIndex
from llama_index.vector_stores import PineconeVectorStore

from google.cloud import firestore

import openai


# pinecone_api_key = StringParam("PINECONE_API_KEY")
openai_api_key = StringParam("OPENAI_API_KEY")
initialize_app()

@https_fn.on_call()
def sme(req: https_fn.CallableRequest) -> https_fn.Request:
    print(req.data)
    db = firestore.Client()

    # Replace 'your-collection' and 'your-document-id' with your collection and document IDs
    collection_name = 'user'
    document_id = 'trevo'

    # Reference to the Firestore document
    document_ref = db.collection(collection_name).document(document_id)

    try:
        # Get the document data
        document_data = document_ref.get()

        # Check if the document exists
        if document_data.exists:
            # Access the document data as a dictionary
            data = document_data.to_dict()

        else:
            return "User does not exist"
    except Exception as e:
        return f"Error: {str(e)}"

    index_name = req.data['index']
    temperature = float(data.get('temperature', 0.1))

    top_k = int(data.get("top_k", 3))

    model = data.get("model", 'gpt-3.5-turbo')
    if data['indicies'].get(index_name) is None:
        return({'message': "user does not have index name"})
    pinecone_api_key = data['indicies'][index_name]['api_key']
    chat_id = data['chat_id']
    # index_name = "huggingface-docs-test-23-12-22" #req.args.get('index', "hf-test-12-20-b")
    query = req.data["query"]
    print(query)
    pinecone.init(api_key=pinecone_api_key, environment="gcp-starter")
    pinecone_index = pinecone.Index(index_name)
    openai.api_key = openai_api_key.value

    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)


    # https://docs.llamaindex.ai/en/stable/api_reference/llms/openai.html
    llm = OpenAI(model=model, temperature=temperature)
    query_engine = index.as_query_engine(llm= llm, similarity_top_k=top_k)
    response = query_engine.query(query)

    collection_name = 'chat'
    document_id = chat_id
    field_name = 'messages'


    for token in response.response_gen:
        characters_to_add = token
        try:
            # Retrieve the Firestore document
            document_ref = db.collection(collection_name).document(document_id)
            document = document_ref.get()

            if document.exists:
                data = document.to_dict()

                # Check if the document has an array with at least one element
                if field_name in data and isinstance(data[field_name], list) and len(data[field_name]) > 0:
                    # Get the last element of the array
                    last_element = data[field_name][-1]

                    # Check if the last element is a map
                    if isinstance(last_element, dict):
                        # Check if the map contains the field with the string value
                        if field_name in last_element and isinstance(last_element[field_name], str):
                            # Update the string value by adding characters
                            last_element[field_name] += characters_to_add

                            # Update the Firestore document with the modified data
                            document_ref.update({field_name: data[field_name]})

                            return "String updated successfully"

        except Exception as e:
            return f"Error while adding chat to firestore: {str(e)}"



    resp_txt = str(response.response)
    print(resp_txt)
    return {"text": resp_txt}
