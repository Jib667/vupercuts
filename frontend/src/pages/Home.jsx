import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const Home = () => {
  const [videosLoaded, setVideosLoaded] = useState(0);
  const [allVideosLoaded, setAllVideosLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);
  
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
  
  // Animation duration (in seconds)
  const desktopDuration = 35; // Slower for desktop
  const mobileDuration = 50;  // Much slower for mobile
  
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
    // Preload videos
    const preloadVideos = () => {
      displayVideos.forEach((src, index) => {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.muted = true;
        video.onloadeddata = () => {
          setVideosLoaded(prev => prev + 1);
        };
        
        // Add to DOM but hidden to force preloading
        video.style.display = 'none';
        document.body.appendChild(video);
        
        // Clean up
        return () => {
          document.body.removeChild(video);
        };
      });
    };
    
    preloadVideos();
    
    // Show videos when at least 3 are loaded
    const timer = setTimeout(() => {
      setShowPlaceholder(false);
    }, 1000); // Wait maximum 1 second before showing videos anyway
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (videosLoaded >= 3) {
      setShowPlaceholder(false);
    }
    if (videosLoaded === displayVideos.length) {
      setAllVideosLoaded(true);
    }
  }, [videosLoaded]);
  
  // Animation keyframes are created in a style tag in the component
  const keyframesStyle = `
    @keyframes scrollVideos {
      0% { transform: translateX(0); }
      100% { transform: translateX(calc(-${100 * allVideos.length / 3}%)); }
    }
    
    @keyframes scrollVideosMobile {
      0% { transform: translateX(0); }
      100% { transform: translateX(-${100 * allVideos.length}%); }
    }
    
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(106, 44, 176, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(106, 44, 176, 0); }
      100% { box-shadow: 0 0 0 0 rgba(106, 44, 176, 0); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .video-element {
      transition: opacity 0.5s ease-in-out;
    }
    
    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 3.5rem !important;
      }
      
      .hero-content h2 {
        font-size: 1.5rem !important;
      }
      
      .hero-content p {
        font-size: 0.9rem !important;
      }
      
      .hero-buttons {
        flex-direction: column;
        gap: 1rem !important;
      }
      
      .hero-button {
        width: 100%;
        padding: 0.8rem 1rem !important;
        font-size: 0.9rem !important;
      }
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
            {/* Placeholder while videos load */}
            {showPlaceholder && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1a0a2a 0%, #100a15 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px solid rgba(255,255,255,0.2)',
                  borderTop: '3px solid var(--accent)',
                  animation: 'spin 1s linear infinite'
                }}></div>
              </div>
            )}
            
            {/* Desktop video carousel - shows 3 videos at once */}
            {!isMobile && (
              <div 
                className="desktop-videos"
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  opacity: showPlaceholder ? 0 : 1,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: `${displayVideos.length * (100/3)}%`, // Each video takes up 1/3 of the screen
                    height: '100%',
                    animation: `scrollVideos ${desktopDuration}s linear infinite`,
                    willChange: 'transform',
                  }}
                >
                  {displayVideos.map((videoSrc, index) => (
                    <div 
                      key={`desktop-video-${index}`}
                      style={{ 
                        width: `${300 / displayVideos.length}%`, // Divide into equal segments
                        height: '100%',
                      }}
                    >
                      <video 
                        ref={el => videoRefs.current[index] = el}
                        className="video-element"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        preload="auto"
                      >
                        <source src={videoSrc} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Mobile video carousel - shows 1 video at a time */}
            {isMobile && (
              <div 
                className="mobile-videos"
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  opacity: showPlaceholder ? 0 : 1,
                  transition: 'opacity 0.5s ease-in-out',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: `${allVideos.length * 100}%`, // All videos in a row
                    height: '100%',
                    animation: `scrollVideosMobile ${mobileDuration}s linear infinite`,
                    willChange: 'transform',
                  }}
                >
                  {allVideos.map((videoSrc, index) => (
                    <div 
                      key={`mobile-video-${index}`}
                      style={{ 
                        width: `${100 / allVideos.length}%`, // Each video takes full width
                        height: '100%',
                      }}
                    >
                      <video 
                        className="video-element"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        preload="auto"
                      >
                        <source src={videoSrc} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="hero-overlay" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26, 10, 42, 0.85) 0%, rgba(10, 10, 15, 0.75) 100%)', // Purple gradient overlay
            zIndex: 1
          }}></div>
          
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '15%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(106, 44, 176, 0.2) 0%, rgba(106, 44, 176, 0) 70%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(106, 44, 176, 0.15) 0%, rgba(106, 44, 176, 0) 70%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}></div>
          
          <div className="hero-content container">
            <h1 style={{ 
              fontSize: '4.5rem',
              marginBottom: '1.2rem',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'lowercase',
              color: 'white',
              position: 'relative',
              display: 'inline-block',
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
              color: 'white',
              position: 'relative',
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(106, 44, 176, 0.2)',
              borderRadius: '30px',
            }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: 'var(--accent)' }}></i>
              3741 Prosperity Avenue, Fairfax, VA 22031
            </p>
            <div className="hero-buttons" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
            }}>
              <Link to="/book" className="btn btn-accent btn-large hero-button" style={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: 'var(--accent)',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
              }}>
                <i className="fas fa-calendar-check" style={{ marginRight: '10px' }}></i>
                {isMobile ? 'Book' : 'Book an Appointment'}
              </Link>
              <Link to="/reviews" className="btn btn-outline btn-large hero-button" style={{
                border: '2px solid rgba(255, 255, 255, 0.7)',
                background: 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}>
                <i className="fas fa-star" style={{ marginRight: '10px', color: 'var(--accent)' }}></i>
                {isMobile ? 'Reviews' : 'See What Others Are Saying'}
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section className="section" style={{
        background: 'linear-gradient(180deg, rgba(106, 44, 176, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
        position: 'relative',
      }}>
        {/* Decorative accent */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106, 44, 176, 0.08) 0%, rgba(106, 44, 176, 0) 70%)',
          zIndex: 0,
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106, 44, 176, 0.07) 0%, rgba(106, 44, 176, 0) 70%)',
          zIndex: 0,
        }}></div>
        
        <div className="container">
          <h2 className="section-title" style={{
            marginBottom: '2.5rem',
          }}>
            About vupercuts
          </h2>
          
          <div className="about-section">
            <div className="about-image" style={{
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                width: '80%',
                height: '80%',
                background: 'var(--accent)',
                opacity: 0.1,
                zIndex: 0,
                borderRadius: '10px',
              }}></div>
              <img src="/images/vu.jpeg" 
                   alt="Vu Tran" 
                   style={{
                     borderRadius: '10px',
                     boxShadow: '0 15px 30px rgba(0, 0, 0, 0.15)',
                     border: '1px solid rgba(106, 44, 176, 0.2)',
                     position: 'relative',
                     zIndex: 1,
                     transition: 'transform 0.3s ease',
                   }}
                   onMouseEnter={(e) => {
                     e.target.style.transform = 'translateY(-7px) scale(1.02)';
                   }}
                   onMouseLeave={(e) => {
                     e.target.style.transform = 'translateY(0) scale(1)';
                   }}
              />
            </div>
            <div className="about-content">
              <p style={{ 
                borderLeft: '3px solid var(--accent)', 
                paddingLeft: '15px',
                fontSize: '1.05rem',
                color: '#333',
              }}>
                Welcome to vupercuts, where quality meets style. Founded by Vu Tran, 
                my mission is to provide exceptional haircuts that make you look and feel your best.
              </p>
              <p style={{ 
                borderLeft: '3px solid var(--accent)', 
                paddingLeft: '15px',
                fontSize: '1.05rem', 
                color: '#333' 
              }}>
                With years of experience and a passion for the craft, I deliver 
                precision cuts tailored to each individual's unique style and preferences.
                Want to look fresh? I got you. Want to look like a movie star? No problem. 
                A good haircut can transform everything.
              </p>
              <p className="mb-3" style={{ 
                borderLeft: '3px solid var(--accent)', 
                paddingLeft: '15px',
                fontSize: '1.05rem', 
                color: '#333' 
              }}>
                Book your appointment today and experience the vupercuts difference!
              </p>
              <Link to="/book" className="btn" style={{
                background: 'var(--accent)',
                color: 'white',
                fontWeight: 'bold',
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                boxShadow: '0 8px 15px rgba(106, 44, 176, 0.2)',
                transition: 'all 0.3s ease',
                borderRadius: '30px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 20px rgba(106, 44, 176, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(106, 44, 176, 0.2)';
              }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '10px' }}></i>
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section services-section" style={{
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative accent */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106, 44, 176, 0.05) 0%, rgba(106, 44, 176, 0) 70%)',
          zIndex: 0,
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(106, 44, 176, 0.06) 0%, rgba(106, 44, 176, 0) 70%)',
          zIndex: 0,
        }}></div>
        
        <div className="container">
          <h2 className="section-title" style={{
            marginBottom: '2.5rem',
          }}>
            Our Services
          </h2>
          
          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2.5rem',
            marginTop: '3rem',
          }}>
            <div className="service-card" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(106, 44, 176, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: 'var(--accent)',
                  color: 'white',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  zIndex: 1,
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }}>
                  Popular
                </div>
                <img 
                  src="/images/example.jpeg" 
                  alt="Men's Haircut" 
                  className="service-img"
                  style={{
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
              </div>
              <div className="service-content" style={{
                padding: '1.5rem',
                background: 'white',
              }}>
                <h3 className="service-title" style={{
                  color: 'var(--primary)',
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  position: 'relative',
                  paddingBottom: '10px',
                }}>
                  Men's Haircuts
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'var(--accent)',
                    borderRadius: '3px',
                  }}></span>
                </h3>
                <p className="mb-0" style={{ color: '#555' }}>Precision cuts tailored to your style and face shape. Every cut includes a consultation to understand your preferences.</p>
              </div>
            </div>
            
            <div className="service-card" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(106, 44, 176, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}>
              <img 
                src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                alt="Filmed Content" 
                className="service-img"
                style={{
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div className="service-content" style={{
                padding: '1.5rem',
                background: 'white',
              }}>
                <h3 className="service-title" style={{
                  color: 'var(--primary)',
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  position: 'relative',
                  paddingBottom: '10px',
                }}>
                  Filmed Content
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'var(--accent)',
                    borderRadius: '3px',
                  }}></span>
                </h3>
                <p className="mb-0" style={{ color: '#555' }}>Watch your transformation journey! Vu regularly posts before and after results on his social media channels, showcasing his artistry and clientele satisfaction.</p>
              </div>
            </div>
            
            <div className="service-card" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(106, 44, 176, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            }}>
              <img 
                src="/images/example2.jpg" 
                alt="Light Trim" 
                className="service-img"
                style={{
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              />
              <div className="service-content" style={{
                padding: '1.5rem',
                background: 'white',
              }}>
                <h3 className="service-title" style={{
                  color: 'var(--primary)',
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  position: 'relative',
                  paddingBottom: '10px',
                }}>
                  Light Trims
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '40px',
                    height: '3px',
                    background: 'var(--accent)',
                    borderRadius: '3px',
                  }}></span>
                </h3>
                <p className="mb-0" style={{ color: '#555' }}>Need just a touch-up? Vu also specializes in light trims to maintain your current style and keep you looking fresh between full haircuts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="full-width">
        <div style={{
          background: 'linear-gradient(45deg, #6A2CB0, #833AB4, #C13584)',
          padding: '5rem 0',
          color: 'white',
          textAlign: 'left',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
            zIndex: 0,
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '8%',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
            zIndex: 0,
          }}></div>
          
          <div className="container" style={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* Left side - Text content */}
            <div style={{
              flex: '1',
              minWidth: '300px',
              maxWidth: '500px',
            }}>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'white',
                marginBottom: '1.5rem',
                borderRadius: '2px',
              }}></div>
              
              <h2 style={{ 
                fontSize: '2.5rem',
                marginBottom: '2rem',
                fontWeight: 'bold',
                color: 'white',
                position: 'relative',
                paddingBottom: '15px',
              }}>
                Follow Our Transformations
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '70px',
                  height: '3px',
                  background: 'white',
                  borderRadius: '3px',
                }}></span>
              </h2>
              
              <p style={{ 
                fontSize: '1.2rem',
                marginBottom: '2rem',
                lineHeight: '1.7',
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
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
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
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
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
                zIndex: 1,
                animation: 'float 6s ease-in-out infinite',
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