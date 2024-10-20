from flask import request, jsonify
from models import Chat
from extensions import users_chat, chat_collection

def save_message(sender_id, receiver_id, message):
    chat = Chat(sender_id, receiver_id, message)
    chat_collection.insert_one(chat.__dict__)

def get_messages(user_id):
    messages = chat_collection.find({"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]})
    return list(messages)


def search_users():
    username = request.args.get('username')
    
    users = users_chat.find({"username": {"$regex": username, "$options": "i"}})  # Case-insensitive search
    
    return jsonify([{"username": user['username']} for user in users])

def send_message():
    data = request.get_json()
    sender_username = data['sender_username']
    receiver_username = data['receiver_username']
    message = data['message']
    
    # Fetch the sender and receiver users based on their usernames
    sender = users_chat.find_one({"username": sender_username})
    receiver = users_chat.find_one({"username": receiver_username})
    
    if sender and receiver:
        save_message(sender['_id'], receiver['_id'], message) 
        return jsonify({"status": "Message sent!"}), 200
    else:
        return jsonify({"error": "User not found!"}), 404

def get_messages(username):
    user = users_chat.find_one({"username": username})
    
    if user:
        messages = get_messages(user['_id']) 
        return jsonify(messages), 200
    else:
        return jsonify({"error": "User not found!"}), 404