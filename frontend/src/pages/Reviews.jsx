import { useState, useEffect, useRef } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import GooglePlacesService from '../services/GooglePlacesService'

// API URL - will be automatically set based on environment
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

const Reviews = () => {
  const { isAdmin, adminLogin, adminLogout, getAuthHeaders } = useAdmin()
  
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  
  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminLoginError, setAdminLoginError] = useState('')
  const [adminLoggingIn, setAdminLoggingIn] = useState(false)
  
  // Statistics
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  // Add a new state variable for the place URL where users can see all reviews
  const [placeUrl, setPlaceUrl] = useState('');

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
    fetchGoogleReviews()
  }, [])

  // Set default active tab based on device
  useEffect(() => {
    setActiveTab(isMobile ? 'reviews' : 'both');
  }, [isMobile]);

  const fetchGoogleReviews = async () => {
    setLoading(true)
    try {
      const data = await GooglePlacesService.getGoogleReviews()
      
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
      setPlaceUrl(data.placeUrl || '') // Store the place URL for "See more reviews" button
      setLoading(false)
    } catch (err) {
      console.error('Error fetching Google reviews:', err)
      setError('Failed to load reviews. Please try again later.')
      setLoading(false)
    }
  }

  const [activeTab, setActiveTab] = useState('reviews')
  
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
          </div>
        )}
        
        <div 
          className="reviews-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '4rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
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
                <p>No reviews yet.</p>
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
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '1rem',
                      alignItems: 'center',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {review.profile_photo_url ? (
                          <img 
                            src={review.profile_photo_url} 
                            alt={`${review.name}'s profile`} 
                            style={{ 
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              marginRight: '12px',
                              border: '2px solid rgba(106, 44, 176, 0.1)'
                            }}
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <i className="fas fa-user-circle" style={{ 
                            marginRight: '8px',
                            color: 'var(--accent)',
                            opacity: 0.7,
                            fontSize: '2rem'
                          }}></i>
                        )}
                        <h3 style={{ 
                          margin: 0, 
                          fontSize: '1.2rem',
                          color: 'var(--primary)',
                          fontWeight: '600',
                        }}>
                          {review.name}
                        </h3>
                      </div>
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
                      {review.relative_time_description || new Date(review.createdAt * 1000).toLocaleDateString()}
                    </div>
                    {/* Google logo indicator */}
                    {review.isGoogleReview && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: '#666'
                      }}>
                        <img 
                          src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                          alt="Google" 
                          style={{
                            height: '16px',
                            marginLeft: '4px',
                            opacity: 0.7
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* See More Reviews Button */}
                {reviews.length > 0 && totalReviews > reviews.length && placeUrl && (
                  <div style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '2rem',
                    marginBottom: '1rem'
                  }}>
                    <a 
                      href={placeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.8rem 1.5rem',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: '50px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(106, 44, 176, 0.2)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 15px rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(106, 44, 176, 0.2)';
                      }}
                    >
                      <i className="fas fa-external-link-alt" style={{ marginRight: '10px' }}></i>
                      See All {totalReviews} Reviews on Google
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AdminLoginModal />
    </div>
  );
};

export default Reviews 