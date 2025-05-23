from http.server import BaseHTTPRequestHandler
import json
import os
import requests
from dotenv import load_dotenv
import urllib.parse

# Load environment variables
load_dotenv()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Enable CORS
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Get Google API key and place ID
        google_api_key = os.environ.get('GOOGLE_API_KEY', '')
        place_id = os.environ.get('GOOGLE_PLACE_ID', '')
        
        # Check if API key and place ID are available
        if not google_api_key or not place_id:
            error_response = {"error": "Google API configuration missing"}
            self.wfile.write(json.dumps(error_response).encode())
            return
        
        try:
            # Construct the URL for the Places API
            url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews,rating,user_ratings_total,url&key={google_api_key}"
            
            # Make request to Google Places API
            response = requests.get(url)
            data = response.json()
            
            if data.get('status') != 'OK':
                error_response = {"error": f"Google Places API error: {data.get('status')}"}
                self.wfile.write(json.dumps(error_response).encode())
                return
            
            # Extract and format the data
            result = data.get('result', {})
            reviews = result.get('reviews', [])
            place_url = result.get('url', f"https://search.google.com/local/reviews?placeid={place_id}")
            
            # Format reviews
            formatted_reviews = []
            for review in reviews:
                formatted_review = {
                    'id': review.get('time', ''),
                    'name': review.get('author_name', ''),
                    'text': review.get('text', ''),
                    'rating': review.get('rating', 0),
                    'createdAt': review.get('time', ''),
                    'profile_photo_url': review.get('profile_photo_url', ''),
                    'relative_time_description': review.get('relative_time_description', ''),
                    'isGoogleReview': True
                }
                formatted_reviews.append(formatted_review)
            
            # Prepare and send response
            response_data = {
                "reviews": formatted_reviews,
                "averageRating": result.get('rating', 0),
                "totalReviews": result.get('user_ratings_total', 0),
                "placeUrl": place_url
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            error_response = {"error": f"Failed to fetch Google reviews: {str(e)}"}
            self.wfile.write(json.dumps(error_response).encode()) 