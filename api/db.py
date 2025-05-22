import os
import json
import logging
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("database")

# Use environment variable or default to a database file
DB_DIR = os.environ.get('VERCEL_DB_DIR', '.')
REVIEWS_FILE = os.path.join(DB_DIR, 'reviews.json')
ADMIN_CREDENTIALS = {"username": "admin", "password": "vupercuts2024"}

# Demo data if needed
DEFAULT_REVIEWS = [
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

def init_db():
    """Initialize the database if it doesn't exist."""
    try:
        if not os.path.exists(REVIEWS_FILE):
            logger.info(f"Creating initial reviews database at {REVIEWS_FILE}")
            with open(REVIEWS_FILE, 'w') as f:
                json.dump(DEFAULT_REVIEWS, f)
            return DEFAULT_REVIEWS
        return get_reviews()
    except Exception as e:
        logger.error(f"Error initializing database: {str(e)}")
        logger.error(traceback.format_exc())
        return DEFAULT_REVIEWS

def get_reviews():
    """Get all reviews from the database."""
    try:
        if not os.path.exists(REVIEWS_FILE):
            logger.info(f"Reviews file not found at {REVIEWS_FILE}, initializing")
            return init_db()
        
        with open(REVIEWS_FILE, 'r') as f:
            data = json.load(f)
            logger.info(f"Loaded {len(data)} reviews from database")
            return data
    except Exception as e:
        logger.error(f"Error reading reviews: {str(e)}")
        logger.error(traceback.format_exc())
        return DEFAULT_REVIEWS

def save_reviews(reviews):
    """Save reviews to the database."""
    try:
        # Make sure the directory exists
        os.makedirs(os.path.dirname(REVIEWS_FILE), exist_ok=True)
        
        with open(REVIEWS_FILE, 'w') as f:
            json.dump(reviews, f)
        logger.info(f"Saved {len(reviews)} reviews to database")
        return True
    except Exception as e:
        logger.error(f"Error saving reviews: {str(e)}")
        logger.error(traceback.format_exc())
        return False

def add_review(review_data):
    """Add a new review to the database."""
    try:
        # Create review with unique ID
        review = {
            'id': str(datetime.now().timestamp()),
            'name': review_data.get('name', ''),
            'text': review_data.get('text', ''),
            'rating': review_data.get('rating', 5),
            'createdAt': datetime.now().isoformat()
        }
        
        # Get existing reviews and add the new one
        reviews = get_reviews()
        reviews.append(review)
        
        # Save the updated reviews
        if save_reviews(reviews):
            logger.info(f"Added new review with ID: {review['id']}")
            return review, calculate_average_rating(reviews), len(reviews)
        else:
            logger.error("Failed to save review")
            return None, 0, 0
    except Exception as e:
        logger.error(f"Error adding review: {str(e)}")
        logger.error(traceback.format_exc())
        return None, 0, 0

def delete_review(review_id):
    """Delete a review from the database."""
    try:
        # Get existing reviews
        reviews = get_reviews()
        initial_count = len(reviews)
        
        # Filter out the review to delete
        filtered_reviews = [r for r in reviews if str(r.get('id')) != str(review_id)]
        
        # Check if the review was found
        if len(filtered_reviews) == initial_count:
            logger.error(f"Review not found with ID: {review_id}")
            return False, 0, 0
        
        # Save the updated reviews
        if save_reviews(filtered_reviews):
            logger.info(f"Deleted review with ID: {review_id}")
            avg_rating = calculate_average_rating(filtered_reviews)
            return True, avg_rating, len(filtered_reviews)
        else:
            logger.error("Failed to save reviews after deletion")
            return False, 0, 0
    except Exception as e:
        logger.error(f"Error deleting review: {str(e)}")
        logger.error(traceback.format_exc())
        return False, 0, 0

def calculate_average_rating(reviews):
    """Calculate the average rating from all reviews."""
    if not reviews:
        return 0
    
    total_rating = sum(review.get('rating', 0) for review in reviews)
    return round(total_rating / len(reviews), 1)

def verify_admin(username, password):
    """Verify admin credentials."""
    return username == ADMIN_CREDENTIALS["username"] and password == ADMIN_CREDENTIALS["password"] 