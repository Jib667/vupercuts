from http.server import BaseHTTPRequestHandler
import json
import time
from datetime import datetime
import os
from api.reviews import load_reviews, save_reviews, REVIEWS_FILE

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Log file location
        log_path = "/tmp/debug.log"
        
        # Load current reviews
        reviews = load_reviews()
        
        # Get the review ID from the path if it exists
        review_id = None
        if "/test/" in self.path:
            review_id = self.path.split("/test/")[1]
            
        # Add a specific test review if requested
        if review_id:
            test_review = {
                'id': review_id,
                'name': "Test User",
                'text': f"This is a test review with ID {review_id}",
                'rating': 5,
                'createdAt': datetime.now().isoformat()
            }
            reviews.append(test_review)
            save_reviews(reviews)
        # Or add a generic test review if none exist
        elif not reviews:
            test_review = {
                'id': "1747941550.0821097",  # Using the specific ID from your error message
                'name': "Test User",
                'text': "This is a test review for deletion testing",
                'rating': 5,
                'createdAt': datetime.now().isoformat()
            }
            reviews.append(test_review)
            save_reviews(reviews)
        
        # Read debug log if it exists
        debug_log = ""
        if os.path.exists(log_path):
            try:
                with open(log_path, "r") as f:
                    debug_log = f.read()[-5000:]  # Get last 5000 chars
            except Exception as e:
                debug_log = f"Error reading debug log: {str(e)}"
        
        # Check reviews file
        reviews_file_exists = os.path.exists(REVIEWS_FILE)
        reviews_file_content = None
        if reviews_file_exists:
            try:
                with open(REVIEWS_FILE, "r") as f:
                    reviews_file_content = f.read()
            except Exception as e:
                reviews_file_content = f"Error reading reviews file: {str(e)}"
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = {
            "message": "Test endpoint",
            "reviews": reviews,
            "reviewCount": len(reviews),
            "serverTime": datetime.now().isoformat(),
            "debugLog": debug_log,
            "reviewsFileExists": reviews_file_exists,
            "reviewsFileContent": reviews_file_content,
            "reviewsFilePath": REVIEWS_FILE,
            "tmpDirContents": os.listdir("/tmp") if os.path.exists("/tmp") else []
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 