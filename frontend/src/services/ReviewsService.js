import axios from 'axios'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

console.log(`Using API URL: ${API_URL} (PROD: ${import.meta.env.PROD})`);

class ReviewsService {
  static async getAllReviews() {
    try {
      console.log('Fetching reviews from:', `${API_URL}/reviews`);
      const response = await axios.get(`${API_URL}/reviews`);
      console.log('Reviews response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
  
  static async submitReview(reviewData) {
    try {
      console.log('Submitting review to:', `${API_URL}/reviews`);
      console.log('Review data:', reviewData);
      const response = await axios.post(`${API_URL}/reviews`, reviewData);
      console.log('Submit response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
  
  static async deleteReview(reviewId, authHeaders) {
    try {
      console.log('Deleting review with ID:', reviewId);
      console.log('Auth headers:', authHeaders);
      console.log('Request URL:', `${API_URL}/reviews/${reviewId}`);
      
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: authHeaders
      });
      
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
  
  static async verifyAdmin(username, password) {
    try {
      // Create Basic Auth header
      const authString = `${username}:${password}`;
      const encodedAuth = btoa(authString);
      
      console.log('Verifying admin credentials at:', `${API_URL}/admin/verify`);
      
      const response = await axios.get(`${API_URL}/admin/verify`, {
        headers: {
          'Authorization': `Basic ${encodedAuth}`
        }
      });
      
      console.log('Admin verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error verifying admin:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
}

export default ReviewsService 