from http.server import BaseHTTPRequestHandler
import json
import time
from datetime import datetime

# In-memory storage for reviews (will reset on server restart)
reviews = [
    {
        "id": "1747934236.194175",
        "name": "Will Jordan",
        "text": "I had a great experience at Vupercuts. The vibe, music, friendliness, and especially the haircut made it quite memorable. I've never gotten so many compliments on a haircut the next day too. For sure recommend!",
        "rating": 5,
        "createdAt": "2025-05-22T13:17:16.194201"
    },
    {
        "id": "1747934847.719001",
        "name": "Jibran Hutchins",
        "text": "Great cut, great experience. Def recommend.",
        "rating": 5,
        "createdAt": "2025-05-22T13:27:27.719026"
    }
]

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
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers() 