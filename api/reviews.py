from http.server import BaseHTTPRequestHandler
import json
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("reviews")

# Data storage path for Vercel
DATA_DIR = '/tmp'
REVIEWS_FILE = os.path.join(DATA_DIR, 'reviews.json')

def get_reviews():
    try:
        if not os.path.exists(REVIEWS_FILE):
            return []
        with open(REVIEWS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading reviews file: {str(e)}")
        return []

def save_reviews(reviews):
    # Ensure directory exists
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    
    with open(REVIEWS_FILE, 'w') as f:
        json.dump(reviews, f)

def calculate_average_rating(reviews):
    if not reviews:
        return 0
    
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        logger.info(f"GET request received: {self.path}")
        
        try:
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
            
            # Create review with unique ID
            review = {
                'id': str(datetime.now().timestamp()),
                'name': data['name'],
                'text': data['text'],
                'rating': data['rating'],
                'createdAt': datetime.now().isoformat()
            }
            
            # Save to "database"
            reviews = get_reviews()
            reviews.append(review)
            save_reviews(reviews)
            
            logger.info(f"Saved new review with ID: {review['id']}")
            
            # Return updated average rating along with the new review
            avg_rating = calculate_average_rating(reviews)
            
            self.send_response(201)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "review": review,
                "averageRating": avg_rating,
                "totalReviews": len(reviews)
            }
            
            self.wfile.write(json.dumps(response_data).encode())
            
        except Exception as e:
            logger.error(f"Error in POST request: {str(e)}")
            self.send_error_response(500, f"Server error: {str(e)}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
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