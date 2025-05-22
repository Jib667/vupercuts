from http.server import BaseHTTPRequestHandler
import json
import os
import re

# Store reviews in file
def load_reviews():
    try:
        if os.path.exists("/tmp/reviews.json"):
            with open("/tmp/reviews.json", "r") as f:
                return json.load(f)
    except:
        pass
    return []

def save_reviews(reviews):
    try:
        with open("/tmp/reviews.json", "w") as f:
            json.dump(reviews, f)
    except:
        pass

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_DELETE(self):
        # Extract review ID from path
        match = re.search(r'/api/reviews/([^/]+)', self.path)
        if not match:
            self.send_error(400, "Invalid URL path")
            return
        
        review_id = match.group(1)
        
        # Load reviews
        reviews = load_reviews()
        
        # Find the review by ID
        original_length = len(reviews)
        reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        # Calculate average rating
        avg_rating = 0
        if reviews:
            total = sum(r.get('rating', 0) for r in reviews)
            avg_rating = round(total / len(reviews), 1)
        
        # Save updated reviews
        save_reviews(reviews)
        
        # Always return success
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