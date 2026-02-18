// ============================================
// CROWN CHEMICAL - NEWSLETTER SUBSCRIPTION SYSTEM
// Features: Email/Phone collection, Validation, Storage, Export
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  
  console.log("📧 Newsletter System Loaded");

  // ============================================
  // NEWSLETTER FUNCTIONS
  // ============================================

  // Get all subscribers
  function getSubscribers() {
    return JSON.parse(localStorage.getItem('crown_subscribers')) || [];
  }

  // Save subscribers
  function saveSubscribers(subscribers) {
    localStorage.setItem('crown_subscribers', JSON.stringify(subscribers));
  }

  // Validate email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Validate phone (Nigerian format)
  function isValidPhone(phone) {
    // Remove spaces and special characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Check if it's a valid Nigerian number
    // Formats: 08012345678, 2348012345678, +2348012345678
    const nigerianPattern = /^(\+?234|0)[789]\d{9}$/;
    return nigerianPattern.test(cleaned);
  }

  // Detect if input is email or phone
  function detectInputType(input) {
    if (input.includes('@')) {
      return 'email';
    } else if (/^\d/.test(input)) {
      return 'phone';
    }
    return 'unknown';
  }

  // Add subscriber
  function addSubscriber(contact) {
    const subscribers = getSubscribers();
    const type = detectInputType(contact);
    
    // Validate based on type
    if (type === 'email') {
      if (!isValidEmail(contact)) {
        return { success: false, message: 'Please enter a valid email address' };
      }
      
      // Check if email already subscribed
      const exists = subscribers.find(s => s.contact.toLowerCase() === contact.toLowerCase());
      if (exists) {
        return { success: false, message: 'This email is already subscribed!' };
      }
    } else if (type === 'phone') {
      if (!isValidPhone(contact)) {
        return { success: false, message: 'Please enter a valid phone number' };
      }
      
      // Check if phone already subscribed
      const cleanedInput = contact.replace(/[\s\-\(\)]/g, '');
      const exists = subscribers.find(s => {
        const cleanedSaved = s.contact.replace(/[\s\-\(\)]/g, '');
        return cleanedSaved === cleanedInput;
      });
      
      if (exists) {
        return { success: false, message: 'This phone number is already subscribed!' };
      }
    } else {
      return { success: false, message: 'Please enter a valid email or phone number' };
    }
    
    // Create subscriber object
    const subscriber = {
      id: 'SUB_' + Date.now(),
      contact: contact.trim(),
      type: type,
      subscribedAt: Date.now(),
      source: 'website_footer',
      status: 'active'
    };
    
    subscribers.push(subscriber);
    saveSubscribers(subscribers);
    
    return { success: true, subscriber };
  }

  // Get subscriber statistics
  function getSubscriberStats() {
    const subscribers = getSubscribers();
    return {
      total: subscribers.length,
      emails: subscribers.filter(s => s.type === 'email').length,
      phones: subscribers.filter(s => s.type === 'phone').length,
      thisMonth: subscribers.filter(s => {
        const now = new Date();
        const subDate = new Date(s.subscribedAt);
        return subDate.getMonth() === now.getMonth() && 
               subDate.getFullYear() === now.getFullYear();
      }).length
    };
  }

  // Export subscribers to CSV
  function exportSubscribersToCSV() {
    const subscribers = getSubscribers();
    
    if (subscribers.length === 0) {
      alert('No subscribers to export!');
      return;
    }
    
    // Create CSV header
    let csv = 'ID,Contact,Type,Subscribed Date,Source,Status\n';
    
    // Add data rows
    subscribers.forEach(sub => {
      const date = new Date(sub.subscribedAt).toLocaleDateString();
      csv += `${sub.id},"${sub.contact}",${sub.type},"${date}",${sub.source},${sub.status}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crown-chemical-subscribers-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log('📥 Subscribers exported successfully!');
  }

  // Export subscribers list (formatted for WhatsApp/Email)
  function exportSubscribersList() {
    const subscribers = getSubscribers();
    
    if (subscribers.length === 0) {
      alert('No subscribers yet!');
      return '';
    }
    
    let list = '📧 CROWN CHEMICAL - SUBSCRIBER LIST\n';
    list += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    list += `Total Subscribers: ${subscribers.length}\n\n`;
    
    // Group by type
    const emails = subscribers.filter(s => s.type === 'email');
    const phones = subscribers.filter(s => s.type === 'phone');
    
    if (emails.length > 0) {
      list += `📧 EMAIL SUBSCRIBERS (${emails.length}):\n`;
      list += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      emails.forEach((sub, index) => {
        list += `${index + 1}. ${sub.contact}\n`;
      });
      list += '\n';
    }
    
    if (phones.length > 0) {
      list += `📱 PHONE SUBSCRIBERS (${phones.length}):\n`;
      list += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      phones.forEach((sub, index) => {
        list += `${index + 1}. ${sub.contact}\n`;
      });
    }
    
    return list;
  }

  // Show notification
  function showNotification(message, type = 'success') {
    const messageElement = document.querySelector('.news-letter .message');
    
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.className = `message ${type}`;
      messageElement.style.display = 'block';
      
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  }

  // ============================================
  // NEWSLETTER FORM HANDLER
  // ============================================

  const newsletterForm = document.querySelector('.news-letter .form');
  
  if (newsletterForm) {
    const input = newsletterForm.querySelector('input[type="text"]');
    const subscribeBtn = newsletterForm.querySelector('button');
    
    // Handle form submission
    subscribeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const contact = input.value.trim();
      
      if (!contact) {
        showNotification('Please enter your email or phone number', 'error');
        return;
      }
      
      const result = addSubscriber(contact);
      
      if (result.success) {
        showNotification('✅ Thank you for subscribing! You\'ll receive updates about new products and discounts.', 'success');
        input.value = ''; // Clear input
        
        // Log for admin
        console.log('🎉 New subscriber:', result.subscriber);
        console.log('📊 Total subscribers:', getSubscribers().length);
      } else {
        showNotification(result.message, 'error');
      }
    });
    
    // Allow Enter key to submit
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        subscribeBtn.click();
      }
    });
  }

  // ============================================
  // ADMIN FUNCTIONS (Accessible via Console)
  // ============================================

  // Expose admin functions to window object
  window.CrownNewsletter = {
    getSubscribers: getSubscribers,
    getStats: getSubscriberStats,
    exportCSV: exportSubscribersToCSV,
    exportList: exportSubscribersList,
    
    // View all subscribers in console
    viewSubscribers: () => {
      const subscribers = getSubscribers();
      console.log('📧 TOTAL SUBSCRIBERS:', subscribers.length);
      console.table(subscribers);
      return subscribers;
    },
    
    // Search subscriber
    searchSubscriber: (query) => {
      const subscribers = getSubscribers();
      const results = subscribers.filter(s => 
        s.contact.toLowerCase().includes(query.toLowerCase())
      );
      console.log(`🔍 Found ${results.length} result(s):`);
      console.table(results);
      return results;
    },
    
    // Get subscriber statistics
    showStats: () => {
      const stats = getSubscriberStats();
      console.log('📊 SUBSCRIBER STATISTICS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Total Subscribers:', stats.total);
      console.log('Email Subscribers:', stats.emails);
      console.log('Phone Subscribers:', stats.phones);
      console.log('New This Month:', stats.thisMonth);
      return stats;
    },
    
    // Copy list to clipboard
    copyList: () => {
      const list = exportSubscribersList();
      navigator.clipboard.writeText(list).then(() => {
        console.log('✅ Subscriber list copied to clipboard!');
        alert('Subscriber list copied! You can now paste it anywhere.');
      });
      return list;
    },
    
    // Send notification to all (demo - shows what message would look like)
    previewNotification: (message) => {
      const subscribers = getSubscribers();
      console.log('📢 NOTIFICATION PREVIEW:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Recipients:', subscribers.length);
      console.log('Message:', message);
      console.log('\nWould be sent to:');
      subscribers.forEach(sub => {
        console.log(`  ${sub.type === 'email' ? '📧' : '📱'} ${sub.contact}`);
      });
      return {
        recipients: subscribers.length,
        message: message,
        subscribers: subscribers
      };
    }
  };

  // Log available admin commands
  console.log('📧 Newsletter Admin Commands Available:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('CrownNewsletter.viewSubscribers()    - View all subscribers');
  console.log('CrownNewsletter.showStats()          - Show statistics');
  console.log('CrownNewsletter.exportCSV()          - Download CSV file');
  console.log('CrownNewsletter.copyList()           - Copy list to clipboard');
  console.log('CrownNewsletter.searchSubscriber("email@example.com")');
  console.log('CrownNewsletter.previewNotification("Your message here")');

});
