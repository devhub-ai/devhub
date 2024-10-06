from app import create_app
import gunicorn

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
