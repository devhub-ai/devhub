from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.chains.graph_qa.cypher import GraphCypherQAChain
from langchain_community.graphs import Neo4jGraph
import sqlite3
import uuid

# Load environment variables
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
os.environ["NEO4J_URI"] = os.getenv("NEO4J_URI")
os.environ["NEO4J_USERNAME"] = os.getenv("NEO4J_USERNAME")
os.environ["NEO4J_PASSWORD"] = os.getenv("NEO4J_PASSWORD")

# Initialize Neo4j graph and language model 
graph = Neo4jGraph()
llm = ChatGoogleGenerativeAI(model="gemini-pro")
chain = GraphCypherQAChain.from_llm(graph=graph, llm=llm, verbose=True)

# Initialize SQLite database connection
def init_db():
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            chat_id TEXT PRIMARY KEY,
            query TEXT NOT NULL,
            response TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def save_chat(chat_id, query, response):
    """Save chat message to SQLite database."""
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO chats (chat_id, query, response) VALUES (?, ?, ?)
    ''', (chat_id, query, response))
    conn.commit()
    conn.close()

def get_chat_by_id(chat_id):
    """Retrieve chat query and response by chat ID from SQLite database."""
    conn = sqlite3.connect('chat.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT query, response FROM chats WHERE chat_id = ?
    ''', (chat_id,))
    result = cursor.fetchone()
    conn.close()
    return {"query": result[0], "response": result[1]} if result else None


def get_graph_response(query):
    """Get response from graph database using natural language query."""
    response = chain.invoke({"query": query})
    return response['result']

def chat():
    """Chat route to handle user queries and return responses."""
    data = request.json
    query = data.get("query")
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    try:
        result = get_graph_response(query)
        chat_id = str(uuid.uuid4())  # Generate unique chat ID
        save_chat(chat_id, query, result)
        return jsonify({"chat_id": chat_id, "result": result}), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while processing the query"}), 500

def retrieve_chat(chat_id):
    """Retrieve chat response by chat ID."""
    try:
        result = get_chat_by_id(chat_id)
        if result:
            return jsonify({"chat_id": chat_id, "result": result}), 200
        else:
            return jsonify({"error": "Chat ID not found"}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving the chat"}), 500

