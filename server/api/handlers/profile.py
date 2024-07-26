from flask import request, jsonify, current_app
from extensions import db
from models import User, Project

def get_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Fetch the user's projects if you have a related model
    projects = Project.query.filter_by(user_id=user.id).all()
    profile_data = {
        'username': user.username,
        'bio': user.bio,  # Make sure the User model has a bio field
        'githubUsername': user.github_username,  # Make sure the User model has a github_username field
        'projects': [
            {
                'title': project.title,
                'description': project.description,
                'repoLink': project.repo_link,
                'tags': project.tags.split()  # Assuming tags are stored as space-separated strings
            }
            for project in projects
        ]
    }
    return jsonify(profile_data)

def update_profile(username):
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404

    data = request.get_json()
    if 'bio' in data:
        user.bio = data['bio']
    if 'githubUsername' in data:
        user.github_username = data['githubUsername']

    try:
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        current_app.logger.error('Error occurred during profile update: %s', e)
        return jsonify({'message': 'Internal Server Error'}), 500

def add_project(username):
    user = User.query.filter_by(username=username).first()
    if user:
        data = request.get_json()
        project = Project(
            user_id=user.id,
            title=data['title'],
            description=data.get('description', ''),
            repo_link=data.get('repo_link', ''),
            tags=' '.join(data.get('tags', []))  # Join tags with spaces
        )
        db.session.add(project)
        db.session.commit()
        return jsonify({'message': 'Project added successfully'}), 201
    return jsonify({'message': 'User not found'}), 404

def update_project(username, project_id):
    user = User.query.filter_by(username=username).first()
    if user:
        project = Project.query.filter_by(id=project_id, user_id=user.id).first()
        if project:
            data = request.get_json()
            project.title = data.get('title', project.title)
            project.description = data.get('description', project.description)
            project.repo_link = data.get('repo_link', project.repo_link)
            project.tags = ' '.join(data.get('tags', project.tags.split()))  # Join tags with spaces
            db.session.commit()
            return jsonify({'message': 'Project updated successfully'}), 200
        return jsonify({'message': 'Project not found'}), 404
    return jsonify({'message': 'User not found'}), 404

def delete_project(username, project_id):
    user = User.query.filter_by(username=username).first()
    if user:
        project = Project.query.filter_by(id=project_id, user_id=user.id).first()
        if project:
            db.session.delete(project)
            db.session.commit()
            return jsonify({'message': 'Project deleted successfully'}), 200
        return jsonify({'message': 'Project not found'}), 404
    return jsonify({'message': 'User not found'}), 404
