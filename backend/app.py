from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import functools
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# File-based data storage with path that works in both local and Vercel environments
# In Vercel, we need to use the /tmp directory for writable storage
if os.environ.get('VERCEL_ENV'):
    DATA_DIR = '/tmp'
else:
    DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

APPOINTMENTS_FILE = os.path.join(DATA_DIR, 'appointments.json')
REVIEWS_FILE = os.path.join(DATA_DIR, 'reviews.json')
ADMIN_CREDENTIALS_FILE = os.path.join(DATA_DIR, 'admin.json')

# Google Places API
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY', '')
PLACE_ID = os.environ.get('GOOGLE_PLACE_ID', '')

# Ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Initialize JSON files if they don't exist
if not os.path.exists(APPOINTMENTS_FILE):
    with open(APPOINTMENTS_FILE, 'w') as f:
        json.dump([], f)

if not os.path.exists(REVIEWS_FILE):
    with open(REVIEWS_FILE, 'w') as f:
        json.dump([], f)

# Create admin credentials file with default username and password if it doesn't exist
if not os.path.exists(ADMIN_CREDENTIALS_FILE):
    with open(ADMIN_CREDENTIALS_FILE, 'w') as f:
        # Default credentials - in production, use environment variables
        admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'vupercuts2024')
        json.dump({"username": admin_username, "password": admin_password}, f)

def get_admin_credentials():
    with open(ADMIN_CREDENTIALS_FILE, 'r') as f:
        return json.load(f)

def require_admin_auth(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        print(f"Request headers: {request.headers}")
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            print("Missing or invalid Authorization header")
            return jsonify({"error": "Unauthorized"}), 401
        
        try:
            # Extract and check credentials
            import base64
            encoded_credentials = auth_header[6:]  # Remove 'Basic '
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':')
            
            print(f"Received auth for username: {username}")
            admin_credentials = get_admin_credentials()
            
            if username != admin_credentials['username'] or password != admin_credentials['password']:
                print(f"Invalid credentials. Expected username: {admin_credentials['username']}")
                return jsonify({"error": "Invalid credentials"}), 401
            
            print("Admin authentication successful")
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Authentication error: {str(e)}")
            return jsonify({"error": f"Authentication error: {str(e)}"}), 401
    
    return decorated

def get_appointments():
    try:
        with open(APPOINTMENTS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_appointments(appointments):
    with open(APPOINTMENTS_FILE, 'w') as f:
        json.dump(appointments, f)

def get_reviews():
    try:
        with open(REVIEWS_FILE, 'r') as f:
            return json.load(f)
    except:
        return []

def save_reviews(reviews):
    with open(REVIEWS_FILE, 'w') as f:
        json.dump(reviews, f)

def calculate_average_rating():
    reviews = get_reviews()
    if not reviews:
        return 0
    
    total_rating = sum(review['rating'] for review in reviews)
    return round(total_rating / len(reviews), 1)

# Generate available time slots
def get_available_slots(date_str):
    # Convert string to date
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    # Get existing appointments for the date
    appointments = get_appointments()
    booked_times = [
        appointment['time'] 
        for appointment in appointments 
        if appointment['date'] == date_str
    ]
    
    # Generate time slots from 9 AM to 6 PM, 30-minute intervals
    available_slots = []
    start_time = datetime.combine(date, datetime.min.time()) + timedelta(hours=9)
    end_time = datetime.combine(date, datetime.min.time()) + timedelta(hours=18)
    
    current_time = start_time
    while current_time < end_time:
        time_str = current_time.strftime('%H:%M')
        if time_str not in booked_times:
            available_slots.append(time_str)
        current_time += timedelta(minutes=30)
    
    return available_slots

def fetch_google_reviews():
    """Fetch reviews from Google Places API"""
    print(f"Google API Key: {GOOGLE_API_KEY[:5]}...{GOOGLE_API_KEY[-4:] if len(GOOGLE_API_KEY) > 10 else ''}")
    print(f"Place ID: {PLACE_ID}")
    
    if not GOOGLE_API_KEY or not PLACE_ID:
        print("Google API configuration missing")
        return {"error": "Google API configuration missing"}, 500
    
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={PLACE_ID}&fields=reviews,rating,user_ratings_total,url&key={GOOGLE_API_KEY}"
    print(f"Fetching reviews from URL: {url}")
    
    try:
        response = requests.get(url)
        data = response.json()
        
        print(f"Google Places API response status: {data.get('status')}")
        
        if data.get('status') != 'OK':
            print(f"Google Places API error: {data.get('status')}")
            print(f"Error message: {data.get('error_message', 'No error message provided')}")
            return {"error": f"Google Places API error: {data.get('status')}"}, 500
            
        result = data.get('result', {})
        reviews = result.get('reviews', [])
        place_url = result.get('url', f"https://search.google.com/local/reviews?placeid={PLACE_ID}")
        print(f"Fetched {len(reviews)} reviews")
        
        # Format reviews to match our expected structure
        formatted_reviews = []
        for review in reviews:
            formatted_review = {
                'id': review.get('time', ''),  # Use the timestamp as ID
                'name': review.get('author_name', ''),
                'text': review.get('text', ''),
                'rating': review.get('rating', 0),
                'createdAt': review.get('time', ''),  # Unix timestamp
                'profile_photo_url': review.get('profile_photo_url', ''),
                'relative_time_description': review.get('relative_time_description', ''),
                'isGoogleReview': True,
                'place_url': place_url
            }
            formatted_reviews.append(formatted_review)
            
        return {
            "reviews": formatted_reviews,
            "averageRating": result.get('rating', 0),
            "totalReviews": result.get('user_ratings_total', 0),
            "placeUrl": place_url
        }, 200
        
    except Exception as e:
        print(f"Error fetching Google reviews: {str(e)}")
        return {"error": f"Failed to fetch Google reviews: {str(e)}"}, 500

@app.route('/')
def home():
    return jsonify({"message": "Vupercuts API is running!"})

@app.route('/api')
def api_home():
    return jsonify({"message": "Vupercuts API is running!"})

@app.route('/api/available-slots', methods=['GET'])
def available_slots():
    date = request.args.get('date')
    if not date:
        return jsonify({"error": "Date parameter is required"}), 400
    
    slots = get_available_slots(date)
    return jsonify(slots)

@app.route('/api/appointments', methods=['GET', 'POST'])
def appointments():
    if request.method == 'GET':
        return jsonify(get_appointments())
    
    elif request.method == 'POST':
        data = request.json
        required_fields = ['name', 'email', 'phone', 'date', 'time', 'paymentMethod']
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create appointment with unique ID
        appointment = {
            'id': str(datetime.now().timestamp()),
            'name': data['name'],
            'email': data['email'],
            'phone': data['phone'],
            'date': data['date'],
            'time': data['time'],
            'paymentMethod': data['paymentMethod'],
            'createdAt': datetime.now().isoformat()
        }
        
        # Save to "database"
        appointments = get_appointments()
        appointments.append(appointment)
        save_appointments(appointments)
        
        return jsonify(appointment), 201

@app.route('/api/google-reviews', methods=['GET'])
def google_reviews():
    result, status_code = fetch_google_reviews()
    return jsonify(result), status_code

@app.route('/api/reviews', methods=['GET', 'POST'])
def reviews():
    if request.method == 'GET':
        reviews_data = get_reviews()
        avg_rating = calculate_average_rating()
        return jsonify({
            "reviews": reviews_data,
            "averageRating": avg_rating,
            "totalReviews": len(reviews_data)
        })
    
    elif request.method == 'POST':
        data = request.json
        if 'name' not in data or 'text' not in data or 'rating' not in data:
            return jsonify({"error": "Missing required fields"}), 400
        
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
        
        # Return updated average rating along with the new review
        avg_rating = calculate_average_rating()
        return jsonify({
            "review": review,
            "averageRating": avg_rating,
            "totalReviews": len(reviews)
        }), 201

@app.route('/api/reviews/<review_id>', methods=['DELETE'])
@require_admin_auth
def delete_review(review_id):
    print(f"Attempting to delete review with ID: {review_id}")
    reviews = get_reviews()
    initial_count = len(reviews)
    
    # Filter out the review to be deleted
    filtered_reviews = [review for review in reviews if review['id'] != review_id]
    
    if len(filtered_reviews) == initial_count:
        print(f"Review not found with ID: {review_id}")
        return jsonify({"error": "Review not found"}), 404
    
    # Save updated reviews
    print(f"Deleting review. Count before: {initial_count}, after: {len(filtered_reviews)}")
    save_reviews(filtered_reviews)
    
    # Return updated average rating
    avg_rating = calculate_average_rating() if filtered_reviews else 0
    
    return jsonify({
        "message": "Review deleted successfully",
        "averageRating": avg_rating,
        "totalReviews": len(filtered_reviews)
    })

@app.route('/api/admin/verify', methods=['GET'])
@require_admin_auth
def verify_admin():
    return jsonify({"status": "authenticated", "message": "Admin authentication successful"})

if __name__ == '__main__':
    app.run(debug=True) 