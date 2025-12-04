import { fetchProducts, renderProducts, fixImagePath } from './productHelpers.js';
import { addToCart, updateCartBadge, getCart, showNotification } from './main.js';

// Global variables
let currentProduct = null;
let quantity = 1;

/**
 * Get product ID from URL parameters
 * @returns {string|null} Product ID
 */
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * Load product details
 * @param {string} productId - Product ID
 * @param {Array} products - All products array
 */
function loadProductDetails(productId, products) {
  currentProduct = products.find((product) => product.id === productId);

  if (!currentProduct) {
    // Product not found
    document.querySelector('.product-section__container').innerHTML =
      '<p style="text-align: center; padding: 100px 0;">Product not found</p>';
    return;
  }

  // Update product name
  document.getElementById('product-name').textContent = currentProduct.name;

  // Update product name in review title
  const reviewProductName = document.getElementById('review-product-name');
  if (reviewProductName) {
    reviewProductName.textContent = currentProduct.name;
  }

  // Update product rating
  renderRating(currentProduct.rating);

  // Update product price
  document.getElementById('product-price').textContent = `$${currentProduct.price.toFixed(2)}`;

  // Update product description
  document.getElementById('product-description').innerHTML =
    `<p>The new Global Explorer Max Comfort Suitcase Pro is a bold reimagining
     of travel essentials, designed to elevate every journey. Made with at least 30%
     recycled materials, its lightweight yet impact-resistant shell combines eco-
     conscious innovation with rugged durability.</p>

     <p></p>The ergonomic handle and GlideMotion spinner wheels ensure effortless
     mobility while making a statement in sleek design. Inside, the modular  
     compartments and adjustable straps keep your belongings secure and 
     neatly organized, no matter the destination.</p>`;

  // Update full description in tabs
  document.getElementById('product-full-description').innerHTML =
    `<p>Vestibulum commodo sapien non elit porttitor, vitae volutpat nibh mollis. Nulla porta risus id neque tempor, in efficitur justo imperdiet. Etiam a ex at 
     ante tincidunt imperdiet. Nunc congue ex vel nisl viverra, sit amet aliquet lectus ullamcorper. Praesent luctus lacus non lorem elementum, eu tristique 
     sapien suscipit. Sed bibendum, ipsum nec viverra malesuada, erat nisi sodales purus, eget hendrerit dui ligula eu enim. Ut non est nisi. Pellentesque 
     tristique pretium dolor eu commodo. Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti. 
     Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam.</p>

     <p>Proin iaculis nibh vitae lectus mollis bibendum. Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales 
     risus. Pellentesque viverra dui auctor, ullamcorper turpis pharetra, facilisis quam. Proin iaculis nibh vitae lectus mollis bibendum.</p>

     <p>Quisque varius eget urna sit amet luctus. Suspendisse potenti. Curabitur ac placerat est, sit amet sodales risus. Pellentesque viverra dui auctor, 
     ullamcorper turpis pharetra, facilisis quam.</p>`;

  // Update main image
  const mainImage = document.getElementById('main-product-image');
  const fixedImageUrl = fixImagePath(currentProduct.imageUrl, true);
  mainImage.src = fixedImageUrl;
  mainImage.alt = currentProduct.name;

  // Render thumbnails (using same image for demo)
  renderThumbnails(fixedImageUrl);

  // Populate size options
  populateSizeOptions(currentProduct.size);

  // Populate color options
  populateColorOptions(currentProduct.color);

  // Populate category option
  populateCategoryOption(currentProduct.category);
}

/**
 * Render product rating stars
 * @param {number} rating - Product rating (0-5)
 */
function renderRating(rating) {
  const ratingContainer = document.getElementById('product-rating');
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = '';

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star">★</span>';
  }

  if (hasHalfStar) {
    starsHTML += '<span class="star">★</span>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star" style="color: #ddd;">★</span>';
  }

  starsHTML += '<span class="rating-text">(1 Clients Review)</span>';

  ratingContainer.innerHTML = starsHTML;
}

/**
 * Render product thumbnails
 * @param {string} imageUrl - Product image URL
 */
function renderThumbnails(imageUrl) {
  const thumbnailsContainer = document.getElementById('product-thumbnails');
  // For demo, show 4 thumbnails with same image
  const thumbnailsHTML = Array(4)
    .fill(0)
    .map(
      (_, index) => `
    <button class="product-images__thumbnail ${index === 0 ? 'product-images__thumbnail--active' : ''}" data-index="${index}">
      <img src="${imageUrl}" alt="Product thumbnail ${index + 1}" />
    </button>
  `
    )
    .join('');

  thumbnailsContainer.innerHTML = thumbnailsHTML;

  // Add click event listeners to thumbnails
  thumbnailsContainer.querySelectorAll('.product-images__thumbnail').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      // Remove active class from all thumbnails
      thumbnailsContainer.querySelectorAll('.product-images__thumbnail').forEach((t) => {
        t.classList.remove('product-images__thumbnail--active');
      });
      // Add active class to clicked thumbnail
      thumb.classList.add('product-images__thumbnail--active');

      // Update main image (in real scenario, would use different images)
      document.getElementById('main-product-image').src = imageUrl;
    });
  });
}

/**
 * Populate size options
 * @param {string} size - Product size
 */
function populateSizeOptions(size) {
  const sizeSelect = document.getElementById('product-size');
  const sizes = size.includes(',') ? size.split(', ') : [size];

  const optionsHTML = sizes
    .map((s) => `<option value="${s}">${s}</option>`)
    .join('');

  sizeSelect.innerHTML = '<option value="">Choose option</option>' + optionsHTML;
  // Select first option by default
  if (sizes.length > 0) {
    sizeSelect.value = sizes[0];
  }
}

/**
 * Populate color options
 * @param {string} color - Product color
 */
function populateColorOptions(color) {
  const colorSelect = document.getElementById('product-color');
  const colors = color.includes(',') ? color.split(', ') : [color];

  const optionsHTML = colors
    .map((c) => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`)
    .join('');

  colorSelect.innerHTML = '<option value="">Choose option</option>' + optionsHTML;
  // Select first option by default
  if (colors.length > 0) {
    colorSelect.value = colors[0];
  }
}

/**
 * Populate category option
 * @param {string} category - Product category
 */
function populateCategoryOption(category) {
  const categorySelect = document.getElementById('product-category-select');

  // Capitalize category
  const displayCategory = category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  categorySelect.innerHTML = `
    <option value="">Choose option</option>
    <option value="${category}" selected>${displayCategory}</option>
  `;
}

/**
 * Initialize quantity selector
 */
function initQuantitySelector() {
  const decreaseBtn = document.getElementById('quantity-decrease');
  const increaseBtn = document.getElementById('quantity-increase');
  const quantityInput = document.getElementById('product-quantity');

  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityInput.value = quantity;
    }
  });

  increaseBtn.addEventListener('click', () => {
    quantity++;
    quantityInput.value = quantity;
  });
}

/**
 * Initialize Add to Cart functionality
 */
function initAddToCart() {
  const addToCartBtn = document.getElementById('add-to-cart-btn');

  addToCartBtn.addEventListener('click', () => {
    if (!currentProduct) return;

    // Get selected size and color
    const selectedSize = document.getElementById('product-size').value;
    const selectedColor = document.getElementById('product-color').value;

    // Get cart from localStorage or initialize empty cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product with same name, size, and color already in cart
    // Merge entries only if name, size, AND color match
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === currentProduct.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItemIndex !== -1) {
      // Update quantity if product with same name, size, color already in cart
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart (separate entry if only name matches)
      cart.push({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        imageUrl: currentProduct.imageUrl,
        size: selectedSize,
        color: selectedColor,
        quantity: quantity,
      });
    }

    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart counter in header
    updateCartCounter();

    // Show success notification
    showNotification('Product added to cart!');

    // Reset quantity to 1
    quantity = 1;
    document.getElementById('product-quantity').value = 1;
  });
}

/**
 * Update cart counter in header using imported function
 */
function updateCartCounter() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartBadge(totalItems);
}

/**
 * Initialize product tabs
 */
function initTabs() {
  const tabButtons = document.querySelectorAll('.product-tabs__btn');
  const tabPanels = document.querySelectorAll('.product-tabs__panel');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');

      // Remove active class from all buttons and panels
      tabButtons.forEach((btn) => btn.classList.remove('product-tabs__btn--active'));
      tabPanels.forEach((panel) => panel.classList.remove('product-tabs__panel--active'));

      // Add active class to clicked button and corresponding panel
      button.classList.add('product-tabs__btn--active');
      document.getElementById(`tab-${tabName}`).classList.add('product-tabs__panel--active');
    });
  });
}

/**
 * Initialize star rating selector
 */
function initStarRating() {
  const starRatingContainer = document.getElementById('star-rating');
  const ratingInput = document.getElementById('review-rating');

  if (!starRatingContainer || !ratingInput) return;

  const stars = starRatingContainer.querySelectorAll('.star-rating__star');

  stars.forEach((star) => {
    star.addEventListener('click', () => {
      const rating = star.getAttribute('data-rating');
      ratingInput.value = rating;

      // Update visual state of stars
      stars.forEach((s) => {
        const starRating = parseInt(s.getAttribute('data-rating'));
        if (starRating <= parseInt(rating)) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });

    // Hover effect
    star.addEventListener('mouseenter', () => {
      const rating = star.getAttribute('data-rating');
      stars.forEach((s) => {
        const starRating = parseInt(s.getAttribute('data-rating'));
        if (starRating <= parseInt(rating)) {
          s.style.color = '#f5b423';
        } else {
          s.style.color = '#ffffff';
        }
      });
    });
  });

  // Reset stars on mouse leave
  starRatingContainer.addEventListener('mouseleave', () => {
    const currentRating = ratingInput.value;
    stars.forEach((s) => {
      const starRating = parseInt(s.getAttribute('data-rating'));
      if (currentRating && starRating <= parseInt(currentRating)) {
        s.style.color = '#f5b423';
      } else {
        s.style.color = '#ffffff';
      }
    });
  });
}

/**
 * Initialize review form
 */
function initReviewForm() {
  const reviewForm = document.getElementById('review-form');

  if (!reviewForm) return;

  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('review-name').value;
    const email = document.getElementById('review-email').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;

    // Validate form
    if (!name || !email || !rating || !comment) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Simulate successful submission
    showMessage('Thank you for your review! It has been submitted successfully.', 'success');

    // Reset form
    reviewForm.reset();

    // Reset star rating
    const stars = document.querySelectorAll('.star-rating__star');
    stars.forEach((s) => {
      s.classList.remove('active');
      s.style.color = '#ffffff';
    });
  });
}

/**
 * Show form message
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(message, type) {
  const messageDiv = document.getElementById('review-message');
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;
  messageDiv.style.display = 'block';

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

/**
 * Load related products (You May Also Like)
 * @param {Array} allProducts - All products array
 */
function loadRelatedProducts(allProducts) {
  if (!currentProduct) return;

  // Get 4 random products from same category, excluding current product
  const relatedProducts = allProducts
    .filter((product) => product.id !== currentProduct.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  renderProducts(relatedProducts, 'related-products', {
    onAddToCart: addToCart,
    onCardClick: (productId) => {
      window.location.href = `product-details.html?id=${productId}`;
    },
    useRelativePath: true,
  });
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  const productId = getProductIdFromURL();

  if (!productId) {
    document.querySelector('.product-section__container').innerHTML =
      '<p style="text-align: center; padding: 100px 0;">No product specified</p>';
    return;
  }

  // Fetch all products
  const allProducts = await fetchProducts('../');

  // Load product details
  loadProductDetails(productId, allProducts);

  // Initialize functionality
  initQuantitySelector();
  initAddToCart();
  initTabs();
  initStarRating();
  initReviewForm();

  // Load related products
  loadRelatedProducts(allProducts);

  // Update cart counter on page load
  updateCartCounter();
});
