from flask import request, jsonify, session, redirect, url_for, current_app
from extensions import db, bcrypt
from models import User

def signup():
    try:
        data = request.get_json()
        
        existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
        if existing_user:
            if existing_user.username == data['username']:
                return jsonify({'message': 'Username already exists'}), 400
            if existing_user.email == data['email']:
                return jsonify({'message': 'Email already exists'}), 400
        
        # Create new user if not existing
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        current_app.logger.error('Error occurred during signup: %s', e)
        return jsonify({'message': 'Internal Server Error'}), 500

def check_username():
    username = request.args.get('username')
    if username:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({'available': False}), 200
        else:
            return jsonify({'available': True}), 200
    return jsonify({'message': 'Username not provided'}), 400

def login():
    try:
        data = request.get_json()
   
        user = User.query.filter_by(username=data['username']).first()
        if user:
            if bcrypt.check_password_hash(user.password, data['password']):
                session['user_id'] = user.id
                session['username'] = user.username
                return jsonify({'message': 'Login successful', 'redirect': '/home'}), 200
            else:
                return jsonify({'message': 'Incorrect password'}), 401
        else:
            return jsonify({'message': 'User does not exist'}), 404
    except Exception as e:
        current_app.logger.error('Error occurred during login: %s', e)
        return jsonify({'message': 'Internal Server Error'}), 500


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
