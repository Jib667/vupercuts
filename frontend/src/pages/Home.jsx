import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Home = () => {
  // List of all available videos
  const allVideos = [
    '/videos/haircut-video1.mp4',
    '/videos/haircut-video2.mp4', 
    '/videos/haircut-video3.mp4',
    '/videos/haircut-video4.mp4',
    '/videos/haircut-video5.mp4',
    '/videos/haircut-video6.mp4',
    '/videos/haircut-video7.mp4'
  ];
  
  // For seamless looping, we duplicate the first few videos at the end
  const displayVideos = [...allVideos, ...allVideos.slice(0, 3)];
  
  // Animation duration (in seconds) - adjust to control scroll speed
  const animationDuration = 40;
  
  // Animation keyframes are created in a style tag in the component
  const keyframesStyle = `
    @keyframes scrollVideos {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-100% * ${allVideos.length} / ${displayVideos.length})); }
    }
  `;
  
  return (
    <div>
      <style>{keyframesStyle}</style>
      
      {/* Hero Section */}
      <div className="full-width">
        <section className="hero-section">
          {/* Video Background with continuous scrolling effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden'
          }}>
            {/* Continuously scrolling video container */}
            <div style={{
              display: 'flex',
              width: `calc(100% * ${displayVideos.length} / 3)`, // Width adjusted to show 3 videos at a time
              height: '100%',
              animation: `scrollVideos ${animationDuration}s linear infinite`
            }}>
              {/* Map all videos into the row */}
              {displayVideos.map((videoSrc, index) => (
                <div 
                  key={`video-${index}`}
                  style={{ 
                    flex: `0 0 calc(100% / ${displayVideos.length})`, // Each video takes equal portion
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  <video 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hero-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 10, 15, 0.7)', // Darker neutral overlay without blue tint
            zIndex: 1
          }}></div>
          <div className="hero-content container">
            <h1 style={{ 
              fontSize: '4.5rem',
              marginBottom: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'lowercase',
              color: 'white'
            }}>
              vupercuts
            </h1>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'normal',
              marginBottom: '1rem',
              opacity: 0.9,
              color: 'white'
            }}>
              Premium Haircuts by Vu Tran
            </h2>
            <p style={{
              fontSize: '1.1rem',
              marginBottom: '3rem',
              opacity: 0.8,
              color: 'white'
            }}>
              3741 Prosperity Avenue, Fairfax, VA 22031
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
            }}>
              <Link to="/book" className="btn btn-accent btn-large" style={{
                border: '2px solid white',
              }}>Book an Appointment</Link>
              <Link to="/reviews" className="btn btn-outline btn-large">See What Others Are Saying</Link>
            </div>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">About vupercuts</h2>
          <div className="about-section">
            <div className="about-image">
              <img src="/images/vu.jpeg" 
                   alt="Vu Tran" />
            </div>
            <div className="about-content">
              <p>
                Welcome to vupercuts, where quality meets style. Founded by Vu Tran, 
                my mission is to provide exceptional haircuts that make you look and feel your best.
              </p>
              <p>
                With years of experience and a passion for the craft, I deliver 
                precision cuts tailored to each individual's unique style and preferences.
                Want to look fresh? I got you. Want to look like a movie star? No problem. 
                A good haircut can transform everything.
              </p>
              <p className="mb-3">
                Book your appointment today and experience the vupercuts difference!
              </p>
              <Link to="/book" className="btn" style={{
                background: 'white',
                color: 'var(--accent)',
                fontWeight: 'bold',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                display: 'inline-block',
                width: 'auto'
              }}>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginTop: '3rem',
          }}>
            <div className="service-card">
              <img 
                src="/images/example.jpeg" 
                alt="Men's Haircut" 
                className="service-img"
              />
              <div className="service-content">
                <h3 className="service-title">Men's Haircuts</h3>
                <p className="mb-0">Precision cuts tailored to your style and face shape. Every cut includes a consultation to understand your preferences.</p>
              </div>
            </div>
            <div className="service-card">
              <img 
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Filmed Content" 
                className="service-img"
              />
              <div className="service-content">
                <h3 className="service-title">Filmed Content</h3>
                <p className="mb-0">Watch your transformation journey! Vu regularly posts before and after results on his social media channels, showcasing his artistry and clientele satisfaction.</p>
              </div>
            </div>
            <div className="service-card">
              <img 
                src="/images/example2.jpg" 
                alt="Light Trim" 
                className="service-img"
              />
              <div className="service-content">
                <h3 className="service-title">Light Trims</h3>
                <p className="mb-0">Need just a touch-up? Vu also specializes in light trims to maintain your current style and keep you looking fresh between full haircuts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="full-width">
        <div style={{
          background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #FCAF45)',
          padding: '5rem 0',
          color: 'white',
          textAlign: 'left',
        }}>
          <div className="container" style={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem'
          }}>
            {/* Left side - Text content */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '500px',
            }}>
              <h2 style={{ 
                fontSize: '2.5rem',
                marginBottom: '2rem',
                fontWeight: 'bold',
                color: 'white'
              }}>Follow Our Transformations</h2>
              
              <p style={{ 
                fontSize: '1.2rem',
                marginBottom: '2rem',
              }}>
                Check out Vu's latest haircut transformations on Instagram. Follow us for style inspiration and to see real results!
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '1rem' 
              }}>
                <a href="https://www.instagram.com/vupercuts/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn"
                  style={{
                    background: 'white',
                    color: '#833AB4', /* Instagram purple */
                    fontWeight: 'bold',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    borderRadius: '28px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}>
                  <i className="fab fa-instagram" style={{ marginRight: '10px' }}></i>
                  Instagram
                </a>
                
                <a href="https://www.tiktok.com/@vupercuts?_t=ZT-8wZOH4KPUlO&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn"
                  style={{
                    background: 'white',
                    color: '#000000', /* TikTok black */
                    fontWeight: 'bold',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    borderRadius: '28px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}>
                  <i className="fab fa-tiktok" style={{ marginRight: '10px' }}></i>
                  TikTok
                </a>
              </div>
            </div>
            
            {/* Right side - Phone mockup */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
              {/* Animated flowing decorative elements */}
              <style>
                {`
                  @keyframes flow1 {
                    0% { transform: rotate(0deg) scale(0.9); opacity: 0.7; }
                    50% { transform: rotate(180deg) scale(1.1); opacity: 0.9; }
                    100% { transform: rotate(360deg) scale(0.9); opacity: 0.7; }
                  }
                  @keyframes flow2 {
                    0% { transform: rotate(180deg) scale(1.1); opacity: 0.8; }
                    50% { transform: rotate(0deg) scale(0.95); opacity: 0.6; }
                    100% { transform: rotate(-180deg) scale(1.1); opacity: 0.8; }
                  }
                  @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 0.9; }
                    100% { transform: scale(0.95); opacity: 0.7; }
                  }
                `}
              </style>
              
              {/* Outer flowing circle */}
              <div style={{
                position: 'absolute',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2))',
                boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                animation: 'flow1 18s linear infinite',
                zIndex: 0,
                filter: 'blur(2px)',
              }} />
              
              {/* Middle flowing circle */}
              <div style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                background: 'linear-gradient(225deg, rgba(200,200,255,0.05), rgba(255,255,255,0.15))',
                boxShadow: '0 0 20px rgba(255,255,255,0.08)',
                animation: 'flow2 15s linear infinite',
                zIndex: 0,
                filter: 'blur(1.5px)',
              }} />
              
              {/* Inner glowing circle */}
              <div style={{
                position: 'absolute',
                width: '340px',
                height: '340px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                animation: 'pulse 5s ease-in-out infinite',
                zIndex: 0,
              }} />
              
              {/* Flowing arc top */}
              <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                borderTop: '4px solid rgba(255, 255, 255, 0.3)',
                borderLeft: '4px solid rgba(255, 255, 255, 0.2)',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid transparent',
                transform: 'rotate(-30deg)',
                animation: 'flow2 12s linear infinite',
                zIndex: 0,
                filter: 'blur(1px)',
              }} />
              
              {/* Flowing arc bottom */}
              <div style={{
                position: 'absolute',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                borderBottom: '3px solid rgba(255, 255, 255, 0.25)',
                borderRight: '3px solid rgba(255, 255, 255, 0.15)',
                borderTop: '3px solid transparent',
                borderLeft: '3px solid transparent',
                transform: 'rotate(20deg)',
                animation: 'flow1 10s linear infinite',
                zIndex: 0,
                filter: 'blur(1px)',
              }} />
              
              {/* Phone Mockup */}
              <div style={{
                width: '250px',
                height: '500px',
                background: 'linear-gradient(45deg, #222, #333)',
                borderRadius: '24px',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                padding: '0',
                border: '4px solid #222',
                overflow: 'hidden',
                zIndex: 1
              }}>
                {/* Phone Screen - image displayed as content */}
                <img 
                  src="/images/phone.jpg"
                  alt="Instagram Reels" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '20px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 