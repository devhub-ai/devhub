from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref, Session

Base = declarative_base()

# Association table for the many-to-many relationship between users (friends)
friend_association = Table('friend_association', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('friend_id', Integer, ForeignKey('users.id'))
)

# Association table for the many-to-many relationship between projects and tags
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
    github_username = Column(String, nullable=True)
    leetcode_username = Column(String, nullable=True)
    
    # Establish relationship with Project
    projects = relationship('Project', back_populates='user')
    
    # Establish many-to-many relationship with friends
    friends = relationship(
        'User',
        secondary=friend_association,
        primaryjoin=id==friend_association.c.user_id,
        secondaryjoin=id==friend_association.c.friend_id,
        backref=backref('friend_of', lazy='dynamic'),
        lazy='dynamic'
    )

    def __init__(self, username, email, password, name=None, bio=None, github_username=None, leetcode_username=None):
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.bio = bio
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
    
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    repo_link = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User', back_populates='projects')

    # Many-to-many relationship with tags
    tags = relationship('Tag', secondary=project_tags, back_populates='projects')

    def __init__(self, title, description=None, repo_link=None):
        self.title = title
        self.description = description
        self.repo_link = repo_link

class Tag(Base):
    __tablename__ = 'tags'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    
    # Many-to-many relationship with projects
    projects = relationship('Project', secondary=project_tags, back_populates='tags')

    def __init__(self, name):
        self.name = name
