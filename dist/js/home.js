import { addToCart } from './main.js';
import { fetchProducts, renderProducts } from './productHelpers.js';

/**
 * Home Page JavaScript
 * Handles category slider and product sections rendering
 */

/**
 * Initialize category slider functionality
 * Handles slide navigation, dots, and responsive behavior
 */
function initCategorySlider() {
  const slider = document.querySelector('.category-slider');
  if (!slider) return;

  const track = slider.querySelector('.category-slider__track');
  const slides = slider.querySelectorAll('.category-card');
  const prevBtn = slider.querySelector('.category-slider__btn--prev');
  const nextBtn = slider.querySelector('.category-slider__btn--next');
  const dotsContainer = slider.querySelector('.category-slider__dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow = 4;
  let slideWidth = 296; // $category-card-width
  let gap = 35; // $spacing-lg

  /**
   * Calculate slides to show based on screen width
   * Adjusts slider for responsive breakpoints
   */
  function calculateSlidesToShow() {
    const width = window.innerWidth;
    if (width < 768) {
      slidesToShow = 1;
    } else if (width < 1024) {
      slidesToShow = 2;
    } else if (width < 1440) {
      slidesToShow = 3;
    } else {
      slidesToShow = 4;
    }

    // Reset to first slide when changing screen size
    currentIndex = 0;
    updateSlider();
  }

  /**
   * Create navigation dots for slider
   * Generates dot buttons based on number of slides
   */
  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.max(0, slides.length - slidesToShow + 1);

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('category-slider__dot');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });

      dotsContainer.appendChild(dot);
    }
  }

  /**
   * Update slider position and UI state
   * Moves track and updates buttons/dots
   */
  function updateSlider() {
    const maxIndex = slides.length - slidesToShow;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    const offset = currentIndex * (slideWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update buttons state
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.category-slider__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  /**
   * Navigate to next slide
   */
  function nextSlide() {
    if (currentIndex < slides.length - slidesToShow) {
      currentIndex++;
      updateSlider();
    }
  }

  /**
   * Navigate to previous slide
   */
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }

  // Event listeners
  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);

  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calculateSlidesToShow();
      createDots();
    }, 250);
  });

  // Initialize
  calculateSlidesToShow();
  createDots();
  updateSlider();
}

/**
 * Load and render products on page load
 * Fetches products and initializes page components
 */
document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts('./');

  // Filter and render "Selected Products"
  const selectedProducts = products
    .filter((product) => product.blocks.includes('Selected Products'))
    .slice(0, 4);
  renderProducts(selectedProducts, 'selected-products', {
    onAddToCart: addToCart,
    onCardClick: (productId) => {
      window.location.href = `./html/product-details.html?id=${productId}`;
    },
  });

  // Filter and render "New Products Arrival"
  const newProducts = products
    .filter((product) => product.blocks.includes('New Products Arrival'))
    .slice(0, 4);
  renderProducts(newProducts, 'new-products', {
    onAddToCart: addToCart,
    onCardClick: (productId) => {
      window.location.href = `./html/product-details.html?id=${productId}`;
    },
  });

  // Initialize category slider
  initCategorySlider();
});
