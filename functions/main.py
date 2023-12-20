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

import openai


pinecone_api_key = StringParam("PINECONE_API_KEY")
openai_api_key = StringParam("OPENAI_API_KEY")
initialize_app()


@https_fn.on_request()
def hello_world(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response("Hello world!")

@https_fn.on_request()
def echo(req: https_fn.Request) -> https_fn.Response:
    return https_fn.Response(req.args.get('text', "Say something"))

@https_fn.on_request()
def sme(req: https_fn.Request) -> https_fn.Request:

    index_name = req.args.get('index', "hf-test-12-20-b")
    query = req.args.get("query")

    pinecone.init(api_key=pinecone_api_key.value, environment="gcp-starter")
    pinecone_index = pinecone.Index(index_name)
    openai.api_key = openai_api_key.value

    vector_store = PineconeVectorStore(pinecone_index=pinecone_index)
    index = VectorStoreIndex.from_vector_store(vector_store=vector_store)


    # https://docs.llamaindex.ai/en/stable/api_reference/llms/openai.html
    llm = OpenAI(model='gpt-3.5-turbo', temperature=0.1)
    query_engine = index.as_query_engine(llm= llm, similarity_top_k=5) #TODO add streaming back in

    response = query_engine.query(query)

    return https_fn.Response("Oooh yea, caaan do:\n\n\n" + response.response)
