from api.handlers.userauth import signup, login, check_auth, home, logout, index

def register_routes(app):
    app.add_url_rule('/signup', 'signup', signup, methods=['POST'])
    app.add_url_rule('/login', 'login', login, methods=['POST'])
    app.add_url_rule('/check_auth', 'check_auth', check_auth, methods=['GET'])
    app.add_url_rule('/home', 'home', home)
    app.add_url_rule('/logout', 'logout', logout)
    app.add_url_rule('/', 'index', index)
