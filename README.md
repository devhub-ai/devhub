# DevHub: Intelligent Matchmaking Platform for Developers 💻🤝
  <a href="https://discord.gg/he8QHEC8WP" target="_blank"><img src="https://img.shields.io/discord/1259889923129999411?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=ffffff" /></a>

DevHub is an innovative platform designed to connect developers who share similar interests and complementary skills. By leveraging advanced technologies, it facilitates intelligent matchmaking and personalized recommendations, enabling devs to form effective teams and engage in meaningful collaborations. The platform provides a structured and user-friendly environment for networking, learning, and growth, ultimately enhancing the academic and professional experiences of developers.

## Features 🌟

### Advanced Matchmaking System
DevHub integrates several cutting-edge technologies to create a robust matchmaking experience:

- **Large Language Model (LLM)**: 🧠 Processes natural language inputs to understand user preferences and extract relevant information, enhancing matchmaking accuracy through:
  - Natural Language Processing (NLP) 💬
  - Entity Recognition 🔍
  - Contextual Understanding 📊

- **LangChain**: 🔗 Optimizes workflows by streamlining data integration between components, improving response quality and facilitating connections with external services.

- **Neo4j Database**: 📈 Stores user profiles and project data in a graph format, allowing for complex relationships to be represented and queried effectively. Key features include:
  - Knowledge Graph Creation 🌐
  - Advanced Querying with Cypher 🗄️
  - Integration with External Data Sources 🌍

### User Interaction Features
- **Chat Functionality**: 💬 Users can interact with the system to find matches or ask questions about potential collaborations using GraphRAG technology.
- **Visualization Tools**: 📊 Users can visualize their connections within the knowledge graph, aiding in understanding potential collaborations.

## Tech Stacks 🛠️

- **Backend**: Flask 🐍 + LangChain 🔗  
- **Frontend**: Vite + React (TypeScript) ⚛️  
- **Database**: Neo4j 🌐  + Sqlite 

---

## Features ✨

1. **Create Your Profile**: Set up a personalized profile to showcase your skills and interests.  
2. **Find Peers**: Connect with fellow students who share similar interests and complementary skills.  
3. **Chat with Peers**: Engage in real-time conversations to discuss projects and collaborations.  
4. **Explore Projects**: View projects posted by other users to gain inspiration and insights.  
5. **Get Development Roadmaps**: Access curated roadmaps tailored for your development journey.  

## Installation 

Enter into the root directory.
```bash
cd devhub
```
Open two terminal for server and client and enter into the directories.
```bash
## 1st terminal for server
cd server

## create .env file with following details (you can create your neo4j account or use our mirror database credentials)

GOOGLE_API_KEY= 
SECRET_KEY=
NEO4J_URI= 
NEO4J_USER=
NEO4J_USERNAME=
NEO4J_PASSWORD=

## Join our discord server to get Mirror Database Credentials.
Discord Server Link : https://discord.gg/he8QHEC8WP

## Create Virtual Environment
python -m venv venv

## Activate the virtual Env.
./venv/Scripts/activate

## Intall dependencies
pip install -r requirements.txt

## Run the Server
flask run or python server.py
```
```bash
## 2nd terminal for client
cd client

## Intall dependencies
npm install

## Run the client
npm run dev
```

## Conclusion 🎉
By integrating LLMs for natural language understanding, LangChain for workflow enhancement, and Neo4j for advanced data storage and querying, DevHub offers a comprehensive solution for devs seeking meaningful collaborations. This combination not only enhances user experience but also ensures that connections are based on relevant skills and interests, leading to more effective teamwork.

## Contribution

See the [CONTRIBUTION GUIDE](https://github.com/devhub-ai/devhub/blob/main/.github/CONTRIBUTING.md) to get started.
