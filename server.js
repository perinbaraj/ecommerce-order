const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load orders data
let orders = [];
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

function loadOrders() {
  try {
    const data = fs.readFileSync(ordersFilePath, 'utf8');
    orders = JSON.parse(data);
    console.log(`Loaded ${orders.length} orders from database`);
  } catch (error) {
    console.error('Error loading orders:', error.message);
    console.log('Please run: npm run generate-data');
    orders = [];
  }
}

loadOrders();

// API Routes

// GET all orders with optional filters
app.get('/api/orders', (req, res) => {
  try {
    let filteredOrders = [...orders];
    
    // Filter by status
    if (req.query.status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === req.query.status.toLowerCase()
      );
    }
    
    // Filter by customerId
    if (req.query.customerId) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerId === req.query.customerId
      );
    }
    
    // Filter by city
    if (req.query.city) {
      filteredOrders = filteredOrders.filter(order => 
        order.location.city.toLowerCase().includes(req.query.city.toLowerCase())
      );
    }
    
    // Filter by state
    if (req.query.state) {
      filteredOrders = filteredOrders.filter(order => 
        order.location.state.toLowerCase() === req.query.state.toLowerCase()
      );
    }
    
    // Search by customer name
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm)
      );
    }
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      total: filteredOrders.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredOrders.length / limit),
      data: paginatedOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single order by ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }
    
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET order statistics
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.orderValue, 0).toFixed(2),
      averageOrderValue: (orders.reduce((sum, order) => sum + order.orderValue, 0) / orders.length).toFixed(2),
      ordersByStatus: {},
      topCities: {}
    };
    
    // Count orders by status
    orders.forEach(order => {
      stats.ordersByStatus[order.status] = (stats.ordersByStatus[order.status] || 0) + 1;
    });
    
    // Count orders by city
    orders.forEach(order => {
      const city = order.location.city;
      stats.topCities[city] = (stats.topCities[city] || 0) + 1;
    });
    
    // Sort cities by count and get top 10
    stats.topCities = Object.entries(stats.topCities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((obj, [city, count]) => ({ ...obj, [city]: count }), {});
    
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    ordersLoaded: orders.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 E-commerce API server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/orders`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});
