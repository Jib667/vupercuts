from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Always return 200 to prevent 500 errors
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        try:
            # Get API credentials
            api_key = os.environ.get('GOOGLE_API_KEY', '')
            place_id = os.environ.get('GOOGLE_PLACE_ID', '')
            
            if not api_key or not place_id:
                # If no credentials, return test data
                response = self.get_test_data()
                response["message"] = "Missing API credentials"
                response["config_status"] = {
                    "api_key_exists": bool(api_key),
                    "place_id_exists": bool(place_id)
                }
            else:
                # Make request to Google Places API
                url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews,rating,user_ratings_total,url&key={api_key}"
                
                try:
                    api_response = requests.get(url, timeout=5)
                    data = api_response.json()
                    
                    if data.get('status') != 'OK':
                        # API returned error
                        response = self.get_test_data()
                        response["message"] = f"Google API error: {data.get('status')}"
                        response["api_error"] = data.get('error_message')
                        response["config_status"] = {
                            "api_key_exists": bool(api_key),
                            "place_id_exists": bool(place_id)
                        }
                    else:
                        # Process Google API response
                        result = data.get('result', {})
                        reviews = result.get('reviews', [])
                        place_url = result.get('url', '')
                        if not place_url:
                            place_url = f"https://search.google.com/local/reviews?placeid={place_id}"
                            
                        # Format the reviews
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
                            "message": "Successfully retrieved Google reviews",
                            "reviews": formatted_reviews,
                            "averageRating": result.get('rating', 0),
                            "totalReviews": result.get('user_ratings_total', 0),
                            "placeUrl": place_url,
                            "config_status": {
                                "api_key_exists": True,
                                "place_id_exists": True
                            }
                        }
                except Exception as api_error:
                    # API request failed
                    response = self.get_test_data()
                    response["message"] = f"Error fetching from Google API: {str(api_error)}"
                    response["config_status"] = {
                        "api_key_exists": bool(api_key),
                        "place_id_exists": bool(place_id)
                    }
        except Exception as e:
            # Handle any other errors
            response = self.get_test_data()
            response["status"] = "error"
            response["message"] = f"Server error: {str(e)}"
        
        # Send the response
        self.wfile.write(json.dumps(response).encode())
    
    def get_test_data(self):
        """Return fallback test data"""
        return {
            "status": "success",
            "message": "Fallback test data",
            "reviews": [
                {
                    "id": "fallback-1",
                    "name": "Test User",
                    "text": "This is fallback test data because the Google API request failed.",
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