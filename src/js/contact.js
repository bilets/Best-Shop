/**
 * Contact Page JavaScript
 * Handles form validation and submission
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Show error message for a field
 * @param {string} fieldId - ID of the field
 * @param {string} message - Error message
 */
function showError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputElement = document.getElementById(fieldId);

  if (errorElement && inputElement) {
    errorElement.textContent = message;
    inputElement.classList.add('error');
  }
}

/**
 * Clear error message for a field
 * @param {string} fieldId - ID of the field
 */
function clearError(fieldId) {
  const errorElement = document.getElementById(`${fieldId}-error`);
  const inputElement = document.getElementById(fieldId);

  if (errorElement && inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
  }
}

/**
 * Clear all errors
 */
function clearAllErrors() {
  clearError('contact-name');
  clearError('contact-email');
  clearError('contact-topic');
  clearError('contact-message');
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  return emailRegex.test(email);
}

/**
 * Show form message
 * @param {string} message - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(message, type) {
  const messageDiv = document.getElementById('contact-form-message');
  messageDiv.textContent = message;
  messageDiv.className = `form-message ${type}`;

  // Hide message after 5 seconds
  setTimeout(() => {
    messageDiv.className = 'form-message';
  }, 5000);
}

/**
 * Initialize real-time validation
 */
function initRealtimeValidation() {
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const topicInput = document.getElementById('contact-topic');
  const messageInput = document.getElementById('contact-message');

  // Name validation
  nameInput?.addEventListener('input', () => {
    if (nameInput.value.trim()) {
      clearError('contact-name');
    }
  });

  // Email validation
  emailInput?.addEventListener('input', () => {
    const email = emailInput.value.trim();
    if (email && !validateEmail(email)) {
      showError('contact-email', 'Please enter a valid email address');
    } else if (email) {
      clearError('contact-email');
    }
  });

  // Topic validation
  topicInput?.addEventListener('input', () => {
    if (topicInput.value.trim()) {
      clearError('contact-topic');
    }
  });

  // Message validation
  messageInput?.addEventListener('input', () => {
    if (messageInput.value.trim()) {
      clearError('contact-message');
    }
  });
}

/**
 * Initialize contact form
 */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) return;

  // Initialize real-time validation
  initRealtimeValidation();

  // Handle form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearAllErrors();

    // Get form values
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const topic = document.getElementById('contact-topic').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    let isValid = true;

    // Validate name
    if (!name) {
      showError('contact-name', 'Name is required');
      isValid = false;
    }

    // Validate email
    if (!email) {
      showError('contact-email', 'Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('contact-email', 'Please enter a valid email address');
      isValid = false;
    }

    // Validate topic
    if (!topic) {
      showError('contact-topic', 'Topic is required');
      isValid = false;
    }

    // Validate message
    if (!message) {
      showError('contact-message', 'Message is required');
      isValid = false;
    }

    // If form is valid, show success message
    if (isValid) {
      showFormMessage(
        'Thank you for your message! We will contact you soon.',
        'success'
      );

      // Reset form
      contactForm.reset();
    } else {
      showFormMessage('Please fill in all required fields correctly.', 'error');
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initContactForm);
