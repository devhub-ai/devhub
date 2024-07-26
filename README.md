# Devhub

A Platform to connect with like minded people and create peer group using AI chat with advance algorithm and LLM. 

## TechStacks

Backend - Flask<br>
Frontend - Vite + React (typescript)<br>
Database - Sqlite

## Contribution and Installation guide

1. Fork the repository (https://github.com/devhub-ai/devhub) into your account.
2. Clone the repository from your account. 
    ```bash
    git clone https://github.com/<your_github_username>/devhub
    ```
3. Enter into the root directory.
    ```bash
    cd devhub
    ```
4. Open two terminal for server and client and enter into the directories.
    ```bash
    ## 1st terminal for server
    cd server
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
5. After solving the problem the issue or Updating the CodeBase commit the code and push it to a new branch with your desired branch name(eg. UI_Fix, Refactor etc).
    ```bash
    ## Add the Changes
    git add.
    ## Commit 
    git commit -m "<your_commit_message>"
    ## Change Branch
    git checkout -b <your_desired_branch_name>
    ## Push the Commit code
    git push origin <your_desired_branch_name>
    ```
6. Create a pull request from your forked repo's newly created branch to Devhub's main branch.
    ![alt text](./docs/images/image.png)
7. We will Review the changes and merge it.

