from http.server import BaseHTTPRequestHandler
import json
import os
import base64
import re
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("deleteReview")

# Data storage path for Vercel
DATA_DIR = '/tmp'
REVIEWS_FILE = os.path.join(DATA_DIR, 'reviews.json')
ADMIN_CREDENTIALS_FILE = os.path.join(DATA_DIR, 'admin.json')

def get_admin_credentials():
    # Default credentials if file doesn't exist
    if not os.path.exists(ADMIN_CREDENTIALS_FILE):
        return {"username": "admin", "password": "vupercuts2024"}
    
    try:
        with open(ADMIN_CREDENTIALS_FILE, 'r') as f:
            return json.load(f)
    except:
        return {"username": "admin", "password": "vupercuts2024"}

def get_reviews():
    try:
        if not os.path.exists(REVIEWS_FILE):
            logger.info(f"Reviews file not found at {REVIEWS_FILE}")
            return []
        with open(REVIEWS_FILE, 'r') as f:
            data = json.load(f)
            logger.info(f"Loaded {len(data)} reviews from file")
            return data
    except Exception as e:
        logger.error(f"Error reading reviews: {str(e)}")
        return []

def save_reviews(reviews):
    # Ensure directory exists
    try:
        if not os.path.exists(DATA_DIR):
            os.makedirs(DATA_DIR)
        
        with open(REVIEWS_FILE, 'w') as f:
            json.dump(reviews, f)
        logger.info(f"Saved {len(reviews)} reviews to file")
    except Exception as e:
        logger.error(f"Error saving reviews: {str(e)}")

def calculate_average_rating(reviews):
    if not reviews:
        return 0
    
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_DELETE(self):
        logger.info(f"DELETE request received: {self.path}")
        logger.info(f"Headers: {self.headers}")
        
        # Check authorization
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            logger.error("Missing or invalid Authorization header")
            self.send_error_response(401, "Unauthorized")
            return
        
        try:
            # Extract and check credentials
            encoded_credentials = auth_header[6:]  # Remove 'Basic '
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':')
            
            logger.info(f"Received auth for username: {username}")
            admin_credentials = get_admin_credentials()
            
            if username != admin_credentials['username'] or password != admin_credentials['password']:
                logger.error(f"Invalid credentials. Expected username: {admin_credentials['username']}")
                self.send_error_response(401, "Invalid credentials")
                return
            
            # Extract review ID from path
            # Simpler path extraction - just get the last part of the URL
            path_parts = self.path.strip('/').split('/')
            if len(path_parts) < 3:
                logger.error(f"Invalid path format: {self.path}, parts: {path_parts}")
                self.send_error_response(400, "Invalid request path")
                return
            
            review_id = path_parts[-1]
            logger.info(f"Extracted review ID: {review_id} from path: {self.path}")
            
            # Get reviews and delete the requested one
            reviews = get_reviews()
            logger.info(f"Current reviews: {reviews}")
            initial_count = len(reviews)
            
            # Filter out the review to be deleted
            filtered_reviews = [review for review in reviews if str(review.get('id')) != str(review_id)]
            
            if len(filtered_reviews) == initial_count:
                logger.error(f"Review not found with ID: {review_id}")
                self.send_error_response(404, "Review not found")
                return
            
            # Save updated reviews
            logger.info(f"Deleting review. Count before: {initial_count}, after: {len(filtered_reviews)}")
            save_reviews(filtered_reviews)
            
            # Return updated average rating
            avg_rating = calculate_average_rating(filtered_reviews) if filtered_reviews else 0
            
            # Success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "message": "Review deleted successfully",
                "averageRating": avg_rating,
                "totalReviews": len(filtered_reviews)
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f"Error deleting review: {str(e)}")
            logger.error(traceback.format_exc())
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        error_data = {
            "error": message
        }
        
        self.wfile.write(json.dumps(error_data).encode()) 