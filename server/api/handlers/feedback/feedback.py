import requests
from flask import request, jsonify
from models import Feedback
from pymongo import errors  

def save_feedback_message():
    try:
        # Parse JSON from the request
        data = request.json
        if not data:
            return jsonify({"success": False, "message": "No data received"}), 400

        # Validate required fields
        required_fields = ["username", "rating", "message"]
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing fields: {', '.join(missing_fields)}"
            }), 400

        # Construct the feedback data object
        feedback_data = {
            "username": data["username"].strip(),
            "rating": data["rating"].strip(),
            "message": data["message"].strip()
        }

        # Save the message using the feedback model
        saved_feedback = Feedback.save_feedback(feedback_data)

        # Return a success response
        return jsonify({
            "success": True,
            "message": "feedback message saved successfully",
            "data": saved_feedback
        }), 201

    except errors.PyMongoError as e:
        # Handle database-related errors
        return jsonify({"success": False, "message": "Database error", "error": str(e)}), 500
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({"success": False, "message": "An unexpected error occurred", "error": str(e)}), 500