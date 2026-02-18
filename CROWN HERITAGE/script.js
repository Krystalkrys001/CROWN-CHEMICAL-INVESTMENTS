document.addEventListener("DOMContentLoaded", () => {

  console.log("🚀 Script loaded successfully!");

  // ======= WHATSAPP CONFIGURATION =======
  const WHATSAPP_NUMBER = "2347039744486"; // Your WhatsApp number (without +)
  const BUSINESS_NAME = "Crown Chemical";

  // ======= GLOBAL CART COUNTER =======
  const cartCounter = document.querySelector(".cart .count");
  const cartBtn = document.querySelector(".cart-btn");
  const cartPanel = document.querySelector(".cart-panel");
  const cartOverlay = document.querySelector(".cart-overlay");
  const closeCartBtn = document.querySelector(".close-cart");

  function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const uniqueItems = cart.length; // Count number of unique products
    if (cartCounter) cartCounter.textContent = uniqueItems;
    console.log("📊 Cart updated. Unique products:", uniqueItems);
  }

  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartEmpty = document.querySelector(".cart-empty");
    const cartFooter = document.querySelector(".cart-footer");
    const subtotalElement = document.querySelector(".subtotal-amount");

    if (!cartItemsContainer) return;

    // If cart is empty
    if (cart.length === 0) {
      if (cartEmpty) cartEmpty.style.display = "block";
      if (cartFooter) cartFooter.style.display = "none";
      cartItemsContainer.innerHTML = "";
      return;
    }

    // Hide empty message, show footer
    if (cartEmpty) cartEmpty.style.display = "none";
    if (cartFooter) cartFooter.style.display = "block";

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (subtotalElement) {
      subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    }

    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => {
      const itemTotal = item.price * item.qty; // Calculate total for this item
      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <h4 class="cart-item-name">${item.name}</h4>
            <p class="cart-item-variant">${item.variant || ''}</p>
            <p class="cart-item-price-details">
              <span class="unit-price">₦${item.price.toLocaleString()} × ${item.qty}</span>
            </p>
            <p class="cart-item-price">₦${itemTotal.toLocaleString()}</p>
          </div>
          <div class="cart-item-actions">
            <div class="cart-qty-controls">
              <button class="cart-qty-btn minus-btn" data-id="${item.id}">−</button>
              <span class="cart-qty-display">${item.qty}</span>
              <button class="cart-qty-btn plus-btn" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M6 4V2H10V4M12 4V14H4V4H12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach event listeners to cart buttons
    attachCartItemListeners();
  }

  function attachCartItemListeners() {
    // Plus buttons
    document.querySelectorAll(".cart-qty-btn.plus-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.id;
        updateCartItemQty(itemId, 1);
      });
    });

    // Minus buttons
    document.querySelectorAll(".cart-qty-btn.minus-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.id;
        updateCartItemQty(itemId, -1);
      });
    });

    // Remove buttons
    document.querySelectorAll(".remove-item-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.id;
        removeCartItem(itemId);
      });
    });
  }

  function updateCartItemQty(itemId, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
      item.qty += change;
      
      // Remove item if quantity is 0 or less
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== itemId);
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCounter();
      updateCartUI();
    }
  }

  function removeCartItem(itemId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(i => i.id !== itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    updateCartUI();
  }

  function clearCart() {
    if (confirm("Are you sure you want to remove all items from your cart?")) {
      localStorage.setItem("cart", JSON.stringify([]));
      updateCartCounter();
      updateCartUI();
    }
  }

  // ======= WHATSAPP FUNCTIONS =======

  function generateWhatsAppMessage() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
      return `Hello ${BUSINESS_NAME}! I'm interested in your products.`;
    }

    // Calculate total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Build message
    let message = `*🛒 New Order from Crown Chemical Website*\n\n`;
    message += `*ORDER DETAILS:*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      message += `${index + 1}. *${item.name}*\n`;
      if (item.variant) {
        message += `   Size: ${item.variant}\n`;
      }
      message += `   Quantity: ${item.qty}\n`;
      message += `   Price: ₦${item.price.toLocaleString()}\n`;
      message += `   Subtotal: ₦${itemTotal.toLocaleString()}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*TOTAL: ₦${subtotal.toLocaleString()}*\n\n`;
    message += `Please confirm my order. Thank you! 😊`;

    return message;
  }

  function sendToWhatsApp(isCheckout = false) {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    console.log("📱 Opening WhatsApp...");
    console.log("📞 Number:", WHATSAPP_NUMBER);
    console.log("🔗 URL:", whatsappURL);
    
    // Try multiple methods to open WhatsApp
    try {
      // Method 1: Direct window location (works best on mobile)
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = whatsappURL;
      } else {
        // Method 2: Open new window (works best on desktop)
        const newWindow = window.open(whatsappURL, '_blank');
        
        // If popup blocked, try direct navigation
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          console.log("⚠️ Popup blocked, using direct navigation");
          window.location.href = whatsappURL;
        }
      }
    } catch (error) {
      console.error("❌ Error opening WhatsApp:", error);
      // Fallback: direct navigation
      window.location.href = whatsappURL;
    }

    // If checkout, optionally clear cart after sending
    if (isCheckout) {
      // Uncomment next line if you want to clear cart after checkout
      // setTimeout(() => { clearCart(); }, 2000);
    }
  }

  // ======= CHECKOUT BUTTON HANDLER =======
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      if (cart.length === 0) {
        showNotification("Your cart is empty! Add some products first.");
        return;
      }

      sendToWhatsApp(true);
      closeCart();
      showNotification("Opening WhatsApp... 📱");
    });
  }

  // ======= FLOATING WHATSAPP BUTTON HANDLER =======
  const floatingWhatsAppBtn = document.querySelector(".floating-whatsapp");
  if (floatingWhatsAppBtn) {
    floatingWhatsAppBtn.addEventListener("click", () => {
      sendToWhatsApp(false);
    });
  }

  // Open cart panel
  function openCart() {
    if (cartPanel) cartPanel.classList.add("active");
    if (cartOverlay) cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
    updateCartUI();
  }

  // Close cart panel
  function closeCart() {
    if (cartPanel) cartPanel.classList.remove("active");
    if (cartOverlay) cartOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Restore scroll
  }

  // Event listeners for cart panel
  if (cartBtn) {
    cartBtn.addEventListener("click", openCart);
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  // Clear cart button
  const clearCartBtn = document.querySelector(".clear-cart-btn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  // Initialize
  updateCartCounter();
  updateCartUI();

  // ======= PRODUCT PAGE LOGIC (ONLY RUNS ON PAGES WITH .produce) =======
  const products = document.querySelectorAll(".produce");

  products.forEach(product => {

    const sizeButtons = product.querySelectorAll(".size-btn");
    const images = product.querySelectorAll(".small-Img");
    const priceValue = product.querySelector(".price-value");
    const qtyInput = product.querySelector(".qty-input");
    const plusBtn = product.querySelector(".plus");
    const minusBtn = product.querySelector(".minus");

    let unitPrice = parseInt(
      product.querySelector(".size-btn.active").dataset.price,
      10
    );

    function updatePrice() {
      let qty = parseInt(qtyInput.value, 10);
      if (isNaN(qty) || qty < 1) {
        priceValue.textContent = unitPrice;
        return;
      }
      priceValue.textContent = unitPrice * qty;
    }

    // SIZE CHANGE
    sizeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        unitPrice = parseInt(btn.dataset.price, 10);
        updatePrice();
      });
    });

    // IMAGE CLICK HANDLER
    images.forEach(img => {
      img.addEventListener("click", () => {
        const imgPrice = parseInt(img.dataset.price, 10);
        const imgSize = img.dataset.size;
        if (isNaN(imgPrice)) return;

        sizeButtons.forEach(btn => {
          btn.classList.remove("active");
          if (btn.dataset.size === imgSize) {
            btn.classList.add("active");
          }
        });

        unitPrice = imgPrice;
        updatePrice();

        const mainImg = product.querySelector("#mainImg");
        if (mainImg) mainImg.src = img.src;
      });
    });

    // QUANTITY CONTROL
    plusBtn.addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value || 1, 10) + 1;
      updatePrice();
    });

    minusBtn.addEventListener("click", () => {
      if (qtyInput.value > 1) {
        qtyInput.value = parseInt(qtyInput.value, 10) - 1;
        updatePrice();
      }
    });

    qtyInput.addEventListener("focus", () => {
      if (qtyInput.value === "1") qtyInput.value = "";
    });

    qtyInput.addEventListener("input", updatePrice);

    qtyInput.addEventListener("blur", () => {
      if (qtyInput.value === "") {
        qtyInput.value = 1;
        updatePrice();
      }
    });

    updatePrice();

    // PRODUCT PAGE ADD TO CART
    const addToCartBtn = product.querySelector(".add-to-cart-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        console.log("🛒 Product page Add to Cart clicked!");
        
        const selectedSizeBtn = product.querySelector(".size-btn.active");
        const qty = parseInt(product.querySelector(".qty-input").value, 10);

        if (!selectedSizeBtn) {
          alert("Please select a size/variant first!");
          return;
        }

        const cartItem = {
          id: selectedSizeBtn.dataset.id,
          name: selectedSizeBtn.dataset.name,
          variant: selectedSizeBtn.dataset.size,
          price: parseInt(selectedSizeBtn.dataset.price, 10),
          qty: qty
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItem = cart.find(item => item.id === cartItem.id);

        if (existingItem) {
          existingItem.qty += cartItem.qty;
        } else {
          cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
        updateCartUI();

        // Show success notification
        showNotification(`${cartItem.name} (${cartItem.variant}) added to cart!`);
      });
    }

  }); // END product.forEach



  // =============================================================
  // === GLOBAL ADD-TO-CART HANDLER (USING EVENT DELEGATION) ===
  // =============================================================
  
  // Instead of selecting buttons, we listen on the entire document
  document.addEventListener("click", (e) => {
    
    // Check if clicked element is a button or inside a button
    const button = e.target.closest("button");
    
    if (!button) return; // Not a button, ignore
    
    // Check if this button has data-price (our indicator for add-to-cart)
    if (!button.dataset.price) return; // Not an add-to-cart button
    
    // Skip if inside .produce (handled above)
    if (button.closest(".produce")) return;
    
    console.log("🎯 Add to cart button clicked!", button);
    
    // FLEXIBLE DATA EXTRACTION
    const id = button.dataset.id || button.dataset.product || `product-${Date.now()}`;
    const name = button.dataset.name || button.dataset.product || "Unknown Product";
    const size = button.dataset.size || null;
    const price = parseInt(button.dataset.price, 10);

    console.log("📦 Cart item:", { id, name, size, price });

    // Validation
    if (!price || isNaN(price)) {
      console.error("❌ Invalid price");
      showNotification("Error: Product price is missing or invalid.");
      return;
    }

    const cartItem = {
      id,
      name,
      variant: size,
      price,
      qty: 1
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === cartItem.id);

    if (existingItem) {
      existingItem.qty += 1;
      console.log("♻️ Increased quantity to", existingItem.qty);
    } else {
      cart.push(cartItem);
      console.log("➕ Added new item to cart");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
    updateCartUI();

    console.log("🎉 Showing notification...");
    showNotification(`${cartItem.name}${cartItem.variant ? " (" + cartItem.variant + ")" : ""} added to cart!`);
  });

  // Custom notification instead of alert
  function showNotification(message) {
    // Remove existing notification if any
    const existing = document.querySelector(".custom-notification");
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement("div");
    notification.className = "custom-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"/>
          <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 10);

    // Hide and remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Log how many potential buttons exist
  setTimeout(() => {
    const allButtons = document.querySelectorAll("button[data-price]");
    console.log(`✅ Found ${allButtons.length} buttons with data-price attribute`);
  }, 100);

});

// Live Chat JavaScript
(function() {
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatMinimize = document.getElementById('chatMinimize');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const chatNotification = document.getElementById('chatNotification');

    // Toggle chat
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
        chatNotification.style.display = 'none';
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    });

    chatMinimize.addEventListener('click', () => {
        chatWindow.classList.remove('open');
    });

    // Handle message send
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000);
    });

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(message) {
        const msg = message.toLowerCase();
        
        if (msg.includes('price') || msg.includes('cost')) {
            return 'Our products range from ₦1,900 to ₦25,000. Which product are you interested in?';
        }
        if (msg.includes('car wash')) {
            return 'Car Wash is available in 1L (₦2,800), 4L (₦4,700), and 25L (₦22,000). Would you like to order?';
        }
        if (msg.includes('delivery') || msg.includes('shipping')) {
            return 'We deliver nationwide! Delivery takes 2-5 business days. WhatsApp us at +2347079551515 for details.';
        }
        if (msg.includes('order') || msg.includes('buy')) {
            return 'Great! Click the "Add to Cart" button and checkout via WhatsApp. We\'ll process your order immediately!';
        }
        if (msg.includes('stock') || msg.includes('available')) {
            return 'Yes, we have all products in stock! What would you like to order?';
        }
        
        return 'Thanks for your message! Our team will respond shortly. You can also WhatsApp us at +2347079551515 for instant support! 📱';
    }

    // Show notification after 5 seconds
    setTimeout(() => {
        if (!chatWindow.classList.contains('open')) {
            chatNotification.style.display = 'flex';
        }
    }, 5000);
})();