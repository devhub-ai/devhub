from flask import request, jsonify
from extensions import neo4j_db
import cloudinary.uploader
import logging

def get_profile(username):
    logged_in_user = request.args.get('logged_in_user')
    query = "MATCH (u:User {username: $username}) RETURN u"
    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username)
        user_record = result.single()
        if not user_record:
            return jsonify({'message': 'User not found'}), 404

        user = user_record["u"]
        profile_data = {
            'username': user["username"],
            'name': user["name"],
            'bio': user["bio"],
            'githubUsername': user["github_username"],
            'leetcodeUsername': user["leetcode_username"],
            'email': user["email"],
            'profileImage' : user["profile_image"]
        }

        projects_query = """
        MATCH (u:User {username: $username})-[:OWNS]->(p:Project)
        RETURN p
        """
        projects_result = session.run(projects_query, username=username)
        projects = []
        for record in projects_result:
            project = record["p"]
            projects.append({
                'title': project["title"],
                'description': project.get("description", ""),
                'repoLink': project.get("repo_link", ""),
                'tags': project.get("tags", "")
            })

        profile_data['projects'] = projects

        if logged_in_user:
            friendship_query = """
            MATCH (u1:User {username: $logged_in_user})-[:FRIEND]->(u2:User {username: $username})
            RETURN COUNT(u1) > 0 AS isFriend
            """
            is_friend = session.run(friendship_query, logged_in_user=logged_in_user, username=username).single()['isFriend']
            profile_data['isFriend'] = is_friend

        return jsonify(profile_data)
    
def upload_image_to_cloudinary(image):
    try:
        upload_result = cloudinary.uploader.upload(image, folder="Devhub/Posts")
        return upload_result['secure_url']
    except Exception as e:
        logging.error(f"Error uploading image: {str(e)}")
        return None

def update_profile(username):
    data = request.form
    profile_image = request.files.get('profileImage')  
    query = "MATCH (u:User {username: $username}) SET u += $properties RETURN u"
    properties = {}

    if profile_image: 
        image_url = upload_image_to_cloudinary(profile_image) 
        if image_url: 
            properties['profile_image'] = image_url  

    if 'name' in data:
        properties['name'] = data['name']
    if 'bio' in data:
        properties['bio'] = data['bio']
    if 'location' in data:
        properties['location'] = data['location']
    if 'githubUsername' in data:
        properties['github_username'] = data['githubUsername']
    if 'leetcodeUsername' in data:
        properties['leetcode_username'] = data['leetcodeUsername']

    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username, properties=properties)
        if result.single():
            return jsonify({'message': 'Profile updated successfully'}), 200
        return jsonify({'message': 'User not found'}), 404

def delete_account(username):
    try:
        with neo4j_db.driver.session() as session:
            delete_projects_query = """
            MATCH (u:User {username: $username})-[:OWNS]->(p:Project)
            DETACH DELETE p
            """
            session.run(delete_projects_query, username=username)

            delete_user_query = """
            MATCH (u:User {username: $username})
            DETACH DELETE u
            """
            session.run(delete_user_query, username=username)

            return jsonify({'message': 'Account and associated projects deleted successfully'}), 200
        
    except Exception as e:
        logging.error(f"Error deleting account: {str(e)}")
        return jsonify({'message': 'An error occurred while deleting the account'}), 500