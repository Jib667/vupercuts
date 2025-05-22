from http.server import BaseHTTPRequestHandler
import json
import time
import base64
import re
import os
from datetime import datetime

# Simple in-memory storage for reviews
REVIEWS = []

# File path for temporary persistence (will reset when Vercel redeploys)
REVIEWS_FILE = "/tmp/reviews.json"

# Admin credentials
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

def load_reviews():
    """Load reviews from storage"""
    global REVIEWS
    
    # If we already have reviews in memory, use them
    if REVIEWS:
        return REVIEWS
    
    # Otherwise try to load from file
    try:
        if os.path.exists(REVIEWS_FILE):
            with open(REVIEWS_FILE, "r") as f:
                REVIEWS = json.load(f)
                return REVIEWS
    except Exception as e:
        print(f"Error loading reviews: {str(e)}")
    
    # If nothing worked, return empty list
    return REVIEWS

def save_reviews(reviews):
    """Save reviews to storage"""
    global REVIEWS
    REVIEWS = reviews
    
    try:
        with open(REVIEWS_FILE, "w") as f:
            json.dump(reviews, f)
        return True
    except Exception as e:
        print(f"Error saving reviews: {str(e)}")
        return False

def calculate_average_rating(reviews):
    """Calculate average rating from reviews"""
    if not reviews:
        return 0
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests - list all reviews"""
        # Load all reviews
        reviews = load_reviews()
        
        # Calculate average rating
        avg_rating = calculate_average_rating(reviews)
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.end_headers()
        
        response_data = {
            "reviews": reviews,
            "averageRating": avg_rating,
            "totalReviews": len(reviews)
        }
        
        self.wfile.write(json.dumps(response_data).encode())
    
    def do_POST(self):
        """Handle POST requests - add a new review"""
        # Read request body
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Load existing reviews
        reviews = load_reviews()
        
        # Create a new review
        review = {
            'id': str(time.time()),
            'name': data.get('name', ''),
            'text': data.get('text', ''),
            'rating': int(data.get('rating', 5)),
            'createdAt': datetime.now().isoformat()
        }
        
        # Add to reviews and save
        reviews.append(review)
        save_reviews(reviews)
        
        # Calculate new average rating
        avg_rating = calculate_average_rating(reviews)
        
        # Send success response
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
    
    def do_DELETE(self):
        """Handle DELETE requests - delete a review by ID"""
        # Verify admin authentication
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            self.send_response(401)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_data = {"error": "Unauthorized"}
            self.wfile.write(json.dumps(error_data).encode())
            return
        
        # Extract and check credentials
        encoded_credentials = auth_header[6:]  # Remove 'Basic '
        decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
        username, password = decoded_credentials.split(':')
        
        if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
            self.send_response(401)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_data = {"error": "Invalid credentials"}
            self.wfile.write(json.dumps(error_data).encode())
            return
        
        # Extract review ID from path
        match = re.search(r'/api/reviews/([^/]+)', self.path)
        if not match:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_data = {"error": "Invalid request path"}
            self.wfile.write(json.dumps(error_data).encode())
            return
        
        review_id = match.group(1)
        
        # Clean up review ID (remove any query parameters)
        if '?' in review_id:
            review_id = review_id.split('?')[0]
        
        # Load reviews
        reviews = load_reviews()
        
        # Find and remove the review
        initial_length = len(reviews)
        reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        # Check if review was found and deleted
        if len(reviews) < initial_length:
            # Save updated reviews
            save_reviews(reviews)
            
            # Calculate new average
            avg_rating = calculate_average_rating(reviews)
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {
                "message": "Review deleted successfully",
                "averageRating": avg_rating,
                "totalReviews": len(reviews)
            }
            
            self.wfile.write(json.dumps(response_data).encode())
        else:
            # Review not found
            self.send_response(404)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            error_data = {"error": "Review not found"}
            self.wfile.write(json.dumps(error_data).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests - for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers() 