import axios from 'axios';

// API URL - will be automatically set based on environment
const API_URL = '/api';

class ReviewsService {
  // Get all reviews
  static async getAllReviews() {
    try {
      console.log('Fetching reviews from:', API_URL);
      const response = await axios.get(API_URL);
      console.log('Reviews response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }
  
  // Submit a new review
  static async submitReview(reviewData) {
    try {
      console.log('Submitting review to:', API_URL);
      console.log('Review data:', reviewData);
      const response = await axios.post(API_URL, reviewData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Submit response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }
  
  // Delete a review (admin only) - Note: This won't work with the simplified API
  static async deleteReview(reviewId, authHeaders) {
    try {
      console.log('Deleting review:', reviewId);
      // This is a simplified version that won't actually work with our simple API
      const response = await axios.delete(`${API_URL}?id=${reviewId}`, {
        headers: authHeaders
      });
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  }
}

export default ReviewsService; 