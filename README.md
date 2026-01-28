# E-Commerce Orders Dashboard

A simple e-commerce application with a REST API serving mock order data and a responsive frontend dashboard.

## Features

- **Mock Data Generation**: Generate 50-100 realistic mock orders with comprehensive details
- **REST API**: Express.js backend with multiple endpoints for order management
- **Responsive Dashboard**: Clean, modern UI to view and filter orders
- **Advanced Filtering**: Filter by status, state, and search by customer name or order ID
- **Order Details**: Click any order card to view complete details in a modal
- **Statistics Dashboard**: View total orders, revenue, and average order value
- **Pagination**: Navigate through orders with pagination controls

## Data Structure

Each order contains:
- `id`: Unique order identifier (ORD-XXXXXX)
- `customerId`: Customer identifier (CUST-XXXXX)
- `customerName`: Full customer name
- `orderDate`: ISO 8601 timestamp
- `location`: Object with city and state
- `items`: Array of order items with product details, quantities, and prices
- `orderValue`: Total order value
- `status`: Order status (pending, processing, shipped, delivered, cancelled)
- `shippingAddress`: Complete shipping address with street, city, state, and ZIP code

## Installation

1. Install dependencies:
```bash
npm install
```

2. Generate mock data:
```bash
npm run generate-data
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## MCP Server (GitHub Copilot Chat)

Use the MCP server to let Copilot Chat answer questions about orders (for example, "How many orders are cancelled?").

### Setup
```bash
cd mcp-server
npm install
```

### Run
```bash
npm start
```

### Configuration
- `ECOM_API_BASE` (optional): Override the API base URL (default: `http://localhost:3000/api`).

### Available tools
- `getOrderStats`: Returns total orders, revenue, average order value, counts by status, and top cities.
- `listOrders`: Lists orders with filters (`status`, `state`, `city`, `customerId`, `search`, `page`, `limit`).
- `getOrderById`: Returns a single order by ID (e.g., `ORD-123456`).

### Copilot Chat usage
Add the MCP server to Copilot Chat, then ask questions like:
- "How many orders are cancelled?"
- "List shipped orders in TX, first 10."
- "Show details for order ORD-123456."

## API Endpoints

### Get All Orders
```
GET /api/orders
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `state`: Filter by state
- `city`: Filter by city
- `customerId`: Filter by customer ID
- `search`: Search by customer name or order ID

### Get Single Order
```
GET /api/orders/:id
```

### Get Statistics
```
GET /api/stats
```

### Health Check
```
GET /api/health
```

## Project Structure

```
.
├── data/
│   └── orders.json          # Generated mock orders
├── public/
│   ├── index.html          # Frontend HTML
│   ├── styles.css          # Frontend styles
│   └── app.js              # Frontend JavaScript
├── generateData.js         # Mock data generation script
├── server.js               # Express API server
├── package.json            # Project dependencies
└── README.md              # This file
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Data Storage**: JSON file
- **Styling**: Custom CSS with gradient backgrounds and animations

## Development

To regenerate orders with different data:
```bash
npm run generate-data
npm start
```

The server will automatically reload the new data.

## License

MIT
