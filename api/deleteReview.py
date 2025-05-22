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
# Use a GitHub Personal Access Token with public_repo scope
GITHUB_TOKEN = "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"
REVIEWS_FILE_PATH = "data/reviews.json"

def debug_log(message):
    try:
        with open("/tmp/debug.log", "a") as f:
            f.write(f"{datetime.now().isoformat()} - DEDICATED DELETE: {message}\n")
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
        
        debug_log(f"Making GitHub API request to: {url}")
        response = requests.get(url, headers=headers)
        debug_log(f"GitHub API response status: {response.status_code}")
        
        if response.status_code == 200:
            content = response.json()
            debug_log("Successfully got content from GitHub")
            
            file_content = base64.b64decode(content["content"]).decode("utf-8")
            reviews = json.loads(file_content)
            debug_log(f"Successfully loaded {len(reviews)} reviews from GitHub")
            return reviews, content["sha"]
        else:
            debug_log(f"Failed to load reviews from GitHub: {response.status_code}")
            debug_log(f"Response body: {response.text}")
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
        debug_log("Preparing content for GitHub commit")
        content = base64.b64encode(json.dumps(reviews, indent=2).encode("utf-8")).decode("utf-8")
        data = {
            "message": f"Update reviews - removed review ({datetime.now().isoformat()})",
            "content": content,
            "sha": current_sha
        }
        
        debug_log(f"Making PUT request to GitHub API: {url}")
        response = requests.put(url, headers=headers, json=data)
        debug_log(f"GitHub API PUT response status: {response.status_code}")
        
        if response.status_code in [200, 201]:
            debug_log("Successfully committed reviews to GitHub")
            return True
        else:
            debug_log(f"Failed to commit reviews to GitHub: {response.status_code}")
            debug_log(f"Response body: {response.text}")
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
        
        # Try loading reviews from multiple sources
        # 1. Try GitHub first
        reviews, current_sha = load_reviews_from_github()
        
        # If no reviews from GitHub, try local cache as fallback
        if not reviews or not current_sha:
            debug_log("Failed to load reviews from GitHub, trying alternate methods")
            
            # Try local cache
            try:
                local_file = "/tmp/vupercuts_reviews.json"
                if os.path.exists(local_file):
                    with open(local_file, "r") as f:
                        reviews = json.load(f)
                    debug_log(f"Loaded {len(reviews)} reviews from local cache")
                else:
                    debug_log("No local cache file found")
                    reviews = []
            except Exception as e:
                debug_log(f"Error loading from local cache: {str(e)}")
                reviews = []
        
        debug_log(f"Working with {len(reviews)} reviews")
        
        # Find and remove the review
        debug_log(f"Attempting to delete review with ID: {review_id}")
        if reviews:
            debug_log(f"Current reviews IDs: {[r.get('id') for r in reviews]}")
        
        initial_length = len(reviews)
        new_reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        debug_log(f"Reviews after deletion attempt: {len(new_reviews)}")
        
        # Even if the review wasn't found, proceed with updating the reviews list
        deleted = len(new_reviews) < initial_length
        if deleted:
            debug_log(f"Successfully filtered out review ID {review_id}")
        else:
            debug_log(f"Review with ID {review_id} not found in current reviews")
        
        # Save changes to both GitHub and local cache
        github_success = False
        local_success = False
        
        # 1. Try GitHub if we have SHA
        if current_sha:
            github_success = commit_reviews_to_github(new_reviews, current_sha)
            debug_log(f"GitHub commit result: {github_success}")
        
        # 2. Always save to local cache as backup
        try:
            with open("/tmp/vupercuts_reviews.json", "w") as f:
                json.dump(new_reviews, f)
            debug_log("Successfully saved reviews to local cache")
            local_success = True
        except Exception as e:
            debug_log(f"Failed to save reviews to local cache: {str(e)}")
        
        # Calculate new average
        avg_rating = calculate_average_rating(new_reviews)
        
        # Always return success for better user experience
        debug_log("Sending success response for deletion")
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.add_anti_cache_headers()
        self.end_headers()
        
        response_data = {
            "message": "Review deletion processed",
            "reviewId": review_id,
            "deleted": deleted,
            "githubSuccess": github_success,
            "localSuccess": local_success,
            "averageRating": avg_rating,
            "totalReviews": len(new_reviews),
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