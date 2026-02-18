// Save this as: admin-dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    
    // Check admin authentication
    const adminSession = localStorage.getItem('crown_admin_session');
    if (!adminSession) {
        window.location.href = 'admin-login.html';
        return;
    }

    const session = JSON.parse(adminSession);
    if (Date.now() > session.expiresAt) {
        localStorage.removeItem('crown_admin_session');
        window.location.href = 'admin-login.html';
        return;
    }

    // Set admin name
    document.getElementById('adminName').textContent = session.username;

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('crown_admin_session');
            window.location.href = 'admin-login.html';
        }
    });

    // Menu navigation
    document.querySelectorAll('.admin-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const section = item.dataset.section;
            
            // Update active menu
            document.querySelectorAll('.admin-menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show section
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.getElementById(section + '-section').classList.add('active');
            
            // Load section data
            loadSectionData(section);
        });
    });

    // Load dashboard data
    function loadSectionData(section) {
        if (section === 'dashboard') loadDashboard();
        if (section === 'products') loadProducts();
        if (section === 'customers') loadCustomers();
        if (section === 'orders') loadOrders();
        if (section === 'newsletter') loadNewsletter();
    }

    function loadDashboard() {
        const users = JSON.parse(localStorage.getItem('crown_users')) || [];
        const subscribers = JSON.parse(localStorage.getItem('crown_subscribers')) || [];
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Calculate stats
        const totalCustomers = users.length;
        const totalSubscribers = subscribers.length;
        const totalOrders = users.reduce((acc, user) => acc + (user.orders?.length || 0), 0);
        
        // Demo revenue (since we don't have real orders yet)
        const demoRevenue = totalOrders * 25000; // Average order value
        
        // Update stats
        document.getElementById('totalRevenue').textContent = '₦' + demoRevenue.toLocaleString();
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('totalSubscribers').textContent = totalSubscribers;
        
        // Create chart (if Chart.js is loaded)
        if (typeof Chart !== 'undefined') {
            createSalesChart();
        }
        
        loadTopProducts();
        loadRecentOrders();
    }

    function createSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue (₦)',
                    data: [120000, 150000, 180000, 220000, 250000, 280000, 320000, 350000, 380000, 420000, 450000, 500000],
                    borderColor: '#0B9444',
                    backgroundColor: 'rgba(11, 148, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₦' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    function loadTopProducts() {
        const topProducts = [
            { name: 'Car Wash 4L', sold: 234, revenue: '₦1,099,800' },
            { name: 'Bleach 4L', sold: 189, revenue: '₦1,001,700' },
            { name: 'Liquid Soap 25L', sold: 156, revenue: '₦3,900,000' },
            { name: 'Dish Wash 4L', sold: 142, revenue: '₦667,400' },
            { name: 'Floor Cleaner 4L', sold: 98, revenue: '₦519,400' }
        ];
        
        const container = document.getElementById('topProductsList');
        if (!container) return;
        
        container.innerHTML = topProducts.map(product => `
            <div style="padding: 16px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
                <div>
                    <strong>${product.name}</strong>
                    <div style="font-size: 12px; color: #666;">${product.sold} sold</div>
                </div>
                <div style="text-align: right; color: #0B9444; font-weight: 600;">
                    ${product.revenue}
                </div>
            </div>
        `).join('');
    }

    function loadRecentOrders() {
        const container = document.getElementById('recentOrdersTable');
        if (!container) return;
        
        const users = JSON.parse(localStorage.getItem('crown_users')) || [];
        const recentOrders = [];
        
        users.forEach(user => {
            if (user.orders) {
                user.orders.forEach(order => {
                    recentOrders.push({
                        ...order,
                        customerName: user.fullName,
                        customerEmail: user.email
                    });
                });
            }
        });
        
        recentOrders.sort((a, b) => b.createdAt - a.createdAt);
        const latestOrders = recentOrders.slice(0, 10);
        
        if (latestOrders.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No orders yet</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${latestOrders.map(order => `
                        <tr>
                            <td>#${order.id.slice(-6)}</td>
                            <td>${order.customerName}</td>
                            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>₦${order.total?.toLocaleString() || '0'}</td>
                            <td><span style="padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; background: #fff3cd; color: #856404;">${order.status}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function loadProducts() {
        // Load products (you can expand this)
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        productsGrid.innerHTML = '<p style="padding: 40px; text-align: center; color: #999;">Products management coming soon!</p>';
    }

    function loadCustomers() {
        const users = JSON.parse(localStorage.getItem('crown_users')) || [];
        
        document.getElementById('customersTotalCount').textContent = users.length;
        
        const thisMonth = users.filter(u => {
            const userDate = new Date(u.createdAt);
            const now = new Date();
            return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        });
        
        document.getElementById('customersNewCount').textContent = thisMonth.length;
        document.getElementById('customersReturningPercent').textContent = '68%';
        
        const container = document.getElementById('customersTable');
        if (!container) return;
        
        if (users.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No customers yet</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Registered</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td><strong>${user.fullName}</strong></td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                            <td>${user.companyName || '-'}</td>
                            <td>${user.businessType || 'individual'}</td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    function loadOrders() {
        // Similar to loadRecentOrders but show all
        loadRecentOrders(); // Reuse the function
    }

    function loadNewsletter() {
        const subscribers = JSON.parse(localStorage.getItem('crown_subscribers')) || [];
        
        const emailSubs = subscribers.filter(s => s.type === 'email');
        const phoneSubs = subscribers.filter(s => s.type === 'phone');
        
        document.getElementById('subscribersTotal').textContent = subscribers.length;
        document.getElementById('subscribersEmail').textContent = emailSubs.length;
        document.getElementById('subscribersPhone').textContent = phoneSubs.length;
        
        const container = document.getElementById('subscribersTable');
        if (!container) return;
        
        if (subscribers.length === 0) {
            container.innerHTML = '<p style="padding: 20px; text-align: center; color: #999;">No subscribers yet</p>';
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Contact</th>
                        <th>Type</th>
                        <th>Source</th>
                        <th>Subscribed</th>
                    </tr>
                </thead>
                <tbody>
                    ${subscribers.map(sub => `
                        <tr>
                            <td><strong>${sub.contact}</strong></td>
                            <td><span style="padding: 4px 8px; border-radius: 6px; font-size: 12px; background: ${sub.type === 'email' ? '#e3f2fd' : '#fff3e0'}; color: ${sub.type === 'email' ? '#1976d2' : '#f57c00'};">${sub.type}</span></td>
                            <td>${sub.source}</td>
                            <td>${new Date(sub.subscribedAt).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Load initial dashboard
    loadDashboard();

});