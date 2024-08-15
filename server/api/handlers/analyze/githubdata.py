import requests
from flask import request, jsonify, Response
from bs4 import BeautifulSoup

def github_data():
    data = request.get_json()
    username = data.get('github-id')
    
    if not username:
        return jsonify({"error": "GitHub username is required"}), 400
    
    url = f"https://api.github.com/users/{username}"
    response = requests.get(url)
    
    if response.status_code != 200:
        return jsonify({"error": "Unable to fetch user information", "status_code": response.status_code}), response.status_code
    
    user_data = response.json()
    
    return jsonify(user_data)



def top_languages():
    """Extract the GitHub username from the request data"""
    data = request.get_json()
    username = data.get('github-id')
    
    if not username:
        return jsonify({"error": "GitHub username is required"}), 400
    
    url = f"https://github-readme-stats.vercel.app/api/top-langs?username={username}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&hide_border=false"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            languages = []
            for text in soup.find_all('text', {'data-testid': 'lang-name'}):
                lang_text = text.get_text(strip=True)
                if lang_text:
                    parts = lang_text.rsplit(' ', 1)
                    if len(parts) == 2:
                        language = parts[0]
                        percentage = parts[1]
                        languages.append({'language': language, 'percentage': percentage})
            
            return jsonify(languages)
        else:
            return jsonify({"error": "Failed to fetch data from GitHub Readme Stats API", "status_code": response.status_code}), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

def streak_stats():
    data = request.get_json()
    username = data.get('github-id')
    
    if not username:
        return Response("GitHub username is required", status=400, mimetype='text/plain')
    
    url = f"https://streak-stats.demolab.com/?user={username}&locale=en&mode=daily&hide_border=false&border_radius=5"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            return Response(response.content, content_type='text/html')
        else:
            return Response("Failed to fetch data from Streak Stats API", status=response.status_code, mimetype='text/plain')
    except requests.RequestException as e:
        return Response(str(e), status=500, mimetype='text/plain')

def pinned_repos():
    data = request.get_json()
    username = data.get('github-id')
    
    if not username:
        return jsonify({"error": "GitHub username is required"}), 400
    
    url = f"https://gh-pinned-repos-tsj7ta5xfhep.deno.dev/?username={username}"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            return Response(response.content, content_type='application/json')
        else:
            return jsonify({"error": "Failed to fetch data from Pinned Repos API", "status_code": response.status_code}), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

def streak_chart():
    data = request.get_json()
    username = data.get('github-id')
    
    if not username:
        return jsonify({"error": "GitHub username is required"}), 400
    
    url = f"https://ghchart.rshah.org/{username}"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            return Response(response.content)
        else:
            return jsonify({"error": "Failed to fetch contribution chart", "status_code": response.status_code}), response.status_code
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
