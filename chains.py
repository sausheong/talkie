from langchain import OpenAI, LLMChain, PromptTemplate
from langchain.memory import ConversationBufferWindowMemory, ConversationBufferMemory
from langchain.agents import initialize_agent, Tool
from langchain.chat_models import ChatOpenAI
from langchain.utilities import GoogleSerperAPIWrapper
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA

# get a chat LLM chain, following a prompt template
def get_chat_chain():
    # create prompt from a template
    template = open('template', 'r').read()
    prompt = PromptTemplate(
        input_variables=["history", "human_input"],         
        template=template
    )    
    # create a LLM chain with conversation buffer memory
    return LLMChain(
        llm=OpenAI(temperature=0), 
        prompt=prompt, 
        verbose=True, 
        memory=ConversationBufferWindowMemory(k=10),
    )        

# get a chat chain that uses Serper API to search using Google Search
def get_search_agent():
    # set up the tool    
    search = GoogleSerperAPIWrapper()
    tools = [ Tool(name = "Current Search", func=search.run, description="search")]

    # create and return the chat agent
    return initialize_agent(
        tools=tools,
        llm=ChatOpenAI(),
        agent="chat-conversational-react-description",
        verbose=True,
        memory=ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    )    

def get_qa_chain():
    vectordb = Chroma(persist_directory='.', embedding_function=OpenAIEmbeddings())
    retriever = vectordb.as_retriever()
    return RetrievalQA.from_chain_type(
        llm=ChatOpenAI(temperature=0), 
        chain_type="stuff", 
        retriever=retriever)    