import axios from 'axios';

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

class ReviewsService {
  // Get all reviews
  static async getAllReviews() {
    try {
      console.log('Fetching reviews from:', `${API_URL}/reviews`);
      const response = await axios.get(`${API_URL}/reviews`);
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
      console.log('Submitting review to:', `${API_URL}/reviews`);
      console.log('Review data:', reviewData);
      const response = await axios.post(`${API_URL}/reviews`, reviewData, {
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
  
  // Delete a review (admin only)
  static async deleteReview(reviewId, authHeaders) {
    try {
      console.log('Deleting review:', reviewId);
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
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