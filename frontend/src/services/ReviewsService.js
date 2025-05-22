import axios from 'axios'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

console.log(`Using API URL: ${API_URL} (PROD: ${import.meta.env.PROD})`);

class ReviewsService {
  static async getAllReviews() {
    try {
      const endpoint = `${API_URL}/reviews`;
      console.log('Fetching reviews from:', endpoint);
      const response = await axios.get(endpoint);
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
      const endpoint = `${API_URL}/reviews`;
      console.log('Submitting review to:', endpoint);
      console.log('Review data:', reviewData);
      const response = await axios.post(endpoint, reviewData);
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
      const endpoint = `${API_URL}/reviews/${reviewId}`;
      console.log('Deleting review with ID:', reviewId);
      console.log('Full delete URL:', endpoint);
      console.log('Auth headers:', authHeaders);
      
      const response = await axios.delete(endpoint, {
        headers: authHeaders
      });
      
      console.log('Delete response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  }
  
  static async verifyAdmin(username, password) {
    try {
      // Create Basic Auth header
      const authString = `${username}:${password}`;
      const encodedAuth = btoa(authString);
      
      const endpoint = `${API_URL}/admin/verify`;
      console.log('Verifying admin credentials at:', endpoint);
      
      const response = await axios.get(endpoint, {
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