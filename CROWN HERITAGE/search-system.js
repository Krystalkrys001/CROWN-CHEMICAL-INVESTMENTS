// ============================================
// CROWN CHEMICAL - SMART SEARCH SYSTEM
// Features: Autocomplete, Suggestions, Instant Results
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  
  console.log("🔍 Smart Search System Loaded");

  // ============================================
  // PRODUCT DATABASE
  // ============================================
  
  const products = [
    // Car Wash Products
    { id: 'carwash-1l-flat', name: 'Car Wash 1L Flat', category: 'Car Wash', price: 2800, image: 'CH/ch carwash 1l flat.jpg', page: 'carwash.html' },
    { id: 'carwash-1l-long', name: 'Car Wash 1L Long', category: 'Car Wash', price: 2800, image: 'CH/ch carwash 1l long.jpg', page: 'carwash.html' },
    { id: 'carwash-4l', name: 'Car Wash 4L', category: 'Car Wash', price: 4700, image: 'CH/ch carwash 4l.jpg', page: 'carwash.html' },
    { id: 'carwash-25l', name: 'Car Wash 25L', category: 'Car Wash', price: 22000, image: 'CH/ch carwash 25l.jpg', page: 'carwash.html' },
    
    // Bleach Products
    { id: 'bleach-500ml', name: 'Bleach 500ml', category: 'Bleach', price: 1900, image: 'CH/ch bleach 500ml.jpg', page: 'bleach.html' },
    { id: 'bleach-1l', name: 'Bleach 1L', category: 'Bleach', price: 3200, image: 'CH/ch bleach 1l.jpg', page: 'bleach.html' },
    { id: 'bleach-4l', name: 'Bleach 4L', category: 'Bleach', price: 5300, image: 'CH/ch bleach 4L.jpg', page: 'bleach.html' },
    { id: 'bleach-25l', name: 'Bleach 25L', category: 'Bleach', price: 25000, image: 'CH/ch bleach 25l.jpg', page: 'bleach.html' },
    
    // Liquid Soap Products
    { id: 'liquid-500ml', name: 'Liquid Soap 500ml', category: 'Liquid Soap', price: 1900, image: 'CH/ch liquid soap 500ml.jpg', page: 'liquid.html' },
    { id: 'liquid-1l', name: 'Liquid Soap 1L', category: 'Liquid Soap', price: 3200, image: 'CH/ch liquid soap 1l.jpg', page: 'liquid.html' },
    { id: 'liquid-4l', name: 'Liquid Soap 4L', category: 'Liquid Soap', price: 5300, image: 'CH/ch liquid soap 4l.jpg', page: 'liquid.html' },
    { id: 'liquid-25l', name: 'Liquid Soap 25L', category: 'Liquid Soap', price: 25000, image: 'CH/ch liquid soap 25l.jpg', page: 'liquid.html' },
    
    // Dish Wash Products
    { id: 'dish-500ml', name: 'Dish Wash 500ml', category: 'Dish Wash', price: 1900, image: 'CH/ch dishwash 500ml.jpg', page: 'dish.html' },
    { id: 'dish-1l', name: 'Dish Wash 1L', category: 'Dish Wash', price: 3200, image: 'CH/ch dishwash 1l.jpg', page: 'dish.html' },
    { id: 'dish-4l', name: 'Dish Wash 4L', category: 'Dish Wash', price: 4700, image: 'CH/ch dishwash 4l.jpg', page: 'dish.html' },
    { id: 'dish-25l', name: 'Dish Wash 25L', category: 'Dish Wash', price: 22000, image: 'CH/ch dishwash 25l.jpg', page: 'dish.html' },
    
    // Floor Cleaner Products
    { id: 'floor-500ml', name: 'Floor Cleaner 500ml', category: 'Floor Cleaner', price: 1900, image: 'CH/ch floor cleaner 500ml.jpg', page: 'floor.html' },
    { id: 'floor-1l', name: 'Floor Cleaner 1L', category: 'Floor Cleaner', price: 3200, image: 'CH/ch floor cleaner 1l.jpg', page: 'floor.html' },
    { id: 'floor-4l', name: 'Floor Cleaner 4L', category: 'Floor Cleaner', price: 5300, image: 'CH/ch floor cleaner 4l.jpg', page: 'floor.html' },
    { id: 'floor-25l', name: 'Floor Cleaner 25L', category: 'Floor Cleaner', price: 25000, image: 'CH/ch floor cleaner 25l.jpg', page: 'floor.html' },
    
    // Add more products as needed...
  ];

  // ============================================
  // SEARCH FUNCTIONS
  // ============================================

  // Search products
  function searchProducts(query) {
    if (!query || query.length < 1) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    // Search in name and category
    const results = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(searchTerm);
      const categoryMatch = product.category.toLowerCase().includes(searchTerm);
      return nameMatch || categoryMatch;
    });
    
    // Sort by relevance (exact matches first)
    results.sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(searchTerm);
      const bExact = b.name.toLowerCase().startsWith(searchTerm);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
    
    return results;
  }

  // Get products by category
  function getProductsByCategory(category) {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // ============================================
  // UI FUNCTIONS
  // ============================================

  const searchInput = document.querySelector('.input-search');
  const searchButton = document.querySelector('.search-button');
  const suggestionsContainer = document.querySelector('.search-suggestions');
  
  if (!searchInput || !suggestionsContainer) return;

  

  let currentFocus = -1;

  // ============================================
// PORTAL FIX: Move dropdown to body to avoid navbar z-index issues
// ============================================
(function() {
  if (!suggestionsContainer || !searchInput) return;
  
  // Store original parent for cleanup
  const originalParent = suggestionsContainer.parentElement;
  
  // Move suggestions to body
  document.body.appendChild(suggestionsContainer);
  
  // Function to update dropdown position
  function positionDropdown() {
    const inputRect = searchInput.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    
    suggestionsContainer.style.position = 'fixed';
    suggestionsContainer.style.top = (inputRect.bottom + 8) + 'px';
    suggestionsContainer.style.left = inputRect.left + 'px';
    suggestionsContainer.style.width = inputRect.width + 'px';
    suggestionsContainer.style.maxWidth = inputRect.width + 'px';
    suggestionsContainer.style.zIndex = '99999';
  }
  
  // Update position on various events
  searchInput.addEventListener('focus', positionDropdown);
  searchInput.addEventListener('input', positionDropdown);
  window.addEventListener('scroll', positionDropdown, { passive: true });
  window.addEventListener('resize', positionDropdown);
  
  // Position initially
  setTimeout(positionDropdown, 100);
})();

  // Show suggestions
  function showSuggestions(results) {
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    if (results.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="no-results">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#ccc" stroke-width="2"/>
            <path d="M20 14V22M20 26H20.01" stroke="#ccc" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No products found</p>
        </div>
      `;
      suggestionsContainer.classList.add('active');
      return;
    }
    
    // Group by category if searching
    const query = searchInput.value.toLowerCase();
    const categories = [...new Set(results.map(p => p.category))];
    
    categories.forEach(category => {
      const categoryProducts = results.filter(p => p.category === category);
      
      if (categoryProducts.length > 0) {
        // Category header
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'suggestion-category';
        categoryHeader.innerHTML = `
          <span class="category-name">${category}</span>
          <span class="category-count">${categoryProducts.length} products</span>
        `;
        suggestionsContainer.appendChild(categoryHeader);
        
        // Products in this category
        categoryProducts.forEach(product => {
          const suggestionItem = document.createElement('div');
          suggestionItem.className = 'suggestion-item';
          suggestionItem.innerHTML = `
            <div class="suggestion-image">
              <img src="${product.image}" alt="${product.name}" onerror="this.src='pics/crown.png'">
            </div>
            <div class="suggestion-info">
              <div class="suggestion-name">${highlightMatch(product.name, query)}</div>
              <div class="suggestion-price">₦${product.price.toLocaleString()}</div>
            </div>
            <svg class="suggestion-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `;
          
          // Click handler
          suggestionItem.addEventListener('click', () => {
            window.location.href = product.page;
          });
          
          suggestionsContainer.appendChild(suggestionItem);
        });
      }
    });
    
    suggestionsContainer.classList.add('active');
  }

  // Highlight matching text
  function highlightMatch(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  // Hide suggestions
  function hideSuggestions() {
    setTimeout(() => {
      suggestionsContainer.classList.remove('active');
      suggestionsContainer.innerHTML = '';
    }, 200);
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Input event - show suggestions as user types
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query.length === 0) {
      hideSuggestions();
      return;
    }
    
    const results = searchProducts(query);
    showSuggestions(results.slice(0, 10)); // Limit to 10 results
  });

  // Focus event - show suggestions if there's a query
  searchInput.addEventListener('focus', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      const results = searchProducts(query);
      showSuggestions(results.slice(0, 10));
    }
  });

  // Blur event - hide suggestions
  searchInput.addEventListener('blur', hideSuggestions);

  // Search button click
  searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      performSearch(query);
    }
  });

  // Enter key to search
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query.length > 0) {
        performSearch(query);
      }
    }
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    const items = suggestionsContainer.querySelectorAll('.suggestion-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentFocus++;
      if (currentFocus >= items.length) currentFocus = 0;
      setActive(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentFocus--;
      if (currentFocus < 0) currentFocus = items.length - 1;
      setActive(items);
    } else if (e.key === 'Enter' && currentFocus > -1) {
      e.preventDefault();
      if (items[currentFocus]) {
        items[currentFocus].click();
      }
    }
  });

  // Set active item during keyboard navigation
  function setActive(items) {
    items.forEach((item, index) => {
      item.classList.remove('active');
      if (index === currentFocus) {
        item.classList.add('active');
      }
    });
  }

  // Perform full search (redirect or filter page)
  function performSearch(query) {
    console.log('🔍 Searching for:', query);
    
    const results = searchProducts(query);
    
    if (results.length === 1) {
      // If only one result, go directly to that product page
      window.location.href = results[0].page;
    } else if (results.length > 0) {
      // Multiple results - go to first result's page
      // Or you can create a search results page later
      window.location.href = results[0].page;
    } else {
      alert('No products found for "' + query + '"');
    }
  }

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      hideSuggestions();
    }
  });

  // ============================================
  // POPULAR SEARCHES (Quick access)
  // ============================================

  // Show popular searches when input is clicked but empty
  searchInput.addEventListener('click', () => {
    if (searchInput.value.trim() === '') {
      showPopularSearches();
    }
  });

  function showPopularSearches() {
    const popularCategories = [
      { name: 'Car Wash', icon: '🚗' },
      { name: 'Bleach', icon: '🧴' },
      { name: 'Dish Wash', icon: '🍽️' },
      { name: 'Liquid Soap', icon: '🧼' },
      { name: 'Floor Cleaner', icon: '🧹' }
    ];
    
    suggestionsContainer.innerHTML = `
      <div class="popular-searches">
        <div class="popular-header">Popular Searches</div>
        ${popularCategories.map(cat => `
          <div class="popular-item" data-search="${cat.name}">
            <span class="popular-icon">${cat.icon}</span>
            <span class="popular-name">${cat.name}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    suggestionsContainer.classList.add('active');
    
    // Add click handlers to popular items
    suggestionsContainer.querySelectorAll('.popular-item').forEach(item => {
      item.addEventListener('click', () => {
        const searchTerm = item.dataset.search;
        searchInput.value = searchTerm;
        const results = searchProducts(searchTerm);
        showSuggestions(results.slice(0, 10));
      });
    });
  }

  // ============================================
  // EXPOSE SEARCH API
  // ============================================

  window.CrownSearch = {
    searchProducts,
    getProductsByCategory,
    products
  };

  console.log('🔍 Search system ready!');
  console.log('Try typing: car wash, bleach, dish, etc.');

});
