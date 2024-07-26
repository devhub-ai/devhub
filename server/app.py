from flask import Flask
from config import Config
from extensions import db, bcrypt, cors
import logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "https://devhub-ai.vercel.app"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    logging.basicConfig(level=logging.DEBUG)

    with app.app_context():
        from api.urls import register_routes
        register_routes(app)
        db.create_all()

    # CORS headers middleware
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    return app
