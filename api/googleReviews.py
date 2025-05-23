from http.server import BaseHTTPRequestHandler
import json
import os
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Enable CORS
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Get Google API key and place ID directly from environment
            google_api_key = os.environ.get('GOOGLE_API_KEY', '')
            place_id = os.environ.get('GOOGLE_PLACE_ID', '')
            
            # Debug info
            debug_info = {
                "api_key_exists": bool(google_api_key),
                "place_id_exists": bool(place_id),
                "api_key_length": len(google_api_key) if google_api_key else 0,
                "api_key_first_chars": google_api_key[:4] + "..." if google_api_key and len(google_api_key) > 4 else ""
            }
            
            # Check if API key and place ID are available
            if not google_api_key or not place_id:
                error_response = {
                    "error": "Google API configuration missing",
                    "debug": debug_info
                }
                self.wfile.write(json.dumps(error_response).encode())
                return
            
            # Construct the URL for the Places API
            url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews,rating,user_ratings_total,url&key={google_api_key}"
            
            # Make request to Google Places API
            response = requests.get(url)
            data = response.json()
            
            if data.get('status') != 'OK':
                error_response = {
                    "error": f"Google Places API error: {data.get('status')}",
                    "message": data.get('error_message', 'No error message provided'),
                    "debug": debug_info
                }
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
            # Send error response
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_message = str(e)
            error_response = {
                "error": "Failed to fetch Google reviews",
                "message": error_message,
                "type": type(e).__name__
            }
            self.wfile.write(json.dumps(error_response).encode()) 