from flask import Blueprint, request, jsonify
from extensions import neo4j_db

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/profile/<username>/friends', methods=['POST'])
def add_friend(username):
    data = request.get_json()
    friend_username = data.get('friend_username')

    if not friend_username:
        return jsonify({'error': 'Friend username is required'}), 400

    with neo4j_db.driver.session() as session:
        # Check if the user exists
        user_exists = session.run(
            "MATCH (u:User {username: $username}) RETURN u", username=username
        ).single()

        if not user_exists:
            return jsonify({'error': 'User not found'}), 404

        # Check if the friend exists
        friend_exists = session.run(
            "MATCH (u:User {username: $friend_username}) RETURN u", friend_username=friend_username
        ).single()

        if not friend_exists:
            return jsonify({'error': 'Friend not found'}), 404

        # Create a bidirectional friendship
        session.run(
            "MATCH (u:User {username: $username}), (f:User {username: $friend_username}) "
            "MERGE (u)-[:FRIEND]->(f) "
            "MERGE (f)-[:FRIEND]->(u)",
            username=username, friend_username=friend_username
        )

    return jsonify({'message': 'Friend added successfully'}), 200

@friends_bp.route('/profile/<username>/friends', methods=['DELETE'])
def remove_friend(username):
    data = request.get_json()
    friend_username = data.get('friend_username')

    if not friend_username:
        return jsonify({'error': 'Friend username is required'}), 400

    with neo4j_db.driver.session() as session:
        # Check if the user exists
        user_exists = session.run(
            "MATCH (u:User {username: $username}) RETURN u", username=username
        ).single()

        if not user_exists:
            return jsonify({'error': 'User not found'}), 404

        # Check if the friend exists
        friend_exists = session.run(
            "MATCH (u:User {username: $friend_username}) RETURN u", friend_username=friend_username
        ).single()

        if not friend_exists:
            return jsonify({'error': 'Friend not found'}), 404

        # Remove the bidirectional friendship
        session.run(
            "MATCH (u:User {username: $username})-[r:FRIEND]-(f:User {username: $friend_username}) "
            "DELETE r",
            username=username, friend_username=friend_username
        )
        session.run(
            "MATCH (f:User {username: $friend_username})-[r:FRIEND]-(u:User {username: $username}) "
            "DELETE r",
            username=username, friend_username=friend_username
        )

    return jsonify({'message': 'Friend removed successfully'}), 200

@friends_bp.route('/profile/<username>/friends', methods=['GET'])
def get_friends(username):
    with neo4j_db.driver.session() as session:
        result = session.run(
            "MATCH (u:User {username: $username})-[:FRIEND]->(f:User) "
            "RETURN f.username AS friend_username",
            username=username
        )

        friends = [record['friend_username'] for record in result]

    return jsonify({'friends': friends}), 200
