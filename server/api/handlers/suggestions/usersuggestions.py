from flask import jsonify, current_app
from extensions import neo4j_db

def get_common_users_with_same_tags_BFS(username):
    query = """
    MATCH (u1:User)-[:CONNECTED_TO]->(:Project)-[:TAGGED_WITH]->(tag:Tag)<-[:TAGGED_WITH]-(:Project)<-[:CONNECTED_TO]-(u2:User)
    WHERE u1.username = $username AND u1 <> u2
    RETURN u2.username AS commonUser, collect(tag.name) AS commonTags
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username)
            common_users = []
            for record in result:
                common_users.append({
                    'commonUser': record['commonUser'],
                    'commonTags': record['commonTags']
                })
            return jsonify({
                'username': username,
                'commonUsers': common_users
            }), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving common users with same tags: {e}")
        return jsonify({
            'message': 'An error occurred while retrieving common users'
        }), 500

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

