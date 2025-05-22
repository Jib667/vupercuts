from ..app import app
from flask import request, jsonify

# Direct API endpoint for Vercel
@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({"message": "API is working!"})

# This is the entry point for Vercel serverless function
def handler(request):
    return app 