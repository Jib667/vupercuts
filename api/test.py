from http.server import BaseHTTPRequestHandler
import json
import time
from datetime import datetime
import os
from api.reviews import reviews

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Log file location
        log_path = "/tmp/debug.log"
        
        # Add a test review if none exist
        if not reviews:
            reviews.append({
                'id': "test-review-id",
                'name': "Test User",
                'text': "This is a test review added via test API",
                'rating': 5,
                'createdAt': datetime.now().isoformat()
            })
        
        # Read debug log if it exists
        debug_log = ""
        if os.path.exists(log_path):
            try:
                with open(log_path, "r") as f:
                    debug_log = f.read()
            except:
                debug_log = "Error reading debug log"
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = {
            "message": "Test endpoint",
            "reviews": reviews,
            "reviewCount": len(reviews),
            "serverTime": datetime.now().isoformat(),
            "debugLog": debug_log[:5000]  # Limit log size
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 