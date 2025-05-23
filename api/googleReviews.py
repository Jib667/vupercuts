from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            # Get API credentials from environment
            api_key = os.environ.get('GOOGLE_API_KEY', '')
            place_id = os.environ.get('GOOGLE_PLACE_ID', '')
            
            # If API keys are missing, return test data
            if not api_key or not place_id:
                response = self.get_test_data()
                response["debug"] = {"api_key_exists": bool(api_key), "place_id_exists": bool(place_id)}
                self.wfile.write(json.dumps(response).encode())
                return
                
            # Call Google Places API
            url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews,rating,user_ratings_total,url&key={api_key}"
            api_response = requests.get(url, timeout=5)
            data = api_response.json()
            
            # Check if API returned expected data
            if data.get('status') != 'OK' or 'result' not in data:
                response = self.get_test_data()
                response["message"] = f"Google API error: {data.get('status', 'Unknown error')}"
                response["error_details"] = data.get('error_message', 'No details available')
                self.wfile.write(json.dumps(response).encode())
                return
                
            # Format the response
            result = data.get('result', {})
            reviews = result.get('reviews', [])
            place_url = result.get('url', '')
            if not place_url and place_id:
                place_url = f"https://search.google.com/local/reviews?placeid={place_id}"
                
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
                
            response = {
                "status": "success",
                "message": "Google reviews loaded successfully",
                "reviews": formatted_reviews,
                "averageRating": result.get('rating', 0),
                "totalReviews": result.get('user_ratings_total', 0),
                "placeUrl": place_url
            }
                
            self.wfile.write(json.dumps(response).encode())
        
        except Exception as e:
            # Return test data with error info if anything fails
            response = self.get_test_data()
            response["status"] = "error"
            response["message"] = f"Error fetching reviews: {str(e)}"
            response["error_type"] = type(e).__name__
            self.wfile.write(json.dumps(response).encode())
            
    def get_test_data(self):
        """Return test data as fallback"""
        return {
            "status": "success",
            "message": "Using fallback test data",
            "reviews": [
                {
                    "id": "123",
                    "name": "Test User",
                    "text": "This is test data. Please check your Vercel environment variables for GOOGLE_API_KEY and GOOGLE_PLACE_ID.",
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