from flask import request, jsonify, current_app
from extensions import neo4j_db
from models import User, Project, Tag
from sqlalchemy.orm import sessionmaker
import os

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
            'email': user["email"]
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
            # Check if the logged-in user is friends with the profile user
            friendship_query = """
            MATCH (u1:User {username: $logged_in_user})-[:FRIEND]->(u2:User {username: $username})
            RETURN COUNT(u1) > 0 AS isFriend
            """
            is_friend = session.run(friendship_query, logged_in_user=logged_in_user, username=username).single()['isFriend']
            profile_data['isFriend'] = is_friend

        return jsonify(profile_data)


def update_profile(username):
    data = request.get_json()
    query = "MATCH (u:User {username: $username}) SET u += $properties RETURN u"
    properties = {}
    if 'name' in data:
        properties['name'] = data['name']
    if 'bio' in data:
        properties['bio'] = data['bio']
    if 'githubUsername' in data:
        properties['github_username'] = data['githubUsername']
    if 'leetcodeUsername' in data:
        properties['leetcode_username'] = data['leetcodeUsername']

    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username, properties=properties)
        if result.single():
            return jsonify({'message': 'Profile updated successfully'}), 200
        return jsonify({'message': 'User not found'}), 404

def add_project(username):
    data = request.get_json()

    # Get project details from request
    title = data.get('title')
    description = data.get('description', '')
    repo_link = data.get('repo_link', '')
    tags = data.get('tags', '')

    # Define a query to create a project without tags initially
    create_project_query = """
    MATCH (u:User {username: $username})
    CREATE (p:Project {title: $title, description: $description, repo_link: $repo_link, tags: $tags})
    CREATE (u)-[:OWNS]->(p)
    RETURN p
    """
    
    try:
        with neo4j_db.driver.session() as session:
            # Create the project
            result = session.run(create_project_query, username=username, title=title, description=description, repo_link=repo_link, tags=tags)
            project_record = result.single()
            
            if project_record:
                project = project_record["p"]
                
                domain_tags = [tag for tag in tags.split(',') if tag.strip() in tags]

                # Update project with tags
                update_project_query = """
                MATCH (p:Project {title: $title, description: $description, repo_link: $repo_link})
                WITH p, $tags AS tags
                UNWIND tags AS tagName
                MERGE (t:Tag {name: tagName})
                CREATE (p)-[:TAGGED_WITH]->(t)
                RETURN p
                """
                
                # Update the project with tags
                session.run(update_project_query, title=title, description=description, repo_link=repo_link, tags=domain_tags)
                
                return jsonify({'message': 'Project added and categorized successfully', 'project': {
                    'title': project["title"],
                    'description': project.get("description", ""),
                    'repoLink': project.get("repo_link", ""),
                    'tags': domain_tags
                }}), 201
            else:
                return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error adding project: {e}")
        return jsonify({'message': 'An error occurred while adding the project'}), 500



def update_project(username, project_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    repo_link = data.get('repo_link')
    tags = data.get('tags', '')

    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {id: $project_id})
    SET p.title = $title, p.description = $description, p.repo_link = $repo_link
    WITH p
    OPTIONAL MATCH (p)-[r:TAGGED_WITH]->(t:Tag)
    DELETE r
    WITH p
    UNWIND $tags AS tagName
    MERGE (t:Tag {name: tagName})
    CREATE (p)-[:TAGGED_WITH]->(t)
    RETURN p
    """
    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username, project_id=project_id, title=title, description=description, repo_link=repo_link, tags=tags.split(', ') if tags else [])
        if result.single():
            return jsonify({'message': 'Project updated successfully'}), 200
        return jsonify({'message': 'Project or user not found'}), 404

def delete_project(username, project_title):
    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {title: $project_title})
    OPTIONAL MATCH (p)-[r]-()
    DELETE r, p
    RETURN u
    """
    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username, project_title=project_title)
        if result.single():
            return jsonify({'message': 'Project deleted successfully'}), 200
        return jsonify({'message': 'Project or user not found'}), 404