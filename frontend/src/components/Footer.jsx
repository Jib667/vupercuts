const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{
      background: '#1A0A2A',
      color: 'white',
      padding: '5rem 0 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '2rem' }}>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '1.5rem',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'lowercase',
            color: 'white'
          }}>
            vupercuts
          </h3>
          <p style={{ marginBottom: '1.5rem', maxWidth: '300px', opacity: '0.9', color: 'white' }}>
            Quality haircuts by Vu Tran. We provide exceptional service to help you look your best.
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1.5rem',
          }}>
            <a href="https://www.instagram.com/vupercuts/" target="_blank" rel="noopener noreferrer" style={{ 
              color: 'var(--light)', 
              fontSize: '1.5rem',
              opacity: 0.8,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@vupercuts?_t=ZT-8wZOH4KPUlO&_r=1" target="_blank" rel="noopener noreferrer" style={{ 
              color: 'var(--light)', 
              fontSize: '1.5rem',
              opacity: 0.8,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.8';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <i className="fab fa-tiktok"></i>
            </a>
          </div>
        </div>
        
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: '0.9', color: 'white' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/" style={{ 
                color: 'var(--light)', 
                textDecoration: 'none',
                opacity: '0.8',
                transition: 'opacity 0.3s ease, padding-left 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.paddingLeft = '5px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.paddingLeft = '0px';
              }}>Home</a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/book" style={{ 
                color: 'var(--light)', 
                textDecoration: 'none',
                opacity: '0.8',
                transition: 'opacity 0.3s ease, padding-left 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.paddingLeft = '5px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.paddingLeft = '0px';
              }}>Book Appointment</a>
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <a href="/reviews" style={{ 
                color: 'var(--light)', 
                textDecoration: 'none',
                opacity: '0.8',
                transition: 'opacity 0.3s ease, padding-left 0.3s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.paddingLeft = '5px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.8';
                e.currentTarget.style.paddingLeft = '0px';
              }}>Reviews</a>
            </li>
          </ul>
        </div>
        
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: '0.9', color: 'white' }}>Contact</h4>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '10px' }}></i>
            3741 Prosperity Avenue
          </p>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '10px', opacity: 0 }}></i>
            Fairfax, VA 22031
          </p>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>
            <i className="fas fa-phone" style={{ marginRight: '10px' }}></i>
            571-992-4149
          </p>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>
            <i className="fas fa-envelope" style={{ marginRight: '10px' }}></i>
            Vut2007rf@gmail.com
          </p>
        </div>
        
        <div style={{ flex: '1', minWidth: '250px', marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', opacity: '0.9', color: 'white' }}>Hours</h4>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>Monday - Friday: 3pm - 9pm*</p>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>Saturday - Sunday: 10am - 9pm*</p>
          <p style={{ marginBottom: '1rem', opacity: '0.8', color: 'white' }}>*By appointment only</p>
        </div>
      </div>
      
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '2rem',
        paddingTop: '2rem',
        textAlign: 'center',
        width: '100%',
        maxWidth: '1400px',
        margin: '2rem auto 0',
        padding: '2rem 2rem 0',
      }}>
        <p style={{ opacity: '0.7', color: 'white' }}>&copy; {currentYear} vupercuts. All rights reserved. Website created by Jibran Hutchins</p>
      </div>
    </footer>
  )
}

export default Footer 