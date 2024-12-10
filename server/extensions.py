from flask_bcrypt import Bcrypt
from flask_cors import CORS
from neo4j import GraphDatabase
from config import Config
from pymongo import MongoClient

bcrypt = Bcrypt()
cors = CORS()

class Neo4jDriver:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

neo4j_db = Neo4jDriver(
    uri=Config.NEO4J_URI,
    user=Config.NEO4J_USER,
    password=Config.NEO4J_PASSWORD
)

mongo_client = MongoClient(Config.MONGODB_URI)
mongo_db = mongo_client['devhub']
users_chat = mongo_db['users']
chat_collection = mongo_db['chats']
posts_collection = mongo_db['posts']
comments_collection = mongo_db['comments']
feedback_collection = mongo_db['feedback']