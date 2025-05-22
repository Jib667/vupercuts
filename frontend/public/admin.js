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
    
    try {
      // Get admin credentials - these should match what's in the backend
      const username = 'admin';
      const password = 'vupercuts2024';
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);
      
      // Make the DELETE request with cache busting
      const response = await fetch(`/api/reviews/${reviewId}?t=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        cache: 'no-store'
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok) {
        console.log('Review deleted successfully');
        // Reload the page to show the updated list, with cache busting
        window.location.href = window.location.pathname + '?nocache=' + Date.now();
      } else {
        console.error('Failed to delete review:', data.message || 'Unknown error');
        alert('Failed to delete review: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review: ' + error.message);
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