from flask import request, jsonify
from bson import ObjectId
import cloudinary.uploader
import logging
from models import Post, Comment
from extensions import posts_collection, comments_collection

def get_posts():
    posts = list(posts_collection.find().sort("created_at", -1))  
    for post in posts:
        post['_id'] = str(post['_id'])  

        comments = list(comments_collection.find({"post_id": ObjectId(post['_id'])}))
        for comment in comments:
            comment['_id'] = str(comment['_id']) 
            comment['post_id'] = str(comment['post_id']) 
            comment['user_username'] = str(comment['user_username'])  
        post['comments'] = comments
    
    return jsonify(posts), 200

def upload_image_to_cloudinary(image):
    try:
        upload_result = cloudinary.uploader.upload(image, folder="Devhub/Posts")
        return upload_result['secure_url']
    except Exception as e:
        logging.error(f"Error uploading image: {str(e)}")
        return None

def create_post():
    data = request.form
    author_username = data['author_username']
    description = data['description']
    tags = data.getlist('tags')
    image_url = None

    if 'image' in request.files:
        image_file = request.files['image']
        if image_file.filename != '':
            image_url = upload_image_to_cloudinary(image_file)
            if image_url is None:
                return jsonify({'error': 'Image upload failed'}), 500

    post = Post.create_post(author_username, description, tags, image_url)
    return jsonify({"post_id": str(post.inserted_id)}), 201

def update_post(post_id):
    data = request.get_json()
    description = data.get('description')
    tags = data.get('tags')
    image_link = data.get('image_link')
    Post.update_post(post_id, description, tags, image_link)
    return jsonify({"message": "Post updated"}), 200

def delete_post(post_id):
    Post.delete_post(post_id)
    return jsonify({"message": "Post deleted"}), 200

def vote_post(post_id, vote_type):
    Post.vote_post(post_id, vote_type)
    return jsonify({"message": f"Post {vote_type}d"}), 200

def add_comment(post_id):
    data = request.get_json()
    user_username = data['user_username']
    text = data['text']
    comment = Comment.add_comment(post_id, user_username, text)
    return jsonify({"comment_id": str(comment.inserted_id)}), 201

def delete_comment(comment_id):
    success = Comment.delete_comment(comment_id)
    if success:
        return jsonify({"message": "Comment deleted"}), 200
    else:
        return jsonify({"error": "Comment not found"}), 404