from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import functools

app = Flask(__name__)
CORS(app)

# Simulate a database with JSON files
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
APPOINTMENTS_FILE = os.path.join(DATA_DIR, 'appointments.json')
REVIEWS_FILE = os.path.join(DATA_DIR, 'reviews.json')
ADMIN_CREDENTIALS_FILE = os.path.join(DATA_DIR, 'admin.json')

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
        # Default credentials - in production, use a more secure approach
        json.dump({"username": "admin", "password": "vupercuts2024"}, f)

def get_admin_credentials():
    with open(ADMIN_CREDENTIALS_FILE, 'r') as f:
        return json.load(f)

def require_admin_auth(f):
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Basic '):
            return jsonify({"error": "Unauthorized"}), 401
        
        try:
            # Extract and check credentials
            import base64
            encoded_credentials = auth_header[6:]  # Remove 'Basic '
            decoded_credentials = base64.b64decode(encoded_credentials).decode('utf-8')
            username, password = decoded_credentials.split(':')
            
            admin_credentials = get_admin_credentials()
            if username != admin_credentials['username'] or password != admin_credentials['password']:
                return jsonify({"error": "Invalid credentials"}), 401
            
            return f(*args, **kwargs)
        except Exception as e:
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

@app.route('/')
def home():
    return "Vupercuts API is running!"

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
    reviews = get_reviews()
    initial_count = len(reviews)
    
    # Filter out the review to be deleted
    filtered_reviews = [review for review in reviews if review['id'] != review_id]
    
    if len(filtered_reviews) == initial_count:
        return jsonify({"error": "Review not found"}), 404
    
    # Save updated reviews
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