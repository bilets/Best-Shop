/**
 * Product Helpers Module
 * Contains shared functions for working with products across different pages
 */

/**
 * Fetch product data from JSON file
 * @param {string} basePath - Base path to data.json file
 * @returns {Promise<Array>} Array of products
 */
export async function fetchProducts(basePath = './') {
  try {
    const response = await fetch(`${basePath}assets/data.json`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fix image path for subfolders
 * @param {string} imageUrl - Original image path
 * @param {boolean} useRelativePath - Whether to use relative path for subfolders
 * @returns {string} Fixed path
 */
export function fixImagePath(imageUrl, useRelativePath = false) {
  if (useRelativePath) {
    return imageUrl.replace('./', '../');
  }
  return imageUrl;
}

/**
 * Create product card HTML markup
 * @param {Object} product - Product object
 * @param {Object} options - Rendering options
 * @param {boolean} options.useRelativePath - Whether to use relative path for images
 * @returns {string} HTML markup
 */
export function createProductCard(product, options = {}) {
  const { useRelativePath = false } = options;
  const imageUrl = fixImagePath(product.imageUrl, useRelativePath);

  return `
    <article class="product-card">
      <div class="product-card__wrapper">
        ${
          product.salesStatus
            ? '<span class="product-card__badge">SALE</span>'
            : ''
        }
        <img src="${imageUrl}" alt="${product.name}" class="product-card__image">
      </div>
      <div class="product-card__content">
        <h4 class="product-card__title">${product.name}</h4>
        <p class="product-card__price">$${product.price}</p>
        <button class="btn btn--primary" data-product-id="${product.id}">
          Add To Cart
        </button>
      </div>
    </article>
  `;
}

/**
 * Render products list into container
 * @param {Array} products - Array of products to render
 * @param {string} containerId - Container ID
 * @param {Object} options - Rendering options
 * @param {Function} options.onAddToCart - Callback for adding to cart
 * @param {Function} options.onCardClick - Callback for card click
 * @param {boolean} options.useRelativePath - Whether to use relative path for images
 */
export function renderProducts(products, containerId, options = {}) {
  const {
    onAddToCart,
    onCardClick,
    useRelativePath = false,
  } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = products
    .map((product) => createProductCard(product, { useRelativePath }))
    .join('');

  // Add event listeners for "Add to Cart" buttons
  if (onAddToCart) {
    container.querySelectorAll('.btn--primary').forEach((button) => {
      button.addEventListener('click', async (e) => {
        e.stopPropagation();
        const productId = button.getAttribute('data-product-id');
        const product = products.find((p) => p.id === productId);

        if (product) {
          onAddToCart(product);
        }
      });
    });
  }

  // Add event listeners for product cards
  if (onCardClick) {
    container.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        // Don't navigate if clicking the "Add to Cart" button
        if (e.target.closest('.btn--primary')) return;

        const button = card.querySelector('.btn--primary');
        const productId = button?.getAttribute('data-product-id');

        if (productId) {
          onCardClick(productId);
        }
      });

      card.style.cursor = 'pointer';
    });
  }
}

/**
 * Create sidebar item HTML markup (Best Sets)
 * @param {Object} product - Product object
 * @param {boolean} useRelativePath - Whether to use relative path for images
 * @returns {string} HTML markup
 */
export function createBestSetItem(product, useRelativePath = false) {
  const imageUrl = fixImagePath(product.imageUrl, useRelativePath);
  const filledStars = Math.floor(product.rating);
  const emptyStars = 5 - filledStars;

  const starsHtml =
    '★'.repeat(filledStars).split('').map(() =>
      `<span class="best-sets-list__star best-sets-list__star--filled">★</span>`
    ).join('') +
    '★'.repeat(emptyStars).split('').map(() =>
      `<span class="best-sets-list__star best-sets-list__star--empty">★</span>`
    ).join('');

  return `
    <div class="best-sets-list__item">
      <img src="${imageUrl}" alt="${product.name}" class="best-sets-list__image">
      <div class="best-sets-list__content">
        <p class="best-sets-list__name">${product.name}</p>
        <div class="best-sets-list__rating">
          ${starsHtml}
        </div>
        <p class="best-sets-list__price">$${product.price}</p>
      </div>
    </div>
  `;
}

/**
 * Render Best Sets in sidebar
 * @param {Array} products - Array of products
 * @param {string} containerId - Container ID
 * @param {boolean} useRelativePath - Whether to use relative path for images
 */
export function renderBestSets(products, containerId, useRelativePath = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  container.innerHTML = products
    .map((product) => createBestSetItem(product, useRelativePath))
    .join('');
}
