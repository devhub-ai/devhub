from flask import request, jsonify, current_app
from models import Project
from extensions import neo4j_db
import uuid
from flask import request, jsonify
import cloudinary.uploader
import logging
import cloudinary
import os

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def add_project(username):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    repo_link = data.get('repo_link', '')
    tags = data.get('tags', '')
    image_url = data.get('imageUrl', '') 
    project_id = str(uuid.uuid4())

    # Clean and prepare the tags
    domain_tags = [tag.strip() for tag in tags.split(',') if tag.strip()]

    create_project_query = """
    MATCH (u:User {username: $username})
    CREATE (p:Project {project_id: $project_id, title: $title, description: $description, repo_link: $repo_link, star: 0, image_url: $image_url})
    CREATE (u)-[:OWNS]->(p)
    WITH u, p
    FOREACH (tagName IN $tags |
        MERGE (t:Tag {name: tagName})
        MERGE (p)-[:TAGGED_WITH]->(t)
        MERGE (u)-[:HAS_SKILL]->(t)
    )
    RETURN p
    """
    
    try:
        with neo4j_db.driver.session() as session:
            # Create the project
            result = session.run(create_project_query, username=username, project_id=project_id, title=title, description=description, repo_link=repo_link, image_url=image_url, tags=domain_tags)
            project_record = result.single()
            
            if project_record:
                project = project_record["p"]

                # Mutual suggestion update logic
                mutual_update_query = """
                MATCH (u:User {username: $username})-[:HAS_SKILL]->(t:Tag)
                WITH u, collect(DISTINCT t.name) AS skills
                SET u.skillset = skills
                WITH u
                MATCH (other:User)-[:HAS_SKILL]->(t) 
                WHERE other.username <> u.username AND t.name IN u.skillset
                WITH u, other, count(t) AS matching_skills
                // Update suggestions regardless of previous state
                FOREACH (_ IN CASE WHEN matching_skills >= 2 THEN [1] ELSE [] END |
                    SET u.suggestions = coalesce(u.suggestions, []) + other.username
                )
                FOREACH (_ IN CASE WHEN matching_skills >= 2 AND NOT other.username IN u.suggestions THEN [1] ELSE [] END |
                    SET other.suggestions = coalesce(other.suggestions, []) + u.username
                )
                RETURN u, other
                """
                
                suggestion_result = session.run(mutual_update_query, username=username)
                
                # Check if any suggestions were made
                suggestions_updated = suggestion_result.data()
                if not suggestions_updated:
                    current_app.logger.info(f"No users matched for suggestions for {username}.")

                return jsonify({
                    'message': 'Project added successfully',
                    'project': {
                        'projectId': project["project_id"],
                        'title': project["title"],
                        'description': project.get("description", ""),
                        'repoLink': project.get("repo_link", ""),
                        'tags': domain_tags,
                        'imageUrl': project.get("image_url", ""), 
                        'star': 0
                    }
                }), 201 
            else:
                return jsonify({'message': 'User not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error adding project: {e}")
        return jsonify({'message': 'An error occurred while adding the project'}), 500


def get_projects(username):
    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project)
    OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
    RETURN p, collect(t.name) AS tags
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username)
            projects = []

            for record in result:
                project = record["p"]
                tags = record["tags"]
                projects.append({
                    'projectId': project.get('project_id'),
                    'title': project.get('title'),
                    'description': project.get('description', ''),
                    'repoLink': project.get('repo_link', ''),
                    'tags': tags if tags else [],
                    'imageUrl': project.get('image_url', ''),  
                    'starCount': project.get('star')
                })
            
            if projects:
                return jsonify({'projects': projects}), 200
            else:
                return jsonify({'message': 'No projects found for the user'}), 404

    except Exception as e:
        current_app.logger.error(f"Error fetching projects: {e}")
        return jsonify({'message': 'An error occurred while fetching projects'}), 500

def increment_star(username, project_id):
    check_query = """
    MATCH (u:User {username: $username})-[:STARRED]->(p:Project {project_id: $project_id})
    RETURN p
    """
    increment_star_query = """
    MATCH (u:User {username: $username}), (p:Project {project_id: $project_id})
    WHERE NOT (u)-[:STARRED]->(p)
    SET p.star = p.star + 1
    CREATE (u)-[:STARRED]->(p)
    RETURN p
    """
    try:
        with neo4j_db.driver.session() as session:
            check_result = session.run(check_query, username=username, project_id=project_id)
            if check_result.single():
                return jsonify({'message': 'You have already starred this project'}), 400

            result = session.run(increment_star_query, username=username, project_id=project_id)
            project_record = result.single()

            if project_record:
                project = project_record["p"]
                return jsonify({
                    'message': 'Star count incremented successfully',
                    'project': {
                        'projectId': project["project_id"],
                        'title': project["title"],
                        'description': project.get("description", ""),
                        'repoLink': project.get("repo_link", ""),
                        'star': project.get("star")
                    }
                }), 200
            else:
                return jsonify({'message': 'Project not found'}), 404

    except Exception as e:
        current_app.logger.error(f"Error incrementing star count: {e}")
        return jsonify({'message': 'An error occurred while incrementing the star count'}), 500
    
def update_project(username, project_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    repo_link = data.get('repo_link')
    tags = [tag.strip() for tag in data.get('tags', '').split(',')] if data.get('tags') else []
    image_url = data.get('imageUrl', '') 

    # Query to check if the user and project exist
    check_query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {project_id: $project_id})
    RETURN u, p
    """
    
    # Update query
    update_query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {project_id: $project_id})
    SET p.title = $title, p.description = $description, p.repo_link = $repo_link, p.image_url = $image_url
    WITH p
    OPTIONAL MATCH (p)-[r:TAGGED_WITH]->(t:Tag)
    DELETE r
    WITH p, $tags AS tags
    UNWIND tags AS tagName
    MERGE (t:Tag {name: tagName})
    MERGE (p)-[:TAGGED_WITH]->(t)
    RETURN p
    """

    try:
        with neo4j_db.driver.session() as session:
            # First check if the user and project exist
            check_result = session.run(check_query, username=username, project_id=project_id)
            if not check_result.single():
                return jsonify({'message': 'User or project not found'}), 404

            # Proceed with the update if user and project exist
            result = session.run(update_query, username=username, project_id=project_id, title=title, description=description, repo_link=repo_link, image_url=image_url, tags=tags)
            if result.single():
                return jsonify({'message': 'Project updated successfully'}), 200
            
            return jsonify({'message': 'Project not found or no changes made'}), 404
    except Exception as e:
        current_app.logger.error(f"Error updating project: {e}")
        return jsonify({'message': 'An error occurred while updating the project'}), 500

def project_details(username, project_id):
    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {project_id: $project_id})
    OPTIONAL MATCH (p)-[:TAGGED_WITH]->(t:Tag)
    RETURN p, collect(t.name) AS tags
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username, project_id=project_id)
            record = result.single()

            if record:
                project = record["p"]
                tags = record["tags"]
                return jsonify({
                    'projectId': project.get('project_id'),
                    'title': project.get('title'),
                    'description': project.get('description', ''),
                    'repoLink': project.get('repo_link', ''),
                    'tags': tags if tags else [],
                    'imageUrl': project.get('image_url', ''),
                    'starCount' : project.get('star')
                }), 200
            else:
                return jsonify({'message': 'Project not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error fetching project details: {e}")
        return jsonify({'message': 'An error occurred while fetching project details'}), 500

def delete_project(username, project_id):
    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {project_id: $project_id})
    OPTIONAL MATCH (p)-[r]-()
    DELETE r, p
    RETURN u
    """
    with neo4j_db.driver.session() as session:
        result = session.run(query, username=username, project_id=project_id)
        if result.single():
            return jsonify({'message': 'Project deleted successfully'}), 200
        return jsonify({'message': 'Project or user not found'}), 404
    
def upload_image():
    try:
        # Check if the image is part of the request
        if 'image' not in request.files:
            return jsonify({'error': 'No image part in the request'}), 400

        # Get the image file from the request
        image = request.files['image']

        if image.filename == '':
            return jsonify({'error': 'No image selected for uploading'}), 400

        # Upload to Cloudinary
        upload_result = cloudinary.uploader.upload(image, folder="Devhub/Projects")

        # Return the image URL after uploading
        image_url = upload_result['secure_url']
        return jsonify({'imageUrl': image_url}), 200

    except Exception as e:
        # Log the error for debugging
        logging.error(f"Error uploading image: {str(e)}")
        return jsonify({'error': 'An error occurred while uploading the image', 'details': str(e)}), 500
