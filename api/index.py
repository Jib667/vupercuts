from flask import Flask, request, jsonify
import sys
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("Initializing Vercel serverless function")

# Log the current directory and Python path
logger.info(f"Current directory: {os.getcwd()}")
logger.info(f"Python path: {sys.path}")

try:
    # Add the backend directory to the Python path so we can import from it
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    logger.info(f"Updated Python path: {sys.path}")
    
    # Import the Flask app from backend/app.py
    from backend.app import app
    logger.info("Successfully imported Flask app")
    
    # This is the entry point for Vercel serverless functions
    # No need to run app.run() as Vercel will handle that
    
    # Export the app for Vercel
    app = app
    
except Exception as e:
    logger.error(f"Error initializing serverless function: {str(e)}")
    
    # Create a fallback app if the import fails
    fallback_app = Flask(__name__)
    
    @fallback_app.route('/', defaults={'path': ''})
    @fallback_app.route('/<path:path>')
    def catch_all(path):
        return jsonify({
            "error": "API initialization failed",
            "message": str(e),
            "path": path
        }), 500
    
    app = fallback_app 