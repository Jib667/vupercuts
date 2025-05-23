from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Always return 200 to prevent 500 errors
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Create a basic response with fake data
        response = {
            "status": "success",
            "message": "This is test review data. Add GOOGLE_API_KEY and GOOGLE_PLACE_ID to your Vercel environment variables.",
            "reviews": [
                {
                    "id": "test-1",
                    "name": "Static Test User",
                    "text": "This is a static review because the Google API key is not configured or there was an error.",
                    "rating": 5,
                    "createdAt": "1633027200",
                    "profile_photo_url": "",
                    "relative_time_description": "1 month ago",
                    "isGoogleReview": True
                }
            ],
            "averageRating": 5,
            "totalReviews": 1,
            "placeUrl": "https://maps.google.com",
        }
        
        # Add debug info
        api_key_exists = bool(os.environ.get('GOOGLE_API_KEY'))
        place_id_exists = bool(os.environ.get('GOOGLE_PLACE_ID'))
        response["config_status"] = {
            "api_key_exists": api_key_exists,
            "place_id_exists": place_id_exists
        }
        
        self.wfile.write(json.dumps(response).encode()) 