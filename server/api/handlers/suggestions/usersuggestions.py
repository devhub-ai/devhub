from flask import jsonify, current_app
from extensions import neo4j_db

def get_user_suggestions(username):
    query = """
    MATCH (u:User {username: $username})-[:FRIEND]-(friend)
    WITH u, collect(friend.username) AS friends
    MATCH (u:User {username: $username})
    RETURN u.suggestions AS suggestions, friends
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username)
            user_record = result.single()

            if user_record and user_record.get("suggestions") is not None:
                suggestions = user_record["suggestions"] or []
                friends = user_record["friends"] or []
                
                # Filter out friends from suggestions
                suggestions = [s for s in suggestions if s not in friends]
                
                return jsonify({
                    'username': username,
                    'suggestions': suggestions
                }), 200
            else:
                return jsonify({
                    'message': 'User not found or no suggestions available'
                }), 404
    except Exception as e:
        current_app.logger.error(f"Error retrieving user suggestions: {e}")
        return jsonify({
            'message': 'An error occurred while retrieving suggestions'
        }), 500

