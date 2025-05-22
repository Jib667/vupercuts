import { useState } from 'react'
import { Link } from 'react-router-dom'

const BookAppointment = () => {
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const totalSteps = 3;

  // Square booking link URLs
  const HAIRCUT_URL = "https://book.squareup.com/appointments/to4x9g2oevrmfg/location/LXQAMDVMH7JTS/services/E3EUQQTQ2CTOMEEFFH2MOSLY";
  const HAIRCUT_BEARD_URL = "https://book.squareup.com/appointments/to4x9g2oevrmfg/location/LXQAMDVMH7JTS/services/7JU7YJFX7O4C6HS6O3VPMN5Y";

  const getBookingUrl = () => {
    return selectedService === 'haircut' ? HAIRCUT_URL : HAIRCUT_BEARD_URL;
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Select haircut service and proceed
  const selectHaircut = () => {
    setSelectedService('haircut');
    nextStep();
  };

  // Select haircut + beard service and proceed
  const selectHaircutBeard = () => {
    setSelectedService('haircut_beard');
    nextStep();
  };

  // Booking directly to Square
  const bookNow = () => {
    window.location.href = getBookingUrl();
  };

  // Open booking page in new tab
  const openInNewTab = () => {
    window.open(getBookingUrl(), '_blank');
  };

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, rgba(106, 44, 176, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '80px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '180px', 
        height: '180px', 
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.08) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '8%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(106, 44, 176, 0.06) 0%, rgba(106, 44, 176, 0) 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }}></div>

      <div className="container" style={{ 
        padding: '2rem', 
        position: 'relative',
        zIndex: 1,
        maxWidth: '900px',
        margin: '0 auto',
        height: '100%',
      }}>
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '0.8rem',
            borderRadius: 'var(--border-radius)',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}
        
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          border: '1px solid rgba(106, 44, 176, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative accent line at top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '150px',
            height: '4px',
            background: 'var(--accent)',
            borderBottomLeftRadius: '4px',
            borderBottomRightRadius: '4px',
          }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ 
              marginBottom: '1.5rem',
              color: 'var(--primary)', 
              fontSize: '1.8rem',
              textAlign: 'center',
              position: 'relative',
              fontWeight: '600',
            }}>
              Schedule Your Appointment
            </h2>
            
            {/* Progress Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}>
              {[...Array(totalSteps)].map((_, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: currentStep > index ? 'var(--accent)' : currentStep === index + 1 ? 'rgba(106, 44, 176, 0.8)' : 'rgba(106, 44, 176, 0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    boxShadow: currentStep === index + 1 ? '0 0 0 4px rgba(106, 44, 176, 0.1)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {index + 1}
                  </div>
                  {index < totalSteps - 1 && (
                    <div style={{
                      height: '2px',
                      width: '50px',
                      background: currentStep > index + 1 ? 'var(--accent)' : 'rgba(106, 44, 176, 0.2)',
                      margin: '0 5px',
                      transition: 'all 0.3s ease',
                    }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div style={{
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}>
                  <h3 style={{ 
                    fontSize: '1.3rem',
                    color: 'var(--primary)',
                    textAlign: 'center',
                    fontWeight: '600',
                    margin: '0 0 1rem',
                  }}>
                    Select Service Type
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                    {/* Service Option Cards */}
                    <div 
                      onClick={selectHaircut}
                      style={{
                        flex: '1 0 calc(50% - 1rem)',
                        minWidth: '200px',
                        maxWidth: '250px',
                        padding: '1.2rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid rgba(106, 44, 176, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(106, 44, 176, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.1)';
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(106, 44, 176, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.8rem',
                      }}>
                        <i className="fas fa-cut" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}></i>
                      </div>
                      <h4 style={{ 
                        margin: '0 0 0.5rem', 
                        fontSize: '1.1rem',
                        fontWeight: '600',
                      }}>
                        Regular Haircut
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem', 
                        color: '#666' 
                      }}>
                        Classic cut and style
                      </p>
                    </div>
                    
                    <div 
                      onClick={selectHaircutBeard}
                      style={{
                        flex: '1 0 calc(50% - 1rem)',
                        minWidth: '200px',
                        maxWidth: '250px',
                        padding: '1.2rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid rgba(106, 44, 176, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(106, 44, 176, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.1)';
                      }}
                    >
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(106, 44, 176, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.8rem',
                      }}>
                        <i className="fas fa-user-tie" style={{ fontSize: '1.2rem', color: 'var(--accent)' }}></i>
                      </div>
                      <h4 style={{ 
                        margin: '0 0 0.5rem', 
                        fontSize: '1.1rem',
                        fontWeight: '600',
                      }}>
                        Haircut + Beard
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.9rem', 
                        color: '#666' 
                      }}>
                        Complete grooming service
                      </p>
                    </div>
                  </div>
                  
                  <p style={{
                    textAlign: 'center',
                    margin: '1rem 0 0',
                    fontSize: '0.9rem',
                    color: '#888',
                  }}>
                    Click any option to continue
                  </p>
                </div>
              )}
              
              {/* Step 2: Booking Method */}
              {currentStep === 2 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}>
                  <h3 style={{ 
                    fontSize: '1.3rem',
                    color: 'var(--primary)',
                    textAlign: 'center',
                    fontWeight: '600',
                    margin: '0 0 1rem',
                  }}>
                    Preferred Time Frame
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}>
                    {/* Time frame options */}
                    <div 
                      onClick={nextStep}
                      style={{
                        flex: '1 0 calc(33% - 1rem)',
                        minWidth: '150px',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid rgba(106, 44, 176, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(106, 44, 176, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.1)';
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(106, 44, 176, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.8rem',
                      }}>
                        <i className="fas fa-sun" style={{ fontSize: '1.1rem', color: 'var(--accent)' }}></i>
                      </div>
                      <h4 style={{ 
                        margin: '0 0 0.3rem', 
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}>
                        Morning
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem', 
                        color: '#666' 
                      }}>
                        9am - 12pm
                      </p>
                    </div>
                    
                    <div 
                      onClick={nextStep}
                      style={{
                        flex: '1 0 calc(33% - 1rem)',
                        minWidth: '150px',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid rgba(106, 44, 176, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(106, 44, 176, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.1)';
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(106, 44, 176, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.8rem',
                      }}>
                        <i className="fas fa-cloud-sun" style={{ fontSize: '1.1rem', color: 'var(--accent)' }}></i>
                      </div>
                      <h4 style={{ 
                        margin: '0 0 0.3rem', 
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}>
                        Afternoon
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem', 
                        color: '#666' 
                      }}>
                        12pm - 5pm
                      </p>
                    </div>
                    
                    <div 
                      onClick={nextStep}
                      style={{
                        flex: '1 0 calc(33% - 1rem)',
                        minWidth: '150px',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid rgba(106, 44, 176, 0.1)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(106, 44, 176, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(106, 44, 176, 0.1)';
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(106, 44, 176, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.8rem',
                      }}>
                        <i className="fas fa-moon" style={{ fontSize: '1.1rem', color: 'var(--accent)' }}></i>
                      </div>
                      <h4 style={{ 
                        margin: '0 0 0.3rem', 
                        fontSize: '1rem',
                        fontWeight: '600',
                      }}>
                        Evening
                      </h4>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '0.8rem', 
                        color: '#666' 
                      }}>
                        5pm - 9pm
                      </p>
                    </div>
                  </div>
                  
                  <p style={{
                    textAlign: 'center',
                    margin: '1rem 0 0',
                    fontSize: '0.9rem',
                    color: '#888',
                  }}>
                    Click any option to continue
                  </p>
                </div>
              )}
              
              {/* Step 3: Confirmation and Contact */}
              {currentStep === 3 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}>
                  <h3 style={{ 
                    fontSize: '1.3rem',
                    color: 'var(--primary)',
                    textAlign: 'center',
                    fontWeight: '600',
                    margin: '0 0 1rem',
                  }}>
                    Complete Your Booking
                  </h3>
                  
                  <div style={{
                    background: 'rgba(106, 44, 176, 0.05)',
                    padding: '1.2rem',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                  }}>
                    <p style={{
                      fontSize: '0.95rem',
                      margin: '0 0 1rem',
                      textAlign: 'center',
                      color: '#555',
                    }}>
                      You'll be directed to our secure booking system for{' '}
                      <strong>{selectedService === 'haircut' ? 'Regular Haircut' : 'Haircut + Beard'}</strong>.
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                    }}>
                      <button
                        onClick={bookNow}
                        style={{
                          background: 'var(--accent)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.8rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxShadow: '0 4px 10px rgba(106, 44, 176, 0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 6px 15px rgba(106, 44, 176, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 10px rgba(106, 44, 176, 0.2)';
                        }}
                      >
                        <i className="fas fa-calendar-check"></i>
                        Book Now
                      </button>
                      
                      <button
                        onClick={openInNewTab}
                        style={{
                          background: 'white',
                          color: 'var(--primary)',
                          border: '1px solid rgba(106, 44, 176, 0.3)',
                          borderRadius: '8px',
                          padding: '0.8rem 1.5rem',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.background = 'rgba(106, 44, 176, 0.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.background = 'white';
                        }}
                      >
                        <i className="fas fa-external-link-alt"></i>
                        Open in New Tab
                      </button>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid rgba(106, 44, 176, 0.1)',
                  }}>
                    <p style={{
                      margin: '0 0 1rem',
                      fontSize: '0.95rem',
                      color: '#555',
                    }}>
                      Questions? Contact us:
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '2rem',
                      justifyContent: 'center',
                      flexWrap: 'wrap',
                    }}>
                      <a href="tel:5719924149" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--primary)';
                      }}>
                        <i className="fas fa-phone" style={{
                          color: 'white',
                          background: 'var(--accent)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                        }}></i>
                        571-992-4149
                      </a>
                      
                      <a href="mailto:vu@vupercuts.com" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--accent)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--primary)';
                      }}>
                        <i className="fas fa-envelope" style={{
                          color: 'white',
                          background: 'var(--accent)',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                        }}></i>
                        vu@vupercuts.com
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '2rem',
              }}>
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#666',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    <i className="fas fa-chevron-left"></i> Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < totalSteps && (
                  <button
                    onClick={nextStep}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent)',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(106, 44, 176, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                    }}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div style={{
              borderTop: '1px solid rgba(106, 44, 176, 0.1)',
              marginTop: '2rem',
              paddingTop: '1rem',
              textAlign: 'center',
              color: '#888',
              fontSize: '0.9rem',
            }}>
              <p style={{ margin: 0 }}>Vupercuts • Premium Haircuts by Vu Tran • Fairfax, VA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookAppointment 