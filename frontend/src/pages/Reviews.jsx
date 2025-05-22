import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import ReviewsService from '../services/ReviewsService'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const Reviews = () => {
  const { isAdmin, adminLogin, adminLogout, getAuthHeaders } = useAdmin()
  
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newReview, setNewReview] = useState({
    name: '',
    text: '',
    rating: 5
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('reviews') // 'reviews' or 'form'
  
  // Admin state
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminLoginError, setAdminLoginError] = useState('')
  const [adminLoggingIn, setAdminLoggingIn] = useState(false)
  
  // Statistics
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipod|ipad|android|blackberry|windows phone/g.test(userAgent);
      setIsMobile(isMobileDevice || window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  useEffect(() => {
    fetchReviews()
  }, [])

  // Set default active tab based on device
  useEffect(() => {
    setActiveTab(isMobile ? 'reviews' : 'both');
  }, [isMobile]);

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const data = await ReviewsService.getAllReviews()
      
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching reviews:', err)
      setError('Failed to load reviews. Please try again later.')
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReview({
      ...newReview,
      [name]: value
    })
  }

  const handleRatingChange = (e) => {
    setNewReview({
      ...newReview,
      rating: parseInt(e.target.value)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMessage('')
    setError('')

    try {
      const data = await ReviewsService.submitReview(newReview)
      
      setReviews([data.review, ...reviews])
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
      
      setSuccessMessage('Thank you for your review!')
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
      setNewReview({
        name: '',
        text: '',
        rating: 5
      })
      
      // Switch to reviews tab on mobile after submitting
      if (isMobile) {
        setActiveTab('reviews');
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Failed to submit review. Please try again.')
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError('')
      }, 3000)
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminLoggingIn(true)
    setAdminLoginError('')
    
    try {
      await adminLogin(adminUsername, adminPassword)
      setShowAdminLogin(false)
    } catch (err) {
      console.error('Admin login error:', err)
      setAdminLoginError('Invalid credentials. Please try again.')
    } finally {
      setAdminLoggingIn(false)
    }
  }
  
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }
    
    try {
      console.log('Getting auth headers')
      const authHeaders = getAuthHeaders()
      console.log('Attempting to delete review with ID:', reviewId)
      
      const response = await ReviewsService.deleteReview(reviewId, authHeaders)
      console.log('Delete successful, response:', response)
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewId))
      setAverageRating(response.averageRating)
      setTotalReviews(response.totalReviews)
      
    } catch (err) {
      console.error('Error deleting review:', err)
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers
      })
      
      if (err.response && err.response.status === 401) {
        alert('Admin session expired. Please log in again.')
      } else {
        alert('Failed to delete review. Please try again.')
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? 'goldenrod' : '#ccc', marginRight: '3px', fontSize: '1.2rem' }}>
          ★
        </span>
      )
    }
    return stars
  }
  
  // Admin login modal
  const AdminLoginModal = () => {
    if (!showAdminLogin) return null;
    
    // Use refs for uncontrolled inputs
    const usernameInputRef = useRef(null);
    const passwordInputRef = useRef(null);
    
    // Simplified form submission handler that only accesses values when submitting
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      
      // Get values from refs only when submitting
      const username = usernameInputRef.current.value;
      const password = passwordInputRef.current.value;
      
      setAdminLoggingIn(true);
      setAdminLoginError('');
      
      try {
        await adminLogin(username, password);
        setShowAdminLogin(false);
      } catch (err) {
        console.error('Admin login error:', err);
        setAdminLoginError('Invalid credentials. Please try again.');
      } finally {
        setAdminLoggingIn(false);
      }
    };
    
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}
      >
        <div 
          style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            position: 'relative'
          }}
        >
          <button 
            onClick={() => setShowAdminLogin(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
            type="button"
          >
            &times;
          </button>
          
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h2>
          
          {adminLoginError && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {adminLoginError}
            </div>
          )}
          
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="adminUsername" className="form-label">Username</label>
              <input
                type="text"
                id="adminUsername"
                ref={usernameInputRef}
                className="form-control"
                defaultValue="" // Use defaultValue instead of value for uncontrolled input
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="adminPassword" className="form-label">Password</label>
              <input
                type="password"
                id="adminPassword"
                ref={passwordInputRef}
                className="form-control"
                defaultValue="" // Use defaultValue instead of value for uncontrolled input
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-accent"
              disabled={adminLoggingIn}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {adminLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Additional CSS styles for mobile
  const mobileStyles = `
    @media (max-width: 768px) {
      .reviews-container {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
      }
      
      .reviews-form, .reviews-list-container {
        position: static !important;
        width: 100% !important;
      }
      
      .mobile-tabs {
        display: flex !important;
      }
      
      .mobile-hidden {
        display: none !important;
      }
      
      .mobile-visible {
        display: block !important;
      }
      
      .reviews-list {
        max-height: 500px !important;
      }
    }
  `;

  return (
    <div style={{ 
      position: 'relative', 
      zIndex: 1,
      background: 'linear-gradient(180deg, rgba(26, 10, 42, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
    }}>
      <style>{mobileStyles}</style>
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.1) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: -1,
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '8%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.08) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: -1,
      }}></div>
      
      <div className="container" style={{ 
        padding: isMobile ? '3rem 1rem 4rem' : '5rem 2rem 6rem',
        marginTop: '60px', // Add margin to push content below navbar
        position: 'relative',
      }}>
        {/* Accent line at top - removed */}
        {/* <div style={{
          width: '100px',
          height: '4px',
          background: 'var(--accent)',
          marginBottom: '2rem',
          borderRadius: '2px',
        }}></div> */}
        
        {/* Admin Controls - REMOVED */}
        {/* <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          marginBottom: '2rem'
        }}>
          {isAdmin ? (
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignItems: 'center',
              background: 'rgba(106, 44, 176, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
            }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: 'var(--accent)',
                fontWeight: '500'
              }}>
                Admin Mode
              </span>
              <button 
                onClick={adminLogout}
                className="btn"
                style={{ 
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  background: 'var(--accent)',
                  boxShadow: '0 4px 8px rgba(106, 44, 176, 0.2)',
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAdminLogin(true)}
              style={{ 
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem',
                textDecoration: 'underline',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = '#666'}
            >
              Admin
            </button>
          )}
        </div> */}
      
        {successMessage && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(106, 44, 176, 0.1) 0%, rgba(106, 44, 176, 0.2) 100%)',
            color: 'var(--accent)',
            padding: '1.2rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(106, 44, 176, 0.2)',
            boxShadow: '0 4px 12px rgba(106, 44, 176, 0.1)',
            fontWeight: '500',
          }}>
            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
            {successMessage}
          </div>
        )}
        
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1.2rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        
        {/* Mobile Tabs */}
        {isMobile && (
          <div className="mobile-tabs" style={{
            display: 'none', // Initially hidden, shown via CSS for mobile
            borderRadius: '12px',
            background: 'white',
            padding: '0.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                flex: 1,
                padding: '0.8rem',
                background: activeTab === 'reviews' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'reviews' ? 'white' : 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <i className="fas fa-comment-alt" style={{ marginRight: '8px' }}></i>
              Reviews ({totalReviews})
            </button>
            <button
              onClick={() => setActiveTab('form')}
              style={{
                flex: 1,
                padding: '0.8rem',
                background: activeTab === 'form' ? 'var(--accent)' : 'transparent',
                color: activeTab === 'form' ? 'white' : 'var(--primary)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <i className="fas fa-pen" style={{ marginRight: '8px' }}></i>
              Write Review
            </button>
          </div>
        )}
        
        <div 
          className="reviews-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '4rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Leave a Review Form */}
          <div 
            className={`reviews-form ${isMobile && activeTab !== 'form' ? 'mobile-hidden' : ''}`}
            style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: 'var(--box-shadow)',
              padding: '2.5rem',
              height: 'fit-content',
              position: 'sticky',
              top: '100px',
              border: '1px solid rgba(106, 44, 176, 0.1)',
              backgroundImage: 'radial-gradient(circle at top right, rgba(106, 44, 176, 0.05), transparent 400px)',
            }}
          >
            <h2 style={{ 
              marginBottom: '2rem', 
              color: 'var(--primary)', 
              fontSize: '1.8rem',
              position: 'relative',
              paddingBottom: '10px',
            }}>
              Leave a Review
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '50px',
                height: '3px',
                background: 'var(--accent)',
                borderRadius: '3px',
              }}></span>
            </h2>
            
            {/* Mobile - Back button */}
            {isMobile && (
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(106, 44, 176, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newReview.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="John Doe"
                  required
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem',
                    border: '1px solid rgba(106, 44, 176, 0.2)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 44, 176, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(106, 44, 176, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    name="rating"
                    value={newReview.rating}
                    onChange={handleRatingChange}
                    style={{ 
                      flex: 1, 
                      marginRight: '1rem',
                      fontFamily: 'Poppins, sans-serif',
                      accentColor: 'var(--accent)',
                      height: '6px',
                    }}
                  />
                  <div style={{ 
                    display: 'flex',
                    background: 'rgba(106, 44, 176, 0.1)',
                    padding: '5px 10px',
                    borderRadius: '12px',
                  }}>
                    {renderStars(newReview.rating)}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="text" className="form-label">Your Review</label>
                <textarea
                  id="text"
                  name="text"
                  value={newReview.text}
                  onChange={handleInputChange}
                  className="form-control"
                  rows={5}
                  placeholder="Share your experience with us..."
                  required
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    border: '1px solid rgba(106, 44, 176, 0.2)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    resize: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(106, 44, 176, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(106, 44, 176, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-accent btn-block"
                disabled={submitting}
                style={{ 
                  width: '100%', 
                  marginTop: '1.5rem',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '500',
                  background: 'var(--accent)',
                  boxShadow: '0 4px 12px rgba(106, 44, 176, 0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 15px rgba(106, 44, 176, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(106, 44, 176, 0.2)';
                }}
              >
                {submitting ? (
                  <span>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                    Submitting...
                  </span>
                ) : (
                  <span>
                    <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i>
                    Submit Review
                  </span>
                )}
              </button>
            </form>
          </div>
          
          {/* Reviews List */}
          <div 
            className={`reviews-list-container ${isMobile && activeTab !== 'reviews' ? 'mobile-hidden' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              justifyContent: 'space-between',
              position: 'relative',
              paddingBottom: '15px',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
              gap: isMobile ? '1rem' : '0',
            }}>
              <h2 style={{ 
                color: 'var(--primary)', 
                fontSize: '1.8rem', 
                margin: 0,
                position: 'relative',
                flex: isMobile ? '1 0 100%' : 'auto',
                textAlign: isMobile ? 'center' : 'left',
              }}>
                What Our Customers Say
                <span style={{
                  position: 'absolute',
                  bottom: -10,
                  left: isMobile ? '50%' : 0,
                  transform: isMobile ? 'translateX(-50%)' : 'none',
                  width: '70px',
                  height: '3px',
                  background: 'var(--accent)',
                  borderRadius: '3px',
                }}></span>
              </h2>
              
              {/* Mobile - Write Review button */}
              {/* {isMobile && (
                <button
                  onClick={() => setActiveTab('form')}
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(106, 44, 176, 0.2)',
                  }}
                >
                  <i className="fas fa-pen"></i>
                </button>
              )} */}
              
              {!loading && totalReviews > 0 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  margin: isMobile ? '0.5rem auto 0' : '0', 
                }}>
                  {/* Average Rating Circle */}
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(26, 10, 42, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>
                      {averageRating}
                    </div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                      rating
                    </div>
                  </div>
                  
                  {/* Total Reviews Circle */}
                  <div style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(106, 44, 176, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>
                      {totalReviews}
                    </div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                      reviews
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 0',
                background: 'white',
                borderRadius: '16px',
                boxShadow: 'var(--box-shadow)',
              }}>
                <div style={{ 
                  fontSize: '2rem', 
                  color: 'var(--accent)', 
                  marginBottom: '1rem',
                  animation: 'pulse 1.5s infinite ease-in-out',
                }}>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '4rem 0',
                background: 'white',
                borderRadius: '16px',
                boxShadow: 'var(--box-shadow)',
              }}>
                <div style={{ 
                  fontSize: '3rem', 
                  color: 'var(--accent)', 
                  marginBottom: '1rem',
                  opacity: 0.5,
                }}>
                  <i className="fas fa-comment-dots"></i>
                </div>
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
            ) : (
              <div 
                className="reviews-list" 
                style={{
                  overflowY: 'auto',
                  flex: 1,
                  paddingRight: '10px',
                  marginBottom: '1rem',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--accent) rgba(0,0,0,0.1)',
                  maxHeight: isMobile ? '500px' : '650px',
                }}
              >
                {reviews.map(review => (
                  <div key={review.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: 'var(--box-shadow)',
                    padding: '2rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    border: '1px solid rgba(106, 44, 176, 0.1)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--box-shadow)';
                  }}
                  >
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          background: 'rgba(220, 53, 69, 0.1)',
                          border: 'none',
                          color: '#dc3545',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.3s, transform 0.3s',
                        }}
                        title="Delete review"
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '1rem',
                      alignItems: 'center',
                    }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: '1.2rem',
                        color: 'var(--primary)',
                        fontWeight: '600',
                      }}>
                        <i className="fas fa-user-circle" style={{ 
                          marginRight: '8px',
                          color: 'var(--accent)',
                          opacity: 0.7,
                        }}></i>
                        {review.name}
                      </h3>
                      <div style={{ 
                        display: 'flex',
                        background: 'rgba(106, 44, 176, 0.08)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                      }}>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p style={{ 
                      margin: '0 0 1rem', 
                      lineHeight: '1.6',
                      color: '#505050',
                      position: 'relative',
                      paddingLeft: '5px',
                      borderLeft: '2px solid rgba(106, 44, 176, 0.2)',
                      paddingLeft: '15px',
                    }}>
                      {review.text}
                    </p>
                    <div style={{ 
                      color: '#888', 
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <i className="far fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Admin Login Modal */}
      <AdminLoginModal />
    </div>
  )
}

export default Reviews 