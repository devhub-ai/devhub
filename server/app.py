from flask import Flask
from config import Config
from extensions import db, bcrypt, cors
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    bcrypt.init_app(app)
    # Configure CORS with credentials - to be migratred to consts.py
    cors.init_app(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

    logging.basicConfig(level=logging.DEBUG)

    with app.app_context():
        from api.urls import register_routes
        register_routes(app)
        db.create_all()

    return app
