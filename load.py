import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.vectorstores import Chroma
from dotenv import load_dotenv
load_dotenv()

if not (os.path.exists('chroma-collections.parquet') and os.path.exists('chroma-embeddings.parquet')):
    loader = DirectoryLoader(os.environ['LOAD_DIR'])
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    vectordb = Chroma.from_documents(
        documents=docs, 
        embedding=OpenAIEmbeddings(), 
        persist_directory='.')
    vectordb.persist()

