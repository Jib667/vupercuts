import axios from 'axios'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

class ReviewsService {
  async getAllReviews() {
    try {
      const response = await axios.get(`${API_URL}/reviews`)
      return response.data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  }
  
  async submitReview(reviewData) {
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData)
      return response.data
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }
  
  async deleteReview(reviewId, authHeaders) {
    try {
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: authHeaders
      })
      return response.data
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }
  
  async verifyAdmin(username, password) {
    try {
      // Create Basic Auth header
      const authString = `${username}:${password}`
      const encodedAuth = btoa(authString)
      
      const response = await axios.get(`${API_URL}/admin/verify`, {
        headers: {
          'Authorization': `Basic ${encodedAuth}`
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error verifying admin:', error)
      throw error
    }
  }
}

export default new ReviewsService() 