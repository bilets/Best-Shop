/**
 * Cart Page JavaScript
 * Handles cart display, item management, and checkout
 */

import { fixImagePath } from './productHelpers.js';
import { getCart, saveCart } from './main.js';

const SHIPPING_COST = 30;
const DISCOUNT_THRESHOLD = 3000;
const DISCOUNT_RATE = 0.1;

/**
 * Render cart items in table
 */
function renderCartItems() {
  const cartItems = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTableWrapper = document.getElementById('cart-table-wrapper');
  const cartEmpty = document.getElementById('cart-empty');
  const cartActions = document.getElementById('cart-actions');
  const cartSummary = document.getElementById('cart-summary');

  if (!cartItemsContainer) return;

  // If cart is empty
  if (cartItems.length === 0) {
    cartTableWrapper.style.display = 'none';
    cartActions.style.display = 'none';
    cartSummary.style.display = 'none';
    cartEmpty.style.display = 'block';
    return;
  }

  // Show cart content
  cartTableWrapper.style.display = 'block';
  cartActions.style.display = 'flex';
  cartSummary.style.display = 'block';
  cartEmpty.style.display = 'none';

  // Render each cart item
  cartItemsContainer.innerHTML = cartItems
    .map(
      (item, index) => `
    <tr data-index="${index}">
      <td class="cart-table__image-cell" data-label="">
        <img src="${fixImagePath(item.imageUrl, true)}" alt="${item.name}"/>
      </td>
      <td class="cart-table__name" data-label="Product:">${item.name}</td>
      <td class="cart-table__price" data-label="Price:">$${item.price}</td>
      <td class="cart-table__quantity" data-label="Quantity:">
        <div class="quantity-controls">
          <button class="quantity-controls__btn" data-action="decrease" data-index="${index}" ${
        item.quantity === 1 ? 'disabled' : ''
      }>-</button>
          <span class="quantity-controls__value">${item.quantity}</span>
          <button class="quantity-controls__btn" data-action="increase" data-index="${index}">+</button>
        </div>
      </td>
      <td class="cart-table__total" data-label="Total:">$${
        item.price * item.quantity
      }</td>
      <td class="cart-table__delete" data-label="">
        <button class="delete-btn" data-index="${index}" aria-label="Delete item">
          <img src="../assets/images/cart/delete-icon.svg" alt="Delete" width="18" height="20" />
        </button>
      </td>
    </tr>
  `
    )
    .join('');

  // Attach event listeners
  attachQuantityListeners();
  attachDeleteListeners();
  updateCartSummary();
}

/**
 * Attach event listeners to quantity buttons
 */
function attachQuantityListeners() {
  const quantityButtons = document.querySelectorAll('.quantity-controls__btn');

  quantityButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      const index = parseInt(e.target.getAttribute('data-index'));
      updateQuantity(index, action);
    });
  });
}

/**
 * Attach event listeners to delete buttons
 */
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'));
      removeItem(index);
    });
  });
}

/**
 * Update item quantity
 */
function updateQuantity(index, action) {
  const cartItems = getCart();

  if (action === 'increase') {
    cartItems[index].quantity += 1;
  } else if (action === 'decrease') {
    // Don't allow quantity to go below 1
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
    }
    // If quantity is 1, do nothing - user must use delete button
  }

  saveCart(cartItems);
  renderCartItems();
}

/**
 * Remove item from cart
 */
function removeItem(index) {
  const cartItems = getCart();
  cartItems.splice(index, 1);
  saveCart(cartItems);
  renderCartItems();
}

/**
 * Calculate cart totals and update summary
 */
function updateCartSummary() {
  const cartItems = getCart();

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate discount if applicable
  let discount = 0;
  if (subtotal > DISCOUNT_THRESHOLD) {
    discount = subtotal * DISCOUNT_RATE;
  }

  // Calculate total
  const total = subtotal + SHIPPING_COST - discount;

  // Update UI
  document.getElementById('subtotal').textContent = `$${subtotal}`;
  document.getElementById('shipping').textContent = `$${SHIPPING_COST}`;
  document.getElementById('total').textContent = `$${Math.round(total)}`;

  // Show/hide discount row
  const discountRow = document.getElementById('discount-row');
  if (discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('discount').textContent = `$${Math.round(
      discount
    )}`;
  } else {
    discountRow.style.display = 'none';
  }
}

/**
 * Clear all items from cart
 */
function clearCart() {
  saveCart([]);
  renderCartItems();
}

/**
 * Handle checkout
 */
function checkout() {
  // Clear cart
  saveCart([]);

  // Hide cart content
  document.getElementById('cart-content').style.display = 'none';

  // Show thank you message
  document.getElementById('cart-thankyou').style.display = 'block';
}

/**
 * Continue shopping - redirect to catalog
 */
function continueShopping() {
  window.location.href = 'catalog.html';
}

/**
 * Initialize cart page
 */
function initCart() {
  // Render cart items
  renderCartItems();

  // Attach event listeners to action buttons
  const continueShoppingBtn = document.getElementById('continue-shopping');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener('click', continueShopping);
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCart);
