from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        response = {
            "status": "success",
            "message": "API is working",
            "reviews": [
                {
                    "id": "123",
                    "name": "Test User",
                    "text": "Test review content",
                    "rating": 5,
                    "createdAt": "1633027200",
                    "profile_photo_url": "",
                    "relative_time_description": "1 month ago",
                    "isGoogleReview": True
                }
            ],
            "averageRating": 5,
            "totalReviews": 1,
            "placeUrl": "https://maps.google.com"
        }
        
        self.wfile.write(json.dumps(response).encode()) 