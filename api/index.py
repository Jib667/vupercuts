from http.server import BaseHTTPRequestHandler
import json
import os
from datetime import datetime

# Simple in-memory database for the demo
reviews = []

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Return all reviews
        response = {
            "reviews": reviews,
            "averageRating": self._calculate_average() if reviews else 0,
            "totalReviews": len(reviews)
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        # Create new review
        review = {
            'id': str(datetime.now().timestamp()),
            'name': data.get('name', 'Anonymous'),
            'text': data.get('text', ''),
            'rating': data.get('rating', 5),
            'createdAt': datetime.now().isoformat()
        }
        
        # Add to our "database"
        reviews.append(review)
        
        # Return response
        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "review": review,
            "averageRating": self._calculate_average(),
            "totalReviews": len(reviews)
        }
        
        self.wfile.write(json.dumps(response).encode())
        return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
    
    def _calculate_average(self):
        if not reviews:
            return 0
        total = sum(review['rating'] for review in reviews)
        return round(total / len(reviews), 1) 