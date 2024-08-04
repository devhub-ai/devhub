import requests
from flask import Flask, request, jsonify

query = """
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
"""

def format_data(data):
    return {
        "totalSolved": data['matchedUser']['submitStats']['acSubmissionNum'][0]['count'],
        "totalSubmissions": data['matchedUser']['submitStats']['totalSubmissionNum'],
        "totalQuestions": data['allQuestionsCount'][0]['count'],
        "easySolved": data['matchedUser']['submitStats']['acSubmissionNum'][1]['count'],
        "totalEasy": data['allQuestionsCount'][1]['count'],
        "mediumSolved": data['matchedUser']['submitStats']['acSubmissionNum'][2]['count'],
        "totalMedium": data['allQuestionsCount'][2]['count'],
        "hardSolved": data['matchedUser']['submitStats']['acSubmissionNum'][3]['count'],
        "totalHard": data['allQuestionsCount'][3]['count'],
        "ranking": data['matchedUser']['profile']['ranking'],
        "contributionPoint": data['matchedUser']['contributions']['points'],
        "reputation": data['matchedUser']['profile']['reputation'],
        "submissionCalendar": data['matchedUser']['submissionCalendar'],
        "recentSubmissions": data['recentSubmissionList'],
        "matchedUserStats": data['matchedUserStats']['submitStats']
    }

def leetcode_data():
    data = request.get_json()
    username = data.get('leetcode-id')
    
    url = 'https://leetcode.com/graphql'
    headers = {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
    }
    variables = {"username": username}
    payload = {
        "query": query,
        "variables": variables
    }

    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if 'errors' in data and data['data']['matchedUser'] is None:
            return jsonify({"error": "The user does not exist."}), 404
        if 'errors' in data:
            return jsonify(data), 400
        formatted_data = format_data(data['data'])
        return jsonify(formatted_data)
    else:
        return jsonify({"error": "Failed to fetch data from LeetCode API", "status_code": response.status_code}), response.status_code