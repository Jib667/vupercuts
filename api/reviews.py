from http.server import BaseHTTPRequestHandler
import json
import time
import base64
import re
from datetime import datetime

# In-memory storage for reviews - empty initially
reviews = []

# Admin credentials
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

def calculate_average_rating():
    if not reviews:
        return 0
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        avg_rating = calculate_average_rating()
        
        response_data = {
            "reviews": reviews,
            "averageRating": avg_rating,
            "totalReviews": len(reviews)
        }
        
        self.wfile.write(json.dumps(response_data).encode())
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Check if this is a delete action
        if data.get('action') == 'delete':
            # Verify admin authentication for delete action
            auth_header = self.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Basic '):
                self.send_error_response(401, "Unauthorized")
                return
            
            # Extract and check credentials
            encoded_credentials = auth_header[6:]  # Remove 'Basic '
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':')
            
            if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
                self.send_error_response(401, "Invalid credentials")
                return
            
            # Get review ID to delete
            review_id = data.get('id')
            if not review_id:
                self.send_error_response(400, "Missing review ID")
                return
            
            # Find and remove the review
            global reviews
            initial_length = len(reviews)
            reviews[:] = [r for r in reviews if str(r.get('id')) != str(review_id)]
            
            if len(reviews) == initial_length:
                self.send_error_response(404, "Review not found")
                return
            
            # Calculate new average
            avg_rating = calculate_average_rating()
            
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
            return
        
        # Otherwise, this is a regular add review action
        # Create a new review
        review = {
            'id': str(time.time()),
            'name': data.get('name', ''),
            'text': data.get('text', ''),
            'rating': data.get('rating', 5),
            'createdAt': datetime.now().isoformat()
        }
        
        # Add to in-memory list
        reviews.append(review)
        
        avg_rating = calculate_average_rating()
        
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
        # Verify admin authentication
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            self.send_error_response(401, "Unauthorized")
            return
        
        # Extract and check credentials
        encoded_credentials = auth_header[6:]  # Remove 'Basic '
        decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
        username, password = decoded_credentials.split(':')
        
        if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
            self.send_error_response(401, "Invalid credentials")
            return
        
        # Extract review ID from path
        match = re.search(r'/api/reviews/([^/]+)', self.path)
        if not match:
            self.send_error_response(400, "Invalid request path")
            return
        
        review_id = match.group(1)
        
        # Find and remove the review
        global reviews
        initial_length = len(reviews)
        reviews[:] = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        if len(reviews) == initial_length:
            self.send_error_response(404, "Review not found")
            return
        
        # Calculate new average
        avg_rating = calculate_average_rating()
        
        # Success response
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
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
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