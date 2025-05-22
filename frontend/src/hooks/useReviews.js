import { useState } from 'react'
import axios from 'axios'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const useReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  
  // Admin state
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  
  const fetchReviews = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await axios.get(`${API_URL}/reviews`)
      const data = response.data
      
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
      return data
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews. Please try again later.')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  const submitReview = async (reviewData) => {
    setError('')
    
    try {
      const response = await axios.post(`${API_URL}/reviews`, reviewData)
      const data = response.data
      
      setReviews([data.review, ...reviews])
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
      
      return data
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Failed to submit review. Please try again.')
      throw err
    }
  }
  
  const deleteReview = async (reviewId) => {
    if (!isAdmin) {
      setError('Admin authentication required')
      return
    }
    
    try {
      // Create Basic Auth header
      const authString = `${adminUsername}:${adminPassword}`
      const encodedAuth = btoa(authString)
      
      const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Basic ${encodedAuth}`
        }
      })
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewId))
      setAverageRating(response.data.averageRating)
      setTotalReviews(response.data.totalReviews)
      
      return response.data
    } catch (err) {
      console.error('Error deleting review:', err)
      if (err.response && err.response.status === 401) {
        setIsAdmin(false)
        localStorage.removeItem('vupercutsAdminAuth')
        setError('Admin session expired. Please log in again.')
      } else {
        setError('Failed to delete review. Please try again.')
      }
      throw err
    }
  }
  
  const verifyAdminAuth = async (username, password) => {
    try {
      // Create Basic Auth header
      const authString = `${username}:${password}`
      const encodedAuth = btoa(authString)
      
      await axios.get(`${API_URL}/admin/verify`, {
        headers: {
          'Authorization': `Basic ${encodedAuth}`
        }
      })
      
      setIsAdmin(true)
      setAdminUsername(username)
      setAdminPassword(password)
      
      return true
    } catch (err) {
      setIsAdmin(false)
      localStorage.removeItem('vupercutsAdminAuth')
      throw err
    }
  }
  
  const adminLogout = () => {
    setIsAdmin(false)
    setAdminUsername('')
    setAdminPassword('')
    localStorage.removeItem('vupercutsAdminAuth')
  }
  
  return {
    reviews,
    loading,
    error,
    averageRating,
    totalReviews,
    isAdmin,
    fetchReviews,
    submitReview,
    deleteReview,
    verifyAdminAuth,
    adminLogout
  }
} 