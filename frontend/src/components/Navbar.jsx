import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on a page that should always have a dark navbar
  const alwaysDarkNavbar = location.pathname === '/reviews' || location.pathname === '/book';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Add or remove the menu-open class to the body when menu state changes
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('menu-open');
      // Re-enable scrolling when menu is closed
      document.body.style.overflow = '';
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile menu component - separate from the main navbar
  const MobileMenu = () => {
    if (!mobileMenuOpen) return null;
    
    return (
      <>
        {/* Overlay */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1500,
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Sidebar Menu */}
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
            background: '#1A0A2A',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.3)',
            borderRight: '1px solid rgba(106, 44, 176, 0.3)',
            padding: '80px 20px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            minWidth: '200px',
            zIndex: 2000,
          }}
        >
          <Link to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              fontSize: '1.3rem',
              textDecoration: 'none',
              padding: '8px 0',
              borderBottom: '1px solid rgba(106, 44, 176, 0.4)'
            }}>
            Home
          </Link>
          <Link to="/book" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              fontSize: '1.3rem',
              textDecoration: 'none',
              padding: '8px 0',
              borderBottom: '1px solid rgba(106, 44, 176, 0.4)'
            }}>
            Book Appointment
          </Link>
          <Link to="/reviews" 
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: 'white',
              fontSize: '1.3rem',
              textDecoration: 'none',
              padding: '8px 0',
              borderBottom: '1px solid rgba(106, 44, 176, 0.4)'
            }}>
            Reviews
          </Link>
        </div>
      </>
    );
  };

  return (
    <>
      <nav style={{
        background: scrolled || alwaysDarkNavbar ? 'rgba(26, 10, 42, 0.85)' : 'transparent',
        backdropFilter: scrolled || alwaysDarkNavbar ? 'blur(var(--frost-blur))' : 'none',
        WebkitBackdropFilter: scrolled || alwaysDarkNavbar ? 'blur(var(--frost-blur))' : 'none',
        color: 'var(--light)',
        padding: scrolled ? '0.8rem 0' : '1.2rem 0',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: scrolled || alwaysDarkNavbar ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
        transition: 'all 0.4s ease',
        width: '100%',
        display: 'block',
        borderTop: 'none'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '1rem' 
          }}>
            {/* Mobile menu button - white bars, purple background when navbar is scrolled */}
            <button 
              onClick={toggleMobileMenu}
              style={{
                width: '40px',
                height: '40px',
                background: scrolled || alwaysDarkNavbar ? '#1A0A2A' : 'transparent',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px',
                zIndex: 1100,
                cursor: 'pointer',
                borderRadius: '8px',
              }}
            >
              <span style={{
                display: 'block',
                height: '3px',
                width: '100%',
                background: 'white',
                borderRadius: '3px',
                margin: '2px 0',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></span>
              <span style={{
                display: 'block',
                height: '3px',
                width: '100%',
                background: 'white',
                borderRadius: '3px',
                margin: '2px 0',
                transition: 'all 0.3s ease',
                opacity: mobileMenuOpen ? 0 : 1
              }}></span>
              <span style={{
                display: 'block',
                height: '3px',
                width: '100%',
                background: 'white',
                borderRadius: '3px',
                margin: '2px 0',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}></span>
            </button>

            {/* Logo - moved to the left */}
            <Link to="/" style={{
              color: 'var(--light)',
              textDecoration: 'none',
              fontSize: '1.8rem',
              fontWeight: '600',
              letterSpacing: '1px',
              transition: 'transform 0.3s ease',
              transform: scrolled ? 'scale(0.9)' : 'scale(1)',
            }}>
              vupercuts
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="desktop-menu" style={{
            display: 'flex',
            gap: '3rem',
          }}>
            <Link to="/" 
              className="nav-link"
              style={{
                color: 'var(--light)',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                padding: '0.5rem 0',
                opacity: 0.9,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              Home
            </Link>
            <Link to="/book" 
              className="nav-link"
              style={{
                color: 'var(--light)',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                padding: '0.5rem 0',
                opacity: 0.9,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              Book Appointment
            </Link>
            <Link to="/reviews" 
              className="nav-link"
              style={{
                color: 'var(--light)',
                textDecoration: 'none',
                fontWeight: 500,
                position: 'relative',
                padding: '0.5rem 0',
                opacity: 0.9,
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
            >
              Reviews
            </Link>
          </div>
        </div>
      </nav>

      {/* Render mobile menu as a separate component */}
      <MobileMenu />
    </>
  )
}

export default Navbar 