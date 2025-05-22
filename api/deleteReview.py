from http.server import BaseHTTPRequestHandler
import json
import time
import base64
import re
import os
import requests
from datetime import datetime

# Admin credentials
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

# GitHub repo details
GITHUB_REPO = "Jib667/vupercuts"
GITHUB_TOKEN = "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"  # Read-only token for public repos
REVIEWS_FILE_PATH = "data/reviews.json"

def debug_log(message):
    try:
        with open("/tmp/debug.log", "a") as f:
            f.write(f"{datetime.now().isoformat()} - {message}\n")
    except Exception as e:
        pass

def load_reviews_from_github():
    """Load reviews directly from GitHub repo"""
    try:
        debug_log("Attempting to load reviews directly from GitHub")
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{REVIEWS_FILE_PATH}"
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {GITHUB_TOKEN}"
        }
        
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            content = response.json()
            file_content = base64.b64decode(content["content"]).decode("utf-8")
            reviews = json.loads(file_content)
            debug_log(f"Successfully loaded {len(reviews)} reviews from GitHub")
            return reviews, content["sha"]
        else:
            debug_log(f"Failed to load reviews from GitHub: {response.status_code} - {response.text}")
            return [], None
    except Exception as e:
        debug_log(f"Exception loading reviews from GitHub: {str(e)}")
        return [], None

def commit_reviews_to_github(reviews, current_sha):
    """Commit updated reviews directly to GitHub repo"""
    try:
        debug_log(f"Attempting to commit {len(reviews)} reviews to GitHub")
        url = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{REVIEWS_FILE_PATH}"
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {GITHUB_TOKEN}"
        }
        
        # Prepare the content for the update
        content = base64.b64encode(json.dumps(reviews, indent=2).encode("utf-8")).decode("utf-8")
        data = {
            "message": f"Update reviews - removed review ({datetime.now().isoformat()})",
            "content": content,
            "sha": current_sha
        }
        
        response = requests.put(url, headers=headers, json=data)
        if response.status_code in [200, 201]:
            debug_log("Successfully committed reviews to GitHub")
            return True
        else:
            debug_log(f"Failed to commit reviews to GitHub: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        debug_log(f"Exception committing reviews to GitHub: {str(e)}")
        return False

def calculate_average_rating(reviews):
    """Calculate average rating from reviews"""
    if not reviews:
        return 0
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

class handler(BaseHTTPRequestHandler):
    def add_anti_cache_headers(self):
        """Add anti-cache headers to all responses"""
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Vary', '*')
        self.send_header('Access-Control-Allow-Origin', '*')
    
    def do_DELETE(self):
        debug_log(f"DEDICATED DELETE HANDLER - Request to {self.path}")
        debug_log(f"Headers: {self.headers}")
        
        # Verify admin authentication
        auth_header = self.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            debug_log("Missing or invalid auth header")
            self.send_error_response(401, "Unauthorized")
            return
        
        # Extract and check credentials
        encoded_credentials = auth_header[6:]  # Remove 'Basic '
        decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
        username, password = decoded_credentials.split(':')
        
        debug_log(f"Auth attempt with username: {username}")
        
        if username != ADMIN_CREDENTIALS["username"] or password != ADMIN_CREDENTIALS["password"]:
            debug_log("Invalid credentials")
            self.send_error_response(401, "Invalid credentials")
            return
        
        # Extract review ID from path - try multiple patterns
        review_id = None
        
        # Try standard pattern
        match = re.search(r'/api/reviews/([^/]+)', self.path)
        if match:
            review_id = match.group(1)
        else:
            # Try alternate pattern
            parts = self.path.strip('/').split('/')
            if len(parts) >= 3 and parts[-2] == 'reviews':
                review_id = parts[-1]
        
        # Remove any query parameters if present
        if review_id and '?' in review_id:
            review_id = review_id.split('?')[0]
        
        debug_log(f"Extracted review ID: {review_id}")
        
        if not review_id:
            debug_log(f"Could not extract review ID from path: {self.path}")
            self.send_error_response(400, "Invalid request path")
            return
        
        # Load reviews directly from GitHub
        reviews, current_sha = load_reviews_from_github()
        if not reviews and not current_sha:
            debug_log("Failed to load reviews from GitHub")
            self.send_error_response(500, "Failed to load reviews from GitHub")
            return
        
        debug_log(f"Loaded {len(reviews)} reviews from GitHub")
        
        # Find and remove the review
        debug_log(f"Attempting to delete review with ID: {review_id}")
        debug_log(f"Current reviews IDs: {[r.get('id') for r in reviews]}")
        
        initial_length = len(reviews)
        reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        debug_log(f"Reviews after deletion attempt: {len(reviews)}")
        
        if len(reviews) == initial_length:
            debug_log(f"Review with ID {review_id} not found in current reviews")
            self.send_error_response(404, "Review not found")
            return
        
        # Commit the updated reviews back to GitHub
        if not commit_reviews_to_github(reviews, current_sha):
            debug_log("Failed to commit reviews to GitHub")
            self.send_error_response(500, "Failed to commit reviews to GitHub")
            return
        
        # Also save to the local cache
        try:
            with open("/tmp/vupercuts_reviews.json", "w") as f:
                json.dump(reviews, f)
            debug_log("Successfully saved reviews to local cache")
        except Exception as e:
            debug_log(f"Failed to save reviews to local cache: {str(e)}")
            # Continue anyway since we've already saved to GitHub
        
        # Calculate new average
        avg_rating = calculate_average_rating(reviews)
        
        # Success response
        debug_log("Sending success response for deletion")
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.add_anti_cache_headers()
        self.end_headers()
        
        response_data = {
            "message": "Review permanently deleted from GitHub",
            "averageRating": avg_rating,
            "totalReviews": len(reviews),
            "timestamp": time.time()
        }
        
        self.wfile.write(json.dumps(response_data).encode())
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests - for CORS"""
        self.send_response(200)
        self.add_anti_cache_headers()
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def send_error_response(self, status_code, message):
        debug_log(f"Sending error response: {status_code} - {message}")
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.add_anti_cache_headers()
        self.end_headers()
        
        error_data = {
            "error": message,
            "timestamp": time.time()
        }
        
        self.wfile.write(json.dumps(error_data).encode()) 