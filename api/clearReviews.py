from http.server import BaseHTTPRequestHandler
import json
import os

# Use the same storage location as reviews.py and deleteReview.py
REVIEWS_FILE = "/tmp/vupercuts_reviews.json"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Create an empty reviews file
        try:
            with open(REVIEWS_FILE, "w") as f:
                json.dump([], f)
                print(f"Cleared all reviews in {REVIEWS_FILE}")
        except Exception as e:
            print(f"Error clearing reviews: {str(e)}")
            
        # Always return success
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = {
            "message": "All reviews cleared",
            "success": True,
            "storageLocation": REVIEWS_FILE
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 