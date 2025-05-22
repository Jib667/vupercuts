from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Simulate a database with JSON files
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
APPOINTMENTS_FILE = os.path.join(DATA_DIR, 'appointments.json')
REVIEWS_FILE = os.path.join(DATA_DIR, 'reviews.json')

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
        return jsonify(get_reviews())
    
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
        
        return jsonify(review), 201

if __name__ == '__main__':
    app.run(debug=True) 