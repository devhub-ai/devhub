from flask import request, jsonify, current_app
from models import Project
from extensions import neo4j_db
import uuid

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
            # Check if the user has already starred the project
            check_result = session.run(check_query, username=username, project_id=project_id)
            if check_result.single():
                return jsonify({'message': 'You have already starred this project'}), 400

            # Increment the star count and create a STARRED relationship
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
                    'starCount' : project.get('star')
                })
            
            if projects:
                return jsonify({'projects': projects}), 200
            else:
                return jsonify({'message': 'No projects found for the user'}), 404

    except Exception as e:
        current_app.logger.error(f"Error fetching projects: {e}")
        return jsonify({'message': 'An error occurred while fetching projects'}), 500

def add_project(username):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description', '')
    repo_link = data.get('repo_link', '')
    tags = data.get('tags', '')
    project_id = str(uuid.uuid4())

    domain_tags = [tag.strip() for tag in tags.split(',') if tag.strip()]

    create_project_query = """
    MATCH (u:User {username: $username})
    CREATE (p:Project {project_id: $project_id, title: $title, description: $description, repo_link: $repo_link, star: 0})
    CREATE (u)-[:OWNS]->(p)
    RETURN p
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(create_project_query, username=username, project_id=project_id, title=title, description=description, repo_link=repo_link)
            project_record = result.single()
            
            if project_record:
                project = project_record["p"]
                
                if domain_tags:
                    update_project_query = """
                    MATCH (p:Project {project_id: $project_id})
                    WITH p, $tags AS tags
                    UNWIND tags AS tagName
                    MERGE (t:Tag {name: tagName})
                    CREATE (p)-[:TAGGED_WITH]->(t)
                    RETURN p
                    """
                    session.run(update_project_query, project_id=project_id, tags=domain_tags)
                
                return jsonify({
                    'message': 'Project added and categorized successfully',
                    'project': {
                        'projectId': project["project_id"],
                        'title': project["title"],
                        'description': project.get("description", ""),
                        'repoLink': project.get("repo_link", ""),
                        'tags': domain_tags,
                        'star': 0
                    }
                }), 201
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
    tags = [tag.strip() for tag in data.get('tags', '').split(',')] if data.get('tags') else []

    query = """
    MATCH (u:User {username: $username})-[:OWNS]->(p:Project {project_id: $project_id})
    SET p.title = $title, p.description = $description, p.repo_link = $repo_link
    WITH p
    OPTIONAL MATCH (p)-[r:TAGGED_WITH]->(t:Tag)
    DELETE r
    WITH p, $tags AS tags
    UNWIND tags AS tagName
    MERGE (t:Tag {name: tagName})
    MERGE (p)-[:TAGGED_WITH]->(t)  // Change here to use MERGE for the relationship
    RETURN p
    """
    try:
        with neo4j_db.driver.session() as session:
            result = session.run(query, username=username, project_id=project_id, title=title, description=description, repo_link=repo_link, tags=tags)
            if result.single():
                return jsonify({'message': 'Project updated successfully'}), 200
            return jsonify({'message': 'Project or user not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error updating project: {e}")
        return jsonify({'message': 'An error occurred while updating the project'}), 500

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
