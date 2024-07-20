import logging
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Configure CORS with credentials
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)

@app.before_request
def before_request():
    if not hasattr(app, 'has_created_tables'):
        db.create_all()
        app.has_created_tables = True

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(username=data['username'], email=data['email'], password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        app.logger.error('Error occurred during signup: %s', e)
        return jsonify({'message': 'Internal Server Error'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        session['username'] = user.username
        return jsonify({'message': 'Login successful', 'redirect': '/home'}), 200
    else:
        return jsonify({'message': 'Login failed'}), 401

@app.route('/check_auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'username': session['username']}), 200
    else:
        return jsonify({'authenticated': False}), 200

@app.route('/home')
def home():
    if 'user_id' in session:
        return jsonify({'message': f'Welcome {session["username"]}'}), 200
    else:
        return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({'message': 'Logout successful', 'redirect': '/'}), 200

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('home'))
    return jsonify({'message': 'This is the landing page'}), 200

if __name__ == '__main__':
    app.run(debug=True)
