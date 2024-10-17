from flask import request, jsonify, session, redirect, url_for, current_app
from flask import Flask, request, jsonify, session as flask_session
from extensions import bcrypt, neo4j_db, users_chat
from models import User
from pymongo import MongoClient

def signup():
    try:
        data = request.get_json()
        
        query = """
        MATCH (u:User)
        WHERE u.username = $username OR u.email = $email
        RETURN u
        """
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=data['username'], email=data['email'])
            existing_user = result.single()
        
        if existing_user:
            if existing_user['u']['username'] == data['username']:
                return jsonify({'message': 'Username already exists'}), 400
            if existing_user['u']['email'] == data['email']:
                return jsonify({'message': 'Email already exists'}), 400
        
        # Create new user if not existing
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        query = """
        CREATE (u:User {username: $username, email: $email, password: $password})
        """
        with neo4j_db.driver.session() as session:
            session.run(query, username=data['username'], email=data['email'], password=hashed_password)
        
        # Insert user into MongoDB with an empty chat history array
        mongo_user = {
            'username': data['username'],
            'chat_history': []
        }
        users_chat.insert_one(mongo_user)
        
        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        current_app.logger.error('Error occurred during signup: %s', e)
        return jsonify({'message': 'Internal Server Error'}), 500

def check_username():
    username = request.args.get('username')
    if username:
        query = "MATCH (u:User {username: $username}) RETURN u"
        try:
            with neo4j_db.driver.session() as session:
                result = session.run(query, username=username)
                existing_user = result.single()
            if existing_user:
                return jsonify({'available': False}), 200
            else:
                return jsonify({'available': True}), 200
        except Exception as e:
            current_app.logger.error('Error occurred while checking username: %s', e)
            return jsonify({'message': 'Internal Server Error'}), 500
    return jsonify({'message': 'Username not provided'}), 400

def login():
    data = request.get_json()
    try:
        query = """
        MATCH (u:User {username: $username})
        RETURN u
        """
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=data['username'])
            user = result.single()
        
        if user and bcrypt.check_password_hash(user['u']['password'], data['password']):
            flask_session['user_id'] = user['u']['id']
            flask_session['username'] = user['u']['username']
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'message': 'Internal server error'}), 500

def check_auth():
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'username': session['username']}), 200
    else:
        return jsonify({'authenticated': False}), 200

def home():
    if 'user_id' in session:
        return jsonify({'message': f'Welcome {session["username"]}'}), 200
    else:
        return redirect(url_for('index'))

def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({'message': 'Logout successful', 'redirect': '/'}), 200

def index():
    if 'user_id' in session:
        return redirect(url_for('home'))
    return jsonify({'message': 'This is the landing page'}), 200
