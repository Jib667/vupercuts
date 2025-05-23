import axios from 'axios';

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

class GooglePlacesService {
  static async getGoogleReviews() {
    try {
      const endpoint = `${API_URL}/google-reviews`;
      console.log('Fetching Google reviews from:', endpoint);
      
      // Add logging for debugging
      console.log('Environment:', import.meta.env.PROD ? 'Production' : 'Development');
      
      const response = await axios.get(endpoint);
      console.log('Google reviews response:', response.data);
      return response.data;
    } catch (error) {
      // Improved error logging
      console.error('Error fetching Google reviews:', error.message || error);
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
      throw error;
    }
  }
}

export default GooglePlacesService; 