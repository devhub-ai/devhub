import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') 
    NEO4J_URI = os.getenv('NEO4J_URI')
    NEO4J_USER = os.getenv('NEO4J_USER')
    NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD')
    MONGODB_URI = os.getenv('MONGODB_URI')
    
cloudinary.config(
  CLOUDINARY_NAME = os.getenv('CLOUDINARY_NAME'),
  CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
)
