import { useState, useEffect } from 'react'

// Mock API for development
const API_URL = 'http://localhost:5000/api'

const Reviews = () => {
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // In production, use actual API call
        // const response = await fetch(`${API_URL}/reviews`)
        // const data = await response.json()
        
        // Mock data for development
        const mockReviews = [
          {
            id: '1',
            name: 'John Doe',
            text: 'Vu gave me the best haircut I\'ve ever had! Highly recommend for anyone looking for a skilled barber who really takes the time to understand what you want.',
            rating: 5,
            createdAt: '2023-05-15T12:00:00Z'
          },
          {
            id: '2',
            name: 'Sarah Smith',
            text: 'Great experience at vupercuts. Vu is very skilled and friendly. The salon is clean and modern, and the service was top-notch. Will definitely be back!',
            rating: 5,
            createdAt: '2023-05-10T14:30:00Z'
          },
          {
            id: '3',
            name: 'Mike Johnson',
            text: 'Professional service and amazing results. I\'ve been to many barbers in the city, but Vu truly stands out with his attention to detail and precision.',
            rating: 4,
            createdAt: '2023-05-05T09:15:00Z'
          },
          {
            id: '4',
            name: 'Emily Chen',
            text: 'Absolutely love my new haircut! Vu listened carefully to what I wanted and delivered exactly that. The online booking system made scheduling so convenient.',
            rating: 5,
            createdAt: '2023-06-02T10:15:00Z'
          },
          {
            id: '5',
            name: 'David Wilson',
            text: 'Excellent service from start to finish. The shop has a great atmosphere, and Vu really knows his craft. Highly recommended!',
            rating: 5,
            createdAt: '2023-06-10T15:30:00Z'
          }
        ]
        
        setReviews(mockReviews)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError('Failed to load reviews. Please try again later.')
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

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

    try {
      // In production, use actual API call
      // const response = await fetch(`${API_URL}/reviews`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newReview),
      // })
      
      // const data = await response.json()
      
      // Mock successful submission
      const mockNewReview = {
        id: Date.now().toString(),
        ...newReview,
        createdAt: new Date().toISOString()
      }
      
      setReviews([mockNewReview, ...reviews])
      setSuccessMessage('Thank you for your review!')
      setNewReview({
        name: '',
        text: '',
        rating: 5
      })
      
    } catch (err) {
      console.error('Error submitting review:', err)
      setError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
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

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="container" style={{ 
        padding: '5rem 2rem 6rem',
        marginTop: '60px' // Add margin to push content below navbar
      }}>
        {successMessage && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1.2rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '3rem',
            textAlign: 'center',
          }}>
            {successMessage}
          </div>
        )}
        
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1.2rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '3rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '4rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Leave a Review Form */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: 'var(--box-shadow)',
            padding: '2.5rem',
            height: 'fit-content',
          }}>
            <h2 style={{ marginBottom: '2rem', color: 'var(--primary)', fontSize: '1.8rem' }}>Leave a Review</h2>
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
                    style={{ flex: 1, marginRight: '1rem' }}
                  />
                  <div style={{ display: 'flex' }}>
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
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-accent btn-block"
                disabled={submitting}
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
          
          {/* Reviews List */}
          <div>
            <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary)', fontSize: '1.8rem' }}>
              What Our Customers Say
            </h2>
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                  <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p>No reviews yet. Be the first to leave a review!</p>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map(review => (
                  <div key={review.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: 'var(--box-shadow)',
                    padding: '2rem',
                    marginBottom: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{review.name}</h3>
                      <div style={{ display: 'flex' }}>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p style={{ margin: '0 0 1rem', lineHeight: '1.6' }}>{review.text}</p>
                    <div style={{ color: '#888', fontSize: '0.9rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews 