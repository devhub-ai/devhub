from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chains.graph_qa.cypher import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
from extensions import users_chat
import logging
import google.generativeai as genai

# Load environment variables
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
os.environ["NEO4J_URI"] = os.getenv("NEO4J_URI")
os.environ["NEO4J_USERNAME"] = os.getenv("NEO4J_USER")
os.environ["NEO4J_PASSWORD"] = os.getenv("NEO4J_PASSWORD")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize Neo4j graph and language model 
graph = Neo4jGraph()
llm = ChatGoogleGenerativeAI(model="gemini-pro")
chain = GraphCypherQAChain.from_llm(graph=graph, llm=llm, verbose=True)

# Define model configuration
generation_config = {
    "temperature": 0.5,  # Adjust randomness
    "top_p": 0.95,
    "top_k": 50,
    "max_output_tokens": 500,  # Limit the response length
    "response_mime_type": "text/plain",
}

# Initialize the model
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Predefined prompt to guide the chatbot's behavior
pre_prompt = """
You are a model of Devhub and you are here to help people with their queries. you will be provided a question and a previous model response. your work is to see the response and if the response is not upto mark like i don't know the answer or something like that then see the question and answer it properly.
"""

def save_chat(username, query, response):
    """Save chat entry to the user's chat history in the database."""
    chat_entry = {
        'query': query,
        'response': response
    }
    
    logging.info(f"Saving chat for user: {username}")
    logging.info(f"Chat entry: {chat_entry}")
    
    result = users_chat.update_one(
        {'username': username},
        {'$push': {'chat_history': chat_entry}}
    )
    
    if result.modified_count == 0:
        logging.error(f"Failed to update chat history for user: {username}")
    else:
        logging.info(f"Successfully updated chat history for user: {username}")
    
    return chat_entry

def get_chat_history(username):
    """Retrieve chat history for a specific user from MongoDB. If empty, initialize with a welcome message."""
    user = users_chat.find_one({'username': username}, {'chat_history': 1})
    
    if user and 'chat_history' in user:
        # Check if chat history is empty
        if not user['chat_history']:
            # Initialize chat history with a welcome message
            welcome_message = {
                'query': "Hi",
                'response': "Welcome to DevHub!"
            }
            users_chat.update_one(
                {'username': username},
                {'$push': {'chat_history': welcome_message}}
            )
            return [welcome_message]  # Return the newly added message
    
    return user['chat_history'] if user else []

def get_graph_response(query):
    """Get response from graph database using natural language query."""
    response = chain.invoke({"query": query})
    return response['result']

def chat():
    """Chat route to handle user queries and return responses."""
    data = request.json
    query = data.get("query")
    username = data.get("username")  # Get username from request body
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    if not username:
        return jsonify({"error": "Username is required"}), 400  # Check for username
    
    try:
        result = get_graph_response(query)
        response = model.generate_content(pre_prompt+query+result)
        chat_id = save_chat(username, query, response.text)
        return jsonify({"chat_id": chat_id, "result": response.text}), 200
    except Exception as e:
        logging.error(f"Error in chat: {str(e)}")
        return jsonify({"error": "An error occurred while processing the query"}), 500

def chat_history():
    """Retrieve chat history for the specified user."""
    username = request.args.get("username")  # Get username from query parameters
    
    if not username:
        return jsonify({"error": "Username is required"}), 400  # Check for username
    
    try:
        history = get_chat_history(username)
        return jsonify({"chat_history": history}), 200
    except Exception as e:
        logging.error(f"Error retrieving chat history: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving the chat history"}), 500