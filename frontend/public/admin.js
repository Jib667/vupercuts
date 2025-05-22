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
  
  // Simple delete review function
  window.deleteReview = async function(reviewId) {
    if (!reviewId) {
      console.error('No review ID provided');
      return;
    }
    
    console.log(`Attempting to delete review with ID: ${reviewId}`);
    
    try {
      // Get admin credentials
      const username = 'admin';
      const password = 'vupercuts2024';
      const authHeader = 'Basic ' + btoa(`${username}:${password}`);
      
      // Make the DELETE request
      const response = await fetch(`/api/reviews/${reviewId}?t=${Date.now()}`, {
        method: 'DELETE',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      const data = await response.json();
      console.log('Delete response:', data);
      
      if (response.ok) {
        console.log('Review deleted successfully');
        alert('Review deleted successfully');
        // Reload the page to show the updated list
        window.location.reload();
      } else {
        console.error('Failed to delete review:', data.error || 'Unknown error');
        alert('Failed to delete review: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Error deleting review: ' + error.message);
    }
  };
  
  // Find delete buttons and enhance them
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
      
      console.log(`Enhanced delete button for review ID: ${reviewId}`);
    });
  }, 1000);
} 