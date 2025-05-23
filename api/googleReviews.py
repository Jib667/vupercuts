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
            # Get environment variables
            google_api_key = os.environ.get('GOOGLE_API_KEY')
            place_id = os.environ.get('GOOGLE_PLACE_ID')
            
            if not google_api_key or not place_id:
                # Return dummy data if API keys aren't available
                response = self.get_dummy_data()
                response["message"] = "Using dummy data (API keys missing)"
                response["config_status"] = {
                    "api_key_exists": bool(google_api_key),
                    "place_id_exists": bool(place_id)
                }
            else:
                # Fetch from Google Places API
                url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews,rating,user_ratings_total,url&key={google_api_key}"
                api_response = requests.get(url)
                data = api_response.json()
                
                if data.get('status') != 'OK':
                    # Handle API error
                    response = self.get_dummy_data()
                    response["message"] = f"Google Places API error: {data.get('status')}"
                    response["error_details"] = data.get('error_message', 'No error message provided')
                else:
                    # Format the response
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
                    
                    response = {
                        "status": "success",
                        "message": "Successfully fetched Google reviews",
                        "reviews": formatted_reviews,
                        "averageRating": result.get('rating', 0),
                        "totalReviews": result.get('user_ratings_total', 0),
                        "placeUrl": place_url
                    }
                    
        except Exception as e:
            # Handle any exceptions
            response = self.get_dummy_data()
            response["status"] = "error"
            response["message"] = f"Error: {str(e)}"
            response["error_type"] = type(e).__name__
        
        # Send response
        self.wfile.write(json.dumps(response).encode())
    
    def get_dummy_data(self):
        """Return dummy data for fallback"""
        return {
            "status": "success",
            "message": "API is working (fallback data)",
            "reviews": [
                {
                    "id": "123",
                    "name": "Test User",
                    "text": "This is fallback data when the API cannot fetch real reviews.",
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