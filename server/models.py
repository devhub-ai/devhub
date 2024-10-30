from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, Session
from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId
from config import Config

mongo_client = MongoClient(Config.MONGODB_URI)
mongo_db = mongo_client['devhub']
posts_collection = mongo_db['posts']
comments_collection = mongo_db['comments']

Base = declarative_base()

friend_association = Table('friend_association', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('friend_id', Integer, ForeignKey('users.id'))
)

project_tags = Table('project_tags', Base.metadata,
    Column('project_id', Integer, ForeignKey('projects.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_image = Column(String, nullable=True)
    github_username = Column(String, nullable=True)
    leetcode_username = Column(String, nullable=True)
    
    projects = relationship('Project', back_populates='user')
    
    friends = relationship(
        'User',
        secondary=friend_association,
        primaryjoin=id==friend_association.c.user_id,
        secondaryjoin=id==friend_association.c.friend_id,
        backref=backref('friend_of', lazy='dynamic'),
        lazy='dynamic'
    )

    def __init__(self, username, email, password, name=None, bio=None, github_username=None, leetcode_username=None, profile_image=None):
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.bio = bio
        self.profile_image = profile_image
        self.github_username = github_username
        self.leetcode_username = leetcode_username

    def add_friend(self, friend_user):
        if friend_user not in self.friends:
            self.friends.append(friend_user)
        if self not in friend_user.friends:
            friend_user.friends.append(self)

    def remove_friend(self, friend_user):
        if friend_user in self.friends:
            self.friends.remove(friend_user)
        if self in friend_user.friends:
            friend_user.friends.remove(self)

class Project(Base):
    __tablename__ = 'projects'

    project_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    repo_link = Column(String, nullable=True)
    image_link = Column(String, nullable=True)  # New field to store image links
    star = Column(Integer, default=0, nullable=False)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='projects')

    tags = relationship('Tag', secondary=project_tags, back_populates='projects')

    def __init__(self, title, description=None, repo_link=None, image_link=None, star=0):
        self.title = title
        self.description = description
        self.repo_link = repo_link
        self.image_link = image_link  # Set the image link
        self.star = star

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    
    projects = relationship('Project', secondary=project_tags, back_populates='tags')

    def __init__(self, name):
        self.name = name
        
class Chat:
    def __init__(self, sender_id, receiver_id, message):
        self.sender_id = sender_id
        self.receiver_id = receiver_id
        self.message = message
        self.timestamp = datetime.utcnow()

class Post:
    @staticmethod
    def create_post(author_username,author_profile_image, description, tags, image_link):
        post = {
            "author_username": author_username,
            "author_profileImage": author_profile_image,
            "description": description,
            "tags": tags,
            "image_link": image_link,
            "upvotes": 0,
            "downvotes": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        return posts_collection.insert_one(post)

    @staticmethod
    def update_post(post_id, description=None, tags=None, image_link=None):
        updates = {"updated_at": datetime.utcnow()}
        if description: updates["description"] = description
        if tags: updates["tags"] = tags
        if image_link: updates["image_link"] = image_link
        return posts_collection.update_one({"_id": ObjectId(post_id)}, {"$set": updates})

    @staticmethod
    def delete_post(post_id):
        posts_collection.delete_one({"_id": ObjectId(post_id)})
        comments_collection.delete_many({"post_id": ObjectId(post_id)})

    @staticmethod
    def vote_post(post_id, vote_type):
        if vote_type == "upvote":
            posts_collection.update_one({"_id": ObjectId(post_id)}, {"$inc": {"upvotes": 1}})
        elif vote_type == "downvote":
            posts_collection.update_one({"_id": ObjectId(post_id)}, {"$inc": {"downvotes": 1}})

class Comment:
    @staticmethod
    def add_comment(post_id, user_username, text):
        comment = {
            "post_id": ObjectId(post_id),
            "user_username": user_username,
            "text": text,
            "created_at": datetime.utcnow()
        }
        return comments_collection.insert_one(comment)
    
    @staticmethod
    def delete_comment(comment_id):
        result = comments_collection.delete_one({"_id": ObjectId(comment_id)})
        return result.deleted_count > 0
