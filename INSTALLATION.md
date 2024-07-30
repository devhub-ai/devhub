# INSTALLATION GUIDE

### Folder Structure

```
devhub/
├── client/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package-lock.json
├── docs/
├── server/
│   ├── api/
│   ├── app.py
│   ├── config.py
│   ├── extension.py
│   ├── models.py
│   ├── requirements.txt
│   └── server.py
```

Enter into the root directory.
```bash
cd devhub
```
Open two terminal for server and client and enter into the directories.
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