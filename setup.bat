@echo off

REM Check and setup backend virtual environment if not exists
IF NOT EXIST server\venv (
    echo Setting up backend virtual environment...
    python -m venv server\venv
)
call server\venv\Scripts\activate

REM Install backend dependencies
pip install -r server\requirements.txt
if %errorlevel% neq 0 exit /b %errorlevel%

REM Start backend
start cmd /k "cd server && flask run"

REM Check and setup frontend node modules if not exists
IF NOT EXIST client\node_modules (
    echo Setting up frontend node modules...
    pushd client
    npm install --force
    if %errorlevel% neq 0 popd & exit /b %errorlevel%
    popd
)

REM Start frontend
start cmd /k "cd client && npm run dev"