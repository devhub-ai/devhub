from api.handlers.auth.userauth import signup, login, check_auth, home, logout, index, check_username
from api.handlers.user.profile import get_profile, update_profile, add_project, update_project, delete_project
from api.handlers.analyze.githubdata import github_data, top_languages, streak_stats, pinned_repos, streak_chart
from api.handlers.analyze.leetcodedata import leetcode_data, leetcode_card
from api.handlers.query.querymodel import chat,retrieve_chat
from api.handlers.user.friends import friends_bp

def register_routes(app):
    # Authentication routes
    app.add_url_rule('/signup', 'signup', signup, methods=['POST'])
    app.add_url_rule('/check_username', 'check_username', check_username, methods=['GET'])
    app.add_url_rule('/login', 'login', login, methods=['POST'])
    app.add_url_rule('/check_auth', 'check_auth', check_auth, methods=['GET'])
    app.add_url_rule('/logout', 'logout', logout)
    
    # Home route
    app.add_url_rule('/home', 'home', home)
    
    # Profile routes
    app.add_url_rule('/profile/<username>', 'get_profile', get_profile, methods=['GET'])
    app.add_url_rule('/profile/<username>', 'update_profile', update_profile, methods=['PUT'])
    
    # Analyze routes - Github
    app.add_url_rule('/analyze/github_data', 'github_data', github_data, methods=['POST'])
    app.add_url_rule('/analyze/top_languages', 'top_languages', top_languages, methods=['POST'])
    app.add_url_rule('/analyze/streak_stats', 'streak_stats', streak_stats, methods=['POST'])
    app.add_url_rule('/analyze/pinned_repos', 'pinned_repos', pinned_repos, methods=['POST'])
    app.add_url_rule('/analyze/streak_chart', 'streak_chart', streak_chart, methods=['POST'])
    
    # Analyze routes - Leetcode
    app.add_url_rule('/analyze/leetcode_data', 'leetcode_data', leetcode_data, methods=['POST'])
    app.add_url_rule('/analyze/leetcode_card', 'leetcode_card', leetcode_card, methods=['POST'])
    
    # Project routes
    app.add_url_rule('/profile/<username>/projects', 'add_project', add_project, methods=['POST'])
    app.add_url_rule('/profile/<username>/projects/<int:project_id>', 'update_project', update_project, methods=['PUT'])
    app.add_url_rule('/profile/<username>/projects/<string:project_title>', 'delete_project', delete_project, methods=['DELETE'])
    
    # Chat with model routes
    app.add_url_rule('/chat','chat',chat, methods=['POST'])
    app.add_url_rule('/chat/<chat_id>','retrieve_chat',retrieve_chat, methods=['GET'])
    
    # Landing page route
    app.add_url_rule('/', 'index', index)
    
    # Friends routes
    app.register_blueprint(friends_bp)
