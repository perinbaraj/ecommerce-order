// API configuration
const API_BASE_URL = 'http://localhost:3000/api';

// State management
let currentPage = 1;
let totalPages = 1;
let currentFilters = {
    status: '',
    state: '',
    search: ''
};

// DOM elements
const ordersGrid = document.getElementById('ordersGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const stateFilter = document.getElementById('stateFilter');
const clearFiltersBtn = document.getElementById('clearFilters');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const orderModal = document.getElementById('orderModal');
const closeModal = document.querySelector('.close');

// Initialize app
async function init() {
    await loadStats();
    await loadOrders();
    await populateStateFilter();
    setupEventListeners();
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/stats`);
        const result = await response.json();
        
        if (result.success) {
            const stats = result.data;
            document.getElementById('totalOrders').textContent = stats.totalOrders;
            document.getElementById('totalRevenue').textContent = `$${parseFloat(stats.totalRevenue).toLocaleString()}`;
            document.getElementById('avgOrderValue').textContent = `$${parseFloat(stats.averageOrderValue).toLocaleString()}`;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load orders from API
async function loadOrders() {
    try {
        showLoading();
        hideError();
        
        const params = new URLSearchParams({
            page: currentPage,
            limit: 12
        });
        
        if (currentFilters.status) params.append('status', currentFilters.status);
        if (currentFilters.state) params.append('state', currentFilters.state);
        if (currentFilters.search) params.append('search', currentFilters.search);
        
        const response = await fetch(`${API_BASE_URL}/orders?${params}`);
        const result = await response.json();
        
        if (result.success) {
            displayOrders(result.data);
            updatePagination(result.page, result.totalPages, result.total);
        } else {
            showError('Failed to load orders');
        }
    } catch (error) {
        showError(`Error: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Display orders in grid
function displayOrders(orders) {
    if (orders.length === 0) {
        ordersGrid.innerHTML = '<div class="loading">No orders found</div>';
        return;
    }
    
    ordersGrid.innerHTML = orders.map(order => `
        <div class="order-card" onclick="showOrderDetails('${order.id}')">
            <div class="order-header">
                <div class="order-id">${order.id}</div>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-info">
                <div class="info-row">
                    <span class="info-label">Customer:</span>
                    <span class="info-value">${order.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${formatDate(order.orderDate)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${order.location.city}, ${order.location.state}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Order Value:</span>
                    <span class="info-value order-value">$${order.orderValue.toFixed(2)}</span>
                </div>
            </div>
            <div class="order-items">
                <div class="items-label">${order.items.length} item(s):</div>
                <div class="items-list">
                    ${order.items.slice(0, 2).map(item => 
                        `${item.productName} (${item.quantity})`
                    ).join(', ')}
                    ${order.items.length > 2 ? '...' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Show order details in modal
async function showOrderDetails(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        const result = await response.json();
        
        if (result.success) {
            const order = result.data;
            const detailsHtml = `
                <h2>${order.id}</h2>
                
                <div class="detail-section">
                    <h3>Order Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value">
                            <span class="order-status status-${order.status}">${order.status}</span>
                        </span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Date:</span>
                        <span class="detail-value">${formatDate(order.orderDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Order Value:</span>
                        <span class="detail-value order-value">$${order.orderValue.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Customer Information</h3>
                    <div class="detail-row">
                        <span class="detail-label">Customer ID:</span>
                        <span class="detail-value">${order.customerId}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${order.customerName}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Shipping Address</h3>
                    <div class="detail-row">
                        <span class="detail-label">Street:</span>
                        <span class="detail-value">${order.shippingAddress.street}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">City:</span>
                        <span class="detail-value">${order.shippingAddress.city}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">State:</span>
                        <span class="detail-value">${order.shippingAddress.state}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ZIP Code:</span>
                        <span class="detail-value">${order.shippingAddress.zipCode}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Order Items</h3>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.productName}</td>
                                    <td>${item.quantity}</td>
                                    <td>$${item.unitPrice.toFixed(2)}</td>
                                    <td>$${item.totalPrice.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            
            document.getElementById('orderDetails').innerHTML = detailsHtml;
            orderModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading order details:', error);
    }
}

// Populate state filter dropdown
async function populateStateFilter() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?limit=1000`);
        const result = await response.json();
        
        if (result.success) {
            const states = [...new Set(result.data.map(order => order.location.state))].sort();
            
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading states:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value;
            currentPage = 1;
            loadOrders();
        }, 500);
    });
    
    // Filters
    statusFilter.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        currentPage = 1;
        loadOrders();
    });
    
    stateFilter.addEventListener('change', (e) => {
        currentFilters.state = e.target.value;
        currentPage = 1;
        loadOrders();
    });
    
    // Clear filters
    clearFiltersBtn.addEventListener('click', () => {
        currentFilters = { status: '', state: '', search: '' };
        searchInput.value = '';
        statusFilter.value = '';
        stateFilter.value = '';
        currentPage = 1;
        loadOrders();
    });
    
    // Pagination
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadOrders();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadOrders();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Modal
    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });
}

// Update pagination controls
function updatePagination(page, total, orderCount) {
    currentPage = page;
    totalPages = total;
    
    pageInfo.textContent = `Page ${page} of ${total} (${orderCount} orders)`;
    
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= total;
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function showLoading() {
    loadingIndicator.style.display = 'block';
    ordersGrid.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
    ordersGrid.style.display = 'grid';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
