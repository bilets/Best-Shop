import { addToCart, showNotification } from './main.js';
import {
  fetchProducts,
  renderProducts,
  renderBestSets,
} from './productHelpers.js';

// Global state
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Active filters
let activeFilters = {
  size: '',
  color: '',
  category: '',
  sales: false,
};

/**
 * Sort products based on selected option
 * @param {Array} products - Products array to sort
 * @param {string} sortValue - Sort option value
 * @returns {Array} Sorted products
 */
function sortProducts(products, sortValue) {
  const productsCopy = [...products];

  switch (sortValue) {
    case 'price-asc':
      return productsCopy.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return productsCopy.sort((a, b) => b.price - a.price);
    case 'rating':
      return productsCopy.sort((a, b) => b.rating - a.rating);
    case 'popularity':
      return productsCopy.sort((a, b) => b.popularity - a.popularity);
    case 'default':
    default:
      return productsCopy;
  }
}

/**
 * Update results info display
 * @param {number} total - Total products count
 * @param {number} currentPage - Current page number
 */
function updateResultsInfo(total, currentPage) {
  const resultsInfo = document.getElementById('results-info');

  if (!resultsInfo) return;

  // If no products found, show message
  if (total === 0) {
    resultsInfo.textContent = 'No products found.';
    return;
  }

  // Otherwise show results range
  const start = (currentPage - 1) * productsPerPage + 1;
  const end = Math.min(currentPage * productsPerPage, total);

  resultsInfo.innerHTML = `
    Showing
    <span id="results-start">${start}</span>-<span id="results-end">${end}</span>
    Of
    <span id="results-total">${total}</span>
    Results
  `;
}

/**
 * Check if product matches size filter
 * @param {Object} product - Product to check
 * @param {string} sizeFilter - Size filter value
 * @returns {boolean} True if matches
 */
function matchesSizeFilter(product, sizeFilter) {
  if (!sizeFilter) {
    return true;
  }
  // Special case: when "SL" is selected, show products with size S, M, or L
  if (sizeFilter === 'SL') {
    return ['S', 'M', 'L'].includes(product.size);
  }
  // For all other sizes, exact match
  return product.size === sizeFilter;
}

/**
 * Apply filters to products
 * @param {Array} products - Products array to filter
 * @returns {Array} Filtered products
 */
function applyFilters(products) {
  return products.filter((product) => {
    const matchesSize = matchesSizeFilter(product, activeFilters.size);
    const matchesColor =
      !activeFilters.color || product.color === activeFilters.color;
    const matchesCategory =
      !activeFilters.category || product.category === activeFilters.category;
    const matchesSales = !activeFilters.sales || product.salesStatus;

    return matchesSize && matchesColor && matchesCategory && matchesSales;
  });
}

/**
 * Render current page products
 */
function renderCurrentPage() {
  const sortSelect = document.getElementById('sort-select');
  const sortValue = sortSelect ? sortSelect.value : 'default';

  // Apply filters first
  filteredProducts = applyFilters(allProducts);

  // Sort filtered products
  const sortedProducts = sortProducts(filteredProducts, sortValue);

  // Get products for current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = sortedProducts.slice(startIndex, endIndex);

  // Render products
  renderProducts(productsToShow, 'catalog-products', {
    onAddToCart: addToCart,
    onCardClick: (productId) => {
      window.location.href = `product-details.html?id=${productId}`;
    },
    useRelativePath: true,
  });

  // Update results info
  updateResultsInfo(sortedProducts.length, currentPage);
}

/**
 * Initialize pagination
 * @param {number} totalProducts - Total number of products
 */
function initPagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pageNumbersContainer = document.getElementById('page-numbers');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  if (!pageNumbersContainer) return;

  // Generate page number buttons
  pageNumbersContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `pagination__page ${
      i === currentPage ? 'pagination__page--active' : ''
    }`;
    pageBtn.textContent = i;
    pageBtn.setAttribute('data-page', i);

    // Add click event listener for page buttons
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderCurrentPage();
      updatePaginationUI(totalPages);
    });

    pageNumbersContainer.appendChild(pageBtn);
  }

  // Update Previous button state and add event listener
  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;

    // Remove old event listeners by cloning
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);

    // Add new event listener
    newPrevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCurrentPage();
        updatePaginationUI(totalPages);
      }
    });
  }

  // Update Next button state and add event listener
  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;

    // Remove old event listeners by cloning
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    // Add new event listener
    newNextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderCurrentPage();
        updatePaginationUI(totalPages);
      }
    });
  }
}

/**
 * Update pagination UI (active states and button states)
 * @param {number} totalPages - Total number of pages
 */
function updatePaginationUI(totalPages) {
  const pageButtons = document.querySelectorAll('.pagination__page');
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  // Update active state for page buttons
  pageButtons.forEach((btn) => {
    const page = parseInt(btn.getAttribute('data-page'));
    if (page === currentPage) {
      btn.classList.add('pagination__page--active');
    } else {
      btn.classList.remove('pagination__page--active');
    }
  });

  // Update Previous button state
  if (prevBtn) {
    prevBtn.disabled = currentPage <= 1;
  }

  // Update Next button state
  if (nextBtn) {
    nextBtn.disabled = currentPage >= totalPages;
  }

  // Scroll to top of products (accounting for fixed header)
  const catalogSection = document.querySelector('.catalog-section');
  if (catalogSection) {
    const headerHeight = 100; // Approximate header height
    const elementPosition = catalogSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

/**
 * Initialize sorting functionality
 */
function initSorting() {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', () => {
    currentPage = 1; // Reset to first page when sorting
    renderCurrentPage();
    initPagination(filteredProducts.length);
  });
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  if (!searchInput || !searchButton) return;

  // Search on button click
  searchButton.addEventListener('click', () => {
    performSearch(searchInput.value.trim());
  });

  // Search on Enter key
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value.trim());
    }
  });
}

/**
 * Perform product search
 * @param {string} query - Search query
 */
function performSearch(query) {
  if (!query) return;

  const searchQuery = query.toLowerCase().trim();
  const searchWords = searchQuery.split(/\s+/);

  // Search for product by: exact name, all search words match, or single word match
  const foundProduct = allProducts.find((product) => {
    const productName = product.name.toLowerCase();
    const productWords = productName.split(/\s+/);

    // Check for exact name match
    if (productName === searchQuery) {
      return true;
    }

    // Check if all search words are found in product name (as whole words)
    const allWordsMatch = searchWords.every((searchWord) =>
      productWords.some((productWord) => productWord === searchWord)
    );
    if (allWordsMatch) {
      return true;
    }

    // Single word search - check if it matches any product word exactly
    if (searchWords.length === 1) {
      return productWords.some((productWord) => productWord === searchWords[0]);
    }

    return false;
  });

  if (foundProduct) {
    // Product found - navigate to product details page
    window.location.href = `product-details.html?id=${foundProduct.id}`;
  } else {
    // Product not found - show notification
    showNotification('Product not found');
  }
}

/**
 * Clear selected state from all dropdown items
 * @param {NodeList} items - Dropdown items
 */
function clearDropdownSelection(items) {
  items.forEach((item) => item.classList.remove('selected'));
}

/**
 * Handle dropdown item click
 * @param {HTMLElement} item - Clicked item
 * @param {HTMLElement} selected - Selected display element
 * @param {NodeList} items - All dropdown items
 * @param {string} filterType - Type of filter (size, color, category)
 */
function handleDropdownItemClick(item, selected, items, filterType) {
  const value = item.getAttribute('data-value');
  const text = item.textContent;

  // Update selected text
  selected.textContent = text;

  // Update active filter
  if (filterType === 'size') {
    activeFilters.size = value;
  } else if (filterType === 'color') {
    activeFilters.color = value;
  } else if (filterType === 'category') {
    activeFilters.category = value;
  }

  // Add/remove highlight
  if (value) {
    selected.classList.add('has-value');
  } else {
    selected.classList.remove('has-value');
  }

  // Remove previous selected class and add to current item
  clearDropdownSelection(items);
  item.classList.add('selected');

  // Re-render
  currentPage = 1;
  renderCurrentPage();
  initPagination(filteredProducts.length);
}

/**
 * Initialize custom dropdown filters
 */
function initCustomDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');

  dropdowns.forEach((dropdown) => {
    const selected = dropdown.querySelector('.custom-dropdown__selected');
    const items = dropdown.querySelectorAll('.custom-dropdown__item');
    const filterType = dropdown.getAttribute('data-filter');

    items.forEach((item) => {
      item.addEventListener('click', () => {
        handleDropdownItemClick(item, selected, items, filterType);
      });
    });
  });
}

/**
 * Initialize filters functionality
 */
function initFilters() {
  const salesFilter = document.getElementById('sales-filter');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const hideFiltersBtn = document.getElementById('hide-filters');

  // Initialize custom dropdowns
  initCustomDropdowns();

  // Sales filter
  if (salesFilter) {
    salesFilter.addEventListener('change', (e) => {
      activeFilters.sales = e.target.checked;
      currentPage = 1;
      renderCurrentPage();
      initPagination(filteredProducts.length);
    });
  }

  // Clear filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Reset all filters
      activeFilters = {
        size: '',
        color: '',
        category: '',
        sales: false,
      };

      // Reset custom dropdowns
      const dropdowns = document.querySelectorAll('.custom-dropdown');
      dropdowns.forEach((dropdown) => {
        const selected = dropdown.querySelector('.custom-dropdown__selected');
        const items = dropdown.querySelectorAll('.custom-dropdown__item');

        // Reset to "Choose option"
        selected.textContent = 'Choose option';
        selected.classList.remove('has-value');

        // Remove selected class from all items
        items.forEach((item) => item.classList.remove('selected'));
      });

      // Reset sales filter
      if (salesFilter) {
        salesFilter.checked = false;
      }

      // Reset to first page and re-render
      currentPage = 1;
      renderCurrentPage();
      initPagination(filteredProducts.length);
    });
  }

  // Hide filters button
  const showFiltersBtn = document.getElementById('show-filters');
  const filtersSection = document.querySelector('.catalog-filters');

  if (hideFiltersBtn && filtersSection && showFiltersBtn) {
    hideFiltersBtn.addEventListener('click', () => {
      filtersSection.style.display = 'none';
      showFiltersBtn.style.display = 'block';
    });
  }

  // Show filters button
  if (showFiltersBtn && filtersSection) {
    showFiltersBtn.addEventListener('click', () => {
      filtersSection.style.display = 'block';
      showFiltersBtn.style.display = 'none';
    });
  }
}

// Load and render all products
document.addEventListener('DOMContentLoaded', async () => {
  allProducts = await fetchProducts('../');

  // Render current page
  renderCurrentPage();

  // Render best sets in sidebar (luggage sets with highest rating)
  const bestSets = allProducts
    .filter((product) => product.category === 'luggage sets')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  renderBestSets(bestSets, 'best-sets', true);

  // Initialize pagination
  initPagination(filteredProducts.length);

  // Initialize sorting
  initSorting();

  // Initialize filters
  initFilters();

  // Initialize search
  initSearch();
});
