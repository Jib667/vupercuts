from http.server import BaseHTTPRequestHandler
import json
import os
import re
import base64

# Store reviews in the same location as reviews.py
REVIEWS_FILE = "/tmp/vupercuts_reviews.json"

# Admin credentials
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

def load_reviews():
    """Load reviews from storage"""
    try:
        if os.path.exists(REVIEWS_FILE):
            with open(REVIEWS_FILE, "r") as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading reviews: {str(e)}")
    return []

def save_reviews(reviews):
    """Save reviews to storage"""
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
    def do_OPTIONS(self):
        """Handle OPTIONS requests - for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_DELETE(self):
        """Handle DELETE requests - delete a review by ID"""
        print(f"DELETE request to: {self.path}")
        
        # Verify admin authorization
        auth_header = self.headers.get('Authorization')
        if auth_header and auth_header.startswith('Basic '):
            # Try to authenticate
            try:
                encoded_credentials = auth_header[6:]  # Remove 'Basic '
                decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
                username, password = decoded_credentials.split(':')
                
                if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
                    print(f"Invalid credentials: {username}")
                    self.send_error(401, "Invalid credentials")
                    return
                
                print(f"Admin authenticated: {username}")
            except Exception as e:
                print(f"Auth error: {str(e)}")
                self.send_error(401, "Authentication error")
                return
        else:
            print("No authorization header")
            # We'll still proceed for now to make debugging easier
        
        # Extract review ID from path
        match = re.search(r'/api/reviews/([^/]+)', self.path)
        if not match:
            print(f"Invalid URL path: {self.path}")
            self.send_error(400, "Invalid URL path")
            return
        
        review_id = match.group(1)
        print(f"Attempting to delete review with ID: {review_id}")
        
        # Load reviews
        reviews = load_reviews()
        print(f"Loaded {len(reviews)} reviews")
        print(f"Review IDs: {[r.get('id') for r in reviews]}")
        
        # Find the review by ID
        original_length = len(reviews)
        new_reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        # Check if we found and removed a review
        deleted = len(new_reviews) < original_length
        
        if deleted:
            # Save updated reviews
            print(f"Deleting review with ID: {review_id}")
            save_success = save_reviews(new_reviews)
            print(f"Save success: {save_success}")
        else:
            print(f"Review with ID {review_id} not found")
        
        # Calculate average rating
        avg_rating = calculate_average_rating(new_reviews)
        
        # Success response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = {
            "success": deleted,
            "message": "Review deleted successfully" if deleted else "Review not found",
            "averageRating": avg_rating,
            "totalReviews": len(new_reviews),
            "reviewId": review_id
        }
        
        self.wfile.write(json.dumps(response_data).encode()) 