from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse
import ssl

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Always return HTTP 200 to prevent Vercel from showing error pages
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Check if we should bypass API calls and return mock data
        bypass_auth = os.environ.get('BYPASS_AUTH', '').lower() == 'true'
        if bypass_auth:
            response = self.get_test_data()
            response["message"] = "Using mock data (BYPASS_AUTH=true)"
            self.wfile.write(json.dumps(response).encode())
            return
        
        # Get API credentials
        api_key = os.environ.get('GOOGLE_API_KEY', '')
        place_id = os.environ.get('GOOGLE_PLACE_ID', '')
        
        # Debug info for response
        debug_info = {
            "api_key_exists": bool(api_key),
            "place_id_exists": bool(place_id)
        }
        
        # If credentials are missing, return debug data only
        if not api_key or not place_id:
            response = self.get_test_data()
            response["message"] = "API credentials missing"
            response["debug"] = debug_info
            self.wfile.write(json.dumps(response).encode())
            return
        
        try:
            # Create the URL for Google Places API
            url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=name,rating,reviews,user_ratings_total,url&key={api_key}"
            
            # Make the HTTP request using urllib
            context = ssl.create_default_context()
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            
            # Open the URL with a timeout
            with urllib.request.urlopen(req, context=context, timeout=5) as response_obj:
                data = json.loads(response_obj.read().decode())
                
            # Check if the API returned a valid response
            if data.get('status') != 'OK' or 'result' not in data:
                response = self.get_test_data()
                response["message"] = f"Google Places API error: {data.get('status')}"
                response["error_details"] = data.get('error_message', 'No error message provided')
                response["debug"] = debug_info
                self.wfile.write(json.dumps(response).encode())
                return
                
            # Process the API response
            result = data.get('result', {})
            reviews = result.get('reviews', [])
            place_url = result.get('url', '')
            if not place_url and place_id:
                place_url = f"https://search.google.com/local/reviews?placeid={place_id}"
            
            # Format the reviews data
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
            
            # Prepare final response
            response = {
                "status": "success",
                "message": "Successfully retrieved Google reviews",
                "reviews": formatted_reviews,
                "averageRating": result.get('rating', 0),
                "totalReviews": result.get('user_ratings_total', 0),
                "placeUrl": place_url,
                "debug": debug_info
            }
            
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            # Return error info without failing
            response = self.get_test_data()
            response["status"] = "error"
            response["message"] = f"Error fetching reviews: {str(e)}"
            response["error_type"] = type(e).__name__
            response["debug"] = debug_info
            self.wfile.write(json.dumps(response).encode())
    
    def get_test_data(self):
        """Return fallback test data"""
        return {
            "status": "success",
            "message": "Using fallback data",
            "reviews": [
                {
                    "id": "fallback-1",
                    "name": "Test User",
                    "text": "This is fallback test data. Google Places API request failed. Please check your API key and place ID in Vercel environment variables.",
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