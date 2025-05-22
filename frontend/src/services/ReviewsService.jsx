import axios from 'axios';

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

class ReviewsService {
  // Get all reviews
  static async getAllReviews() {
    try {
      const response = await axios.get(`${API_URL}/reviews`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }
  
  // Submit a new review
  static async submitReview(reviewData) {
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }
  
  // Delete a review (admin only)
  static async deleteReview(reviewId, authHeaders) {
    try {
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: authHeaders
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }
}

export default ReviewsService; 