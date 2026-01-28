const fs = require('fs');
const path = require('path');

// Sample data pools
const products = [
  { name: 'Wireless Headphones', price: 79.99 },
  { name: 'Smart Watch', price: 249.99 },
  { name: 'Laptop Stand', price: 39.99 },
  { name: 'USB-C Cable', price: 14.99 },
  { name: 'Mechanical Keyboard', price: 129.99 },
  { name: 'Gaming Mouse', price: 59.99 },
  { name: 'Webcam HD', price: 89.99 },
  { name: 'Bluetooth Speaker', price: 49.99 },
  { name: 'Phone Case', price: 19.99 },
  { name: 'Screen Protector', price: 12.99 },
  { name: 'Power Bank', price: 34.99 },
  { name: 'Desk Lamp', price: 44.99 },
  { name: 'Ergonomic Chair', price: 299.99 },
  { name: 'Monitor 27"', price: 349.99 },
  { name: 'Wireless Charger', price: 29.99 },
  { name: 'External SSD 1TB', price: 119.99 },
  { name: 'Laptop Backpack', price: 54.99 },
  { name: 'Coffee Mug Warmer', price: 24.99 },
  { name: 'Noise Cancelling Earbuds', price: 149.99 },
  { name: 'Tablet Stand', price: 22.99 }
];

const cities = [
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'San Antonio', state: 'TX' },
  { city: 'San Diego', state: 'CA' },
  { city: 'Dallas', state: 'TX' },
  { city: 'San Jose', state: 'CA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Jacksonville', state: 'FL' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Boston', state: 'MA' },
  { city: 'Portland', state: 'OR' },
  { city: 'Miami', state: 'FL' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'Las Vegas', state: 'NV' },
  { city: 'Detroit', state: 'MI' }
];

const streets = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Pine Rd', 'Cedar Ln',
  'Elm St', 'Washington Blvd', 'Park Ave', 'Lake St', 'Hill Rd',
  'River Dr', 'Forest Ln', 'Sunset Blvd', 'Broadway', 'Market St'
];

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall', 'Allen'
];

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Helper functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(array) {
  return array[randomInt(0, array.length - 1)];
}

function generateDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date.toISOString();
}

function generateCustomerName() {
  return `${randomElement(firstNames)} ${randomElement(lastNames)}`;
}

function generateAddress() {
  const location = randomElement(cities);
  const streetNumber = randomInt(100, 9999);
  const street = randomElement(streets);
  
  return {
    street: `${streetNumber} ${street}`,
    city: location.city,
    state: location.state,
    zipCode: `${randomInt(10000, 99999)}`
  };
}

function generateOrderItems() {
  const itemCount = randomInt(1, 5);
  const items = [];
  const usedProducts = new Set();
  
  for (let i = 0; i < itemCount; i++) {
    let product;
    do {
      product = randomElement(products);
    } while (usedProducts.has(product.name));
    
    usedProducts.add(product.name);
    const quantity = randomInt(1, 3);
    
    items.push({
      productId: `PROD-${randomInt(1000, 9999)}`,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.price,
      totalPrice: parseFloat((product.price * quantity).toFixed(2))
    });
  }
  
  return items;
}

function generateOrder(orderId, customerId) {
  const items = generateOrderItems();
  const orderValue = parseFloat(items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2));
  const location = randomElement(cities);
  const shippingAddress = generateAddress();
  const daysBack = randomInt(0, 90);
  const status = randomElement(statuses);
  
  return {
    id: `ORD-${String(orderId).padStart(6, '0')}`,
    customerId: `CUST-${String(customerId).padStart(5, '0')}`,
    customerName: generateCustomerName(),
    orderDate: generateDate(daysBack),
    location: {
      city: location.city,
      state: location.state
    },
    items: items,
    orderValue: orderValue,
    status: status,
    shippingAddress: shippingAddress
  };
}

// Generate orders
function generateOrders() {
  const orderCount = randomInt(50, 100);
  const orders = [];
  
  console.log(`Generating ${orderCount} mock orders...`);
  
  for (let i = 1; i <= orderCount; i++) {
    const customerId = randomInt(1, 500);
    orders.push(generateOrder(i, customerId));
  }
  
  return orders;
}

// Main execution
const orders = generateOrders();

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Write to file
const filePath = path.join(dataDir, 'orders.json');
fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

console.log(`✓ Successfully generated ${orders.length} orders`);
console.log(`✓ Data saved to ${filePath}`);
console.log(`✓ Total order value: $${orders.reduce((sum, order) => sum + order.orderValue, 0).toFixed(2)}`);
