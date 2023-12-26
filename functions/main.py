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
            return f"Document data: {data}"
        else:
            return "Document does not exist"
    except Exception as e:
        return f"Error: {str(e)}"

    index_name = req.data['index']
    temperature = float(data.get('temperature', 0.1))
    top_k = int(data.get("topK"), 3)
    model = data.get("model", 'gpt-3.5-turbo')
    if data['indicides'].get(index_name) is None:
        return({'message': "user does not have index name"})
    pinecone_api_key = data['indicies'][index_name]['api_key']
    # index_name = "huggingface-docs-test-23-12-22" #req.args.get('index', "hf-test-12-20-b")
    query = req.data["query"]
    print(query)
    pinecone.init(api_key=pinecone_api_key.value, environment="gcp-starter")
    pinecone_index = pinecone.Index(index_name)
    openai.api_key = openai_api_key.value

    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)


    # https://docs.llamaindex.ai/en/stable/api_reference/llms/openai.html
    llm = OpenAI(model='gpt-3.5-turbo', temperature=0.1)
    query_engine = index.as_query_engine(llm= llm, similarity_top_k=5) #TODO add streaming back in

    response = query_engine.query(query)

    resp_txt = str(response.response)
    print(resp_txt)
return {"text": resp_txt}
