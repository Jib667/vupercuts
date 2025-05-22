// Enhanced admin functionality for Vupercuts
// This script fixes the review deletion process

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin enhancement script loaded');
  
  // Check if we're on the reviews page
  if (window.location.pathname.includes('reviews')) {
    enhanceReviewDeletion();
  }
});

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
      
      // Make the DELETE request
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok) {
        console.log('Review deleted successfully');
        // Reload the page to show the updated list
        window.location.reload();
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
      
      console.log(`Enhanced delete button for review ID: ${reviewId}`);
    });
  }, 1000);
} 