from sqlalchemy import Column, Integer, String, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

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
    
    # Establish relationship with Project
    projects = relationship('Project', back_populates='user')

    def __init__(self, username, email, password, name=None, bio=None, github_username=None):
        self.username = username
        self.email = email
        self.password = password
        self.name = name
        self.bio = bio
        self.github_username = github_username

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
