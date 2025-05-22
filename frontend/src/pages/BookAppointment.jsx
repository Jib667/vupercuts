import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const BookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to load Square's booking widget script
  useEffect(() => {
    const loadSquareBookingWidget = () => {
      setLoading(true);
      try {
        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.sq-api.com/squa/booking/widget.js';
        script.async = true;
        script.onload = () => {
          setLoading(false);
          // Initialize Square booking widget once script is loaded
          if (window.SqBookingWidget) {
            const config = {
              // These would need to be replaced with actual Square account details
              merchantId: 'YOUR_SQUARE_MERCHANT_ID', 
              locationId: 'YOUR_SQUARE_LOCATION_ID',
              serviceId: 'YOUR_SQUARE_SERVICE_ID',
              version: 'v2',
              bookingOptions: {
                mode: "booking",
              },
              style: {
                '--btn-primary-color': 'var(--accent)',
                '--btn-hover-color': '#9e77d1',
                '--accent-color': 'var(--accent)',
                borderRadius: '28px',
                fontFamily: 'Poppins, sans-serif',
                padding: '20px'
              },
              buttonText: 'Book an Appointment'
            };
            
            window.SqBookingWidget.render(config);
          }
        };
        
        script.onerror = () => {
          setLoading(false);
          setError('Failed to load Square booking widget. Please try again later.');
        };
        
        document.body.appendChild(script);
        
        // Clean up
        return () => {
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
        };
      } catch (err) {
        setLoading(false);
        setError('An error occurred. Please try again later.');
      }
    };
    
    loadSquareBookingWidget();
  }, []);

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, rgba(106, 44, 176, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      minHeight: '100vh',
      paddingTop: '80px', // Add space for the navbar
      position: 'relative',
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.08) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '8%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.06) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}></div>

      <div className="container" style={{ 
        padding: '3rem 2rem 6rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '1.2rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
          padding: '2.5rem',
          border: '1px solid rgba(106, 44, 176, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative corner accent */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(106, 44, 176, 0.08) 0%, rgba(106, 44, 176, 0) 70%)',
            zIndex: 0,
          }}></div>
          
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 0',
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{ 
                fontSize: '2rem', 
                color: 'var(--accent)', 
                marginBottom: '1rem',
                animation: 'pulse 1.5s infinite ease-in-out',
              }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p style={{ color: '#555' }}>Loading booking system...</p>
            </div>
          ) : (
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ 
                marginBottom: '2rem', 
                color: 'var(--primary)', 
                fontSize: '1.8rem',
                textAlign: 'center',
                position: 'relative',
                paddingBottom: '10px',
                display: 'inline-block',
              }}>
                Schedule Your Appointment
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: 'var(--accent)',
                  borderRadius: '3px',
                }}></span>
              </h2>
              
              {/* Square booking widget will be injected here */}
              <div id="sq-booking-widget" style={{ 
                width: '100%', 
                minHeight: '500px',
                marginTop: '1rem',
              }}></div>
              
              <div style={{ 
                textAlign: 'center', 
                marginTop: '2.5rem',
                padding: '1.5rem',
                background: 'rgba(106, 44, 176, 0.05)',
                borderRadius: '12px',
              }}>
                <p style={{ 
                  marginBottom: '1rem', 
                  fontSize: '0.95rem', 
                  color: '#555',
                }}>
                  Having trouble? Contact us directly:
                </p>
                <p style={{ 
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                  <span style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: '0 4px 10px rgba(106, 44, 176, 0.3)',
                  }}>
                    <i className="fas fa-phone"></i>
                  </span>
                  <a href="tel:5719924149" style={{ 
                    color: 'var(--primary)', 
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--primary)'}
                  >
                    571-992-4149
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookAppointment 