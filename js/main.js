import { modalTemplate } from './modalTemplate.js';

/**
 * Main JavaScript Module
 * Contains shared functionality for all pages: partials loading, navigation, cart, and login modal
 */

/**
 * Load HTML Partials (Header, Footer & Modal)
 * Dynamically loads header and footer from partial files and initializes modal
 * @returns {Promise<void>}
 */
async function loadPartials() {
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');

  try {
    // Determine the correct path based on current page location
    const isInSubfolder = window.location.pathname.includes('/html/');
    const basePath = isInSubfolder ? '../html/partials/' : './html/partials/';

    // Load header
    if (headerContainer) {
      const headerResponse = await fetch(`${basePath}header.html`);
      let headerHTML = await headerResponse.text();

      // Fix image paths for subfolder pages
      if (isInSubfolder) {
        headerHTML = headerHTML.replace(/src="\.\/assets/g, 'src="../assets');
        headerHTML = headerHTML.replace(/href="\.\/html/g, 'href=".');
        headerHTML = headerHTML.replace(/href="index\.html"/g, 'href="../index.html"');
      }

      headerContainer.innerHTML = headerHTML;

      // Add loaded class for smooth fade-in
      requestAnimationFrame(() => {
        headerContainer.classList.add('loaded');
      });

      // Set active nav link
      setActiveNavLink();
    }

    // Load footer
    if (footerContainer) {
      const footerResponse = await fetch(`${basePath}footer.html`);
      let footerHTML = await footerResponse.text();

      // Fix image paths for subfolder pages
      if (isInSubfolder) {
        footerHTML = footerHTML.replace(/src="\.\/assets/g, 'src="../assets');
        footerHTML = footerHTML.replace(/href="\.\/html/g, 'href=".');
        footerHTML = footerHTML.replace(/href="index\.html"/g, 'href="../index.html"');
      }

      footerContainer.innerHTML = footerHTML;

      // Add loaded class for smooth fade-in
      requestAnimationFrame(() => {
        footerContainer.classList.add('loaded');
      });
    }

    // Load modal (from template file to avoid live-server injection issues)
    if (!document.getElementById('login-modal')) {
      document.body.insertAdjacentHTML('beforeend', modalTemplate);
    }

    // Re-initialize event listeners after partials are loaded
    initMobileMenu();
    initLoginModal();
    initCartIcon();
  } catch (error) {
    console.error('Error loading partials:', error);
  }
}

/**
 * Set active navigation link based on current page
 * Highlights the nav link that matches the current URL
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach((link) => {
    link.classList.remove('nav-link--active');
    const linkPage = link.getAttribute('href').split('/').pop();

    if (
      linkPage === currentPage ||
      (currentPage === 'index.html' &&
        link.getAttribute('data-page') === 'home')
    ) {
      link.classList.add('nav-link--active');
    }
  });
}

/**
 * Initialize mobile menu toggle
 * Handles hamburger menu click and closing on outside click
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header__nav');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__nav') && !e.target.closest('.hamburger')) {
      hamburger?.classList.remove('active');
      nav?.classList.remove('active');
    }
  });

  // Close mobile menu when clicking on a nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      nav?.classList.remove('active');
    });
  });
}

/**
 * Smooth scroll for anchor links
 * Enables smooth scrolling when clicking on internal page anchors
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });
});

/**
 * Update cart badge with item count
 * @param {number} count - Number of items in cart
 */
export function updateCartBadge(count) {
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart items
 */
export function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart items to localStorage and update badge
 * @param {Array} cart - Array of cart items to save
 */
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartBadge(totalItems);
}

/**
 * Add product to cart
 * Merges entries only if id, size, AND color match
 * Keeps separate entries if only id matches (different size/color)
 * @param {Object} product - Product object to add
 */
export function addToCart(product) {
  const cart = getCart();

  // Get size and color from product (use defaults if not specified)
  const productSize = product.size || '';
  const productColor = product.color || '';

  // Find existing item with same id, size, AND color
  const existingItem = cart.find(
    (item) =>
      item.id === product.id &&
      item.size === productSize &&
      item.color === productColor
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      size: productSize,
      color: productColor,
      quantity: 1,
    });
  }

  saveCart(cart);
  showNotification('Product added to cart!');
}

/**
 * Show notification message
 * Displays a toast notification that auto-dismisses after 3 seconds
 * @param {string} message - Message to display
 */
export function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color:  #b92770;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Initialize cart icon functionality
 * Handles navigation to cart page on click
 */
function initCartIcon() {
  const cartBtn = document.querySelector('.cart-btn');

  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      // Determine the correct path based on current page location
      const isInSubfolder = window.location.pathname.includes('/html/');
      const cartPath = isInSubfolder ? 'cart.html' : './html/cart.html';

      // Navigate to cart page
      window.location.href = cartPath;
    });
  }
}

/**
 * Initialize on page load
 * Loads partials and initializes cart badge
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Load header and footer partials
  await loadPartials();

  // Initialize cart badge
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  updateCartBadge(totalItems);
});

/**
 * Initialize Login Modal functionality
 * Handles modal open/close, form validation, and password toggle
 */
function initLoginModal() {
  const loginBtn = document.getElementById('login-btn');
  const modal = document.getElementById('login-modal');
  const overlay = modal?.querySelector('.modal__overlay');
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const passwordToggle = modal?.querySelector('.password-toggle');

  if (!modal || !loginBtn) {
    return;
  }

  // Email RegEx pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Open modal
  loginBtn?.addEventListener('click', () => {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  const closeModal = () => {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    loginForm?.reset();
    clearErrors();
  };

  overlay?.addEventListener('click', closeModal);

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeModal();
    }
  });

  // Password toggle
  const eyeIcon = passwordToggle?.querySelector('.eye-icon');
  const isInSubfolder = window.location.pathname.includes('/html/');

  // Set initial icon
  if (eyeIcon) {
    eyeIcon.src = isInSubfolder
      ? '../assets/images/header/open-eye.svg'
      : './assets/images/header/open-eye.svg';
  }

  passwordToggle?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Toggle icon between open and close eye
    if (eyeIcon) {
      const iconName = type === 'text' ? 'close-eye.svg' : 'open-eye.svg';
      eyeIcon.src = isInSubfolder
        ? `../assets/images/header/${iconName}`
        : `./assets/images/header/${iconName}`;
      eyeIcon.title = type === 'text' ? 'Hide password' : 'Show password';
    }
  });

  // Form validation
  function validateEmail(email) {
    return emailRegex.test(email);
  }

  function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    if (errorElement && inputElement) {
      errorElement.textContent = message;
      inputElement.classList.add('error');
    }
  }

  function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    if (errorElement && inputElement) {
      errorElement.textContent = '';
      inputElement.classList.remove('error');
    }
  }

  function clearErrors() {
    clearError('email');
    clearError('password');
  }

  // Real-time validation
  emailInput?.addEventListener('input', () => {
    if (emailInput.value && !validateEmail(emailInput.value)) {
      showError('email', 'Please enter a valid email address');
    } else {
      clearError('email');
    }
  });

  passwordInput?.addEventListener('input', () => {
    if (passwordInput.value) {
      clearError('password');
    }
  });

  // Form submit
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate email
    if (!emailInput.value) {
      showError('email', 'Email is required');
      isValid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!passwordInput.value) {
      showError('password', 'Password is required');
      isValid = false;
    }

    if (isValid) {
      // Simulate successful login
      showNotification('Login successful!');
      closeModal();
    }
  });
}

/**
 * Add CSS animations for notifications
 * Injects keyframe animations into document head
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
