/**
 * About Page JavaScript
 * Handles See All Models button navigation
 */

/**
 * Initialize About page
 */
function initAbout() {
  // Handle "See All Models" button click
  const seeAllModelsBtn = document.getElementById('see-all-models');

  if (seeAllModelsBtn) {
    seeAllModelsBtn.addEventListener('click', () => {
      // Navigate to catalog page
      window.location.href = 'catalog.html';
    });
  }

  // Handle "Get Offer Today" button click
  const getOfferBtn = document.querySelector('.offer-banner .btn');

  if (getOfferBtn) {
    getOfferBtn.addEventListener('click', () => {
      // Navigate to catalog page
      window.location.href = 'catalog.html';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAbout);
