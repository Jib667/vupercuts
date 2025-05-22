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
                '--btn-primary-color': '#2A75E0',
                '--btn-hover-color': '#60A3F5',
                '--accent-color': '#FF6B4A',
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
    <div>
      {/* Page Header */}
      <div className="full-width" style={{
        background: 'var(--primary)',
        padding: '8rem 0 4rem',
        marginBottom: '4rem',
      }}>
        <div className="container">
          <h1 style={{ 
            color: 'white', 
            fontSize: '3rem', 
            textAlign: 'center',
            marginBottom: '1.5rem',
            textTransform: 'lowercase',
            letterSpacing: '1px'
          }}>
            book an appointment
          </h1>
          <p style={{ 
            color: 'white', 
            textAlign: 'center', 
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.9,
            fontSize: '1.1rem'
          }}>
            Choose a date and time that works for you
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 2rem 6rem' }}>
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
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: 'var(--box-shadow)',
          padding: '2rem',
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '1rem' }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading booking system...</p>
            </div>
          ) : (
            <>
              <h2 style={{ 
                marginBottom: '2rem', 
                color: 'var(--primary)', 
                fontSize: '1.8rem',
                textAlign: 'center' 
              }}>
                Schedule Your Appointment
              </h2>
              
              {/* Square booking widget will be injected here */}
              <div id="sq-booking-widget" style={{ width: '100%', minHeight: '500px' }}></div>
              
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: '0.7' }}>
                  Having trouble? Contact us directly:
                </p>
                <p style={{ fontSize: '1.1rem' }}>
                  <i className="fas fa-phone" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>
                  <a href="tel:5719924149" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                    571-992-4149
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookAppointment 