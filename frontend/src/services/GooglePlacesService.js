import axios from 'axios';

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

class GooglePlacesService {
  static async getGoogleReviews() {
    try {
      const endpoint = `${API_URL}/google-reviews`;
      console.log('Fetching Google reviews from:', endpoint);
      const response = await axios.get(endpoint);
      console.log('Google reviews response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching Google reviews:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }
}

export default GooglePlacesService; 