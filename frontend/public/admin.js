// Enhanced admin functionality for Vupercuts
// This script fixes the review deletion process

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin enhancement script loaded');
  
  // Check if we're on the reviews page
  if (window.location.pathname.includes('reviews')) {
    enhanceReviewDeletion();
    addClearAllButton();
  }
});

// Function to add a "Clear All Reviews" button for admin
function addClearAllButton() {
  // Create button container
  const container = document.createElement('div');
  container.style.margin = '20px 0';
  container.style.textAlign = 'center';
  
  // Create the button
  const button = document.createElement('button');
  button.textContent = 'EMERGENCY: Clear All Reviews';
  button.style.backgroundColor = '#ff3333';
  button.style.color = 'white';
  button.style.padding = '10px 20px';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  
  button.addEventListener('click', function() {
    if (confirm('WARNING: This will permanently delete ALL reviews. This cannot be undone. Continue?')) {
      nukeAllReviews();
    }
  });
  
  // Add button to container
  container.appendChild(button);
  
  // Find a good place to insert it (at the top of the reviews section)
  const reviewsSection = document.querySelector('.reviews-container') || document.querySelector('main');
  if (reviewsSection) {
    reviewsSection.prepend(container);
  }
}

// Function to clear all reviews (emergency use only)
async function nukeAllReviews() {
  try {
    // First try the nuke endpoint
    const response = await fetch('/api/nuke-reviews?t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    console.log('Nuke response:', await response.json());
    
    // Then reload with cache busting
    window.location.href = window.location.pathname + '?nocache=' + Date.now();
  } catch (error) {
    console.error('Failed to clear reviews:', error);
    alert('Failed to clear all reviews: ' + error.message);
  }
}

// Function to enhance review deletion
function enhanceReviewDeletion() {
  console.log('Enhancing review deletion functionality');
  
  // The correct way to delete a review
  window.deleteReview = async function(reviewId) {
    if (!reviewId) {
      console.error('No review ID provided');
      return;
    }
    
    console.log(`Attempting to delete review with ID: ${reviewId}`);
    
    // Show a loading message to prevent multiple clicks
    let loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Deleting review...';
    loadingMsg.style.position = 'fixed';
    loadingMsg.style.top = '10px';
    loadingMsg.style.right = '10px';
    loadingMsg.style.backgroundColor = '#ffcc00';
    loadingMsg.style.color = '#000';
    loadingMsg.style.padding = '10px';
    loadingMsg.style.borderRadius = '5px';
    loadingMsg.style.zIndex = '9999';
    document.body.appendChild(loadingMsg);
    
    // Get admin credentials
    const username = 'admin';
    const password = 'vupercuts2024';
    const authHeader = 'Basic ' + btoa(`${username}:${password}`);
    
    // Try up to 3 times to delete the review
    let deleteSuccess = false;
    let errorMessage = '';
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Delete attempt ${attempt} for review ID: ${reviewId}`);
        
        // Make the DELETE request with cache busting
        const response = await fetch(`/api/reviews/${reviewId}?t=${Date.now()}.${Math.random()}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store'
        });
        
        const data = await response.json();
        console.log(`Delete attempt ${attempt} response:`, data);
        
        if (response.ok) {
          console.log('Review deleted successfully');
          deleteSuccess = true;
          break;
        } else {
          errorMessage = data.error || data.message || 'Unknown error';
          console.error(`Attempt ${attempt} failed:`, errorMessage);
          
          // Wait 1 second before retrying
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error(`Attempt ${attempt} exception:`, error);
        errorMessage = error.message;
        
        // Wait 1 second before retrying
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Remove the loading message
    document.body.removeChild(loadingMsg);
    
    if (deleteSuccess) {
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.textContent = 'Review deleted successfully!';
      successMsg.style.position = 'fixed';
      successMsg.style.top = '10px';
      successMsg.style.right = '10px';
      successMsg.style.backgroundColor = '#4CAF50';
      successMsg.style.color = 'white';
      successMsg.style.padding = '10px';
      successMsg.style.borderRadius = '5px';
      successMsg.style.zIndex = '9999';
      document.body.appendChild(successMsg);
      
      // Remove the success message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMsg);
        
        // Reload the page to show the updated list, with cache busting
        window.location.href = window.location.pathname + '?nocache=' + Date.now() + '&r=' + Math.random();
      }, 3000);
    } else {
      // If all attempts failed, show error message
      alert('Failed to delete review after multiple attempts: ' + errorMessage);
      
      // Force reload anyway to try to get a clean state
      window.location.href = window.location.pathname + '?nocache=' + Date.now() + '&r=' + Math.random();
    }
  };
  
  // Check every second for delete buttons to enhance
  // This is needed because the buttons might be added dynamically
  setInterval(function() {
    const deleteButtons = document.querySelectorAll('[data-review-id]');
    
    deleteButtons.forEach(button => {
      // Skip already enhanced buttons
      if (button.dataset.enhanced === 'true') return;
      
      const reviewId = button.dataset.reviewId;
      if (!reviewId) return;
      
      // Replace the click handler
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (confirm('Are you sure you want to delete this review?')) {
          window.deleteReview(reviewId);
        }
        
        return false;
      });
      
      // Mark as enhanced
      button.dataset.enhanced = 'true';
      
      // Add visual indication that the button is enhanced
      button.style.position = 'relative';
      button.style.backgroundColor = '#ff5555';
      
      console.log(`Enhanced delete button for review ID: ${reviewId}`);
    });
  }, 1000);
} 