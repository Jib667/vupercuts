from http.server import BaseHTTPRequestHandler
import json
import logging
import traceback
from api.db import get_reviews, add_review, calculate_average_rating

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("reviews")

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        logger.info(f"GET request received: {self.path}")
        
        try:
            # Get reviews from our database module
            reviews = get_reviews()
            logger.info(f"Fetched {len(reviews)} reviews")
            
            avg_rating = calculate_average_rating(reviews)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "reviews": reviews,
                "averageRating": avg_rating,
                "totalReviews": len(reviews)
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f"Error in GET request: {str(e)}")
            logger.error(traceback.format_exc())
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_POST(self):
        logger.info(f"POST request received: {self.path}")
        
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            logger.info(f"Received review data: {data}")
            
            # Validate required fields
            if 'name' not in data or 'text' not in data or 'rating' not in data:
                logger.error("Missing required fields in review data")
                self.send_error_response(400, "Missing required fields")
                return
            
            # Add the review using our database module
            review, avg_rating, total_reviews = add_review(data)
            
            if not review:
                logger.error("Failed to add review")
                self.send_error_response(500, "Failed to save review")
                return
            
            logger.info(f"Successfully added review with ID: {review['id']}")
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "review": review,
                "averageRating": avg_rating,
                "totalReviews": total_reviews
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f"Error in POST request: {str(e)}")
            logger.error(traceback.format_exc())
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = {
            "error": message
        }
        
        self.wfile.write(json.dumps(error_data).encode()) 