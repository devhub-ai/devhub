from flask import Flask
from config import Config
from extensions import bcrypt, cors, Neo4jDriver
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    global neo4j_db
    neo4j_db = Neo4jDriver(
        app.config['NEO4J_URI'], 
        app.config['NEO4J_USER'], 
        app.config['NEO4J_PASSWORD']
    )
        
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "https://devhub-ai.vercel.app", "https://www.devhub.page", "https://devhub.page/"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    logging.getLogger('neo4j').setLevel(logging.WARNING)
    logging.getLogger('pymongo').setLevel(logging.WARNING)

    with app.app_context():
        from api.urls import register_routes
        register_routes(app)

    @app.teardown_appcontext
    def close_neo4j(exception):
        neo4j_db.close()

    return app
