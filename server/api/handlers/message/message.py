from flask import request, jsonify
from models import Chat
from extensions import users_chat

chat_instance = Chat()

def send_message():
    data = request.json
    sender = data.get('sender_username')
    receiver = data.get('receiver_username')
    message = data.get('message')

    if not sender or not receiver or not message:
        return jsonify({'error': 'Sender, receiver, and message are required.'}), 400

    chat_instance.send_message(sender, receiver, message)
    return jsonify({'status': 'Message sent successfully.'}), 200

def get_messages():
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')

    if not user1 or not user2:
        return jsonify({'error': 'Both users are required.'}), 400

    messages = chat_instance.get_messages(user1, user2)
    return jsonify(messages), 200

def get_chatted_users(username):
    try:
        chatted_users = chat_instance.get_chatted_users(username)
        return jsonify(chatted_users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_chat_history(user1, user2):
    try:
        chat_history = chat_instance.get_messages(user1, user2)  
        return jsonify(chat_history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def search_users():
    username = request.args.get('username')

    if not username:
        return jsonify({'error': 'Username parameter is required.'}), 400

    users = users_chat.find({"username": {"$regex": username, "$options": "i"}})  
    return jsonify([{"username": user['username']} for user in users]), 200
