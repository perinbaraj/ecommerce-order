# E-Commerce Dashboard Flow

## 🎯 Interactive Diagram

```mermaid
graph TD
    A["👤 User Browser"] -->|Loads| B["⚙️ app.js<br/>loadOrders, displayOrders,<br/>setupEventListeners"]
    B -->|HTTP Requests| C["📡 Fetch API Calls<br/>XMLHttpRequest/fetch"]
    C -->|GET /api/orders<br/>GET /api/stats| D["🖥️ Express Server Routes<br/>/api/orders | /api/stats"]
    D -->|Process| E["🔍 Filter & Search Logic<br/>Status • Date • Search<br/>Sorting • Pagination"]
    E -->|Read Data| F["📄 orders.json<br/>read from disk"]
    F -->|Parse Data| E
    E -->|Return JSON| D
    D -->|Response| C
    C -->|Parse & Process| B
    B -->|Update| G["🎨 DOM Updates<br/>Render Grid • Cards<br/>Statistics • Status Badges"]
    G -->|Display| H["📊 User sees Dashboard"]
    
    style A fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    style B fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style C fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style D fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style E fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style F fill:#e0f2f1,stroke:#004d40,stroke-width:2px
    style G fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    style H fill:#c8e6c9,stroke:#1b5e20,stroke-width:3px
```

## 📋 Flow Steps

| # | Component | Action |
|---|-----------|--------|
| 1 | 👤 User Browser | User loads the dashboard in browser |
| 2 | ⚙️ app.js | Frontend initializes: `loadOrders()`, `displayOrders()`, `setupEventListeners()` |
| 3 | 📡 Fetch API | Makes HTTP GET requests via `XMLHttpRequest` or `fetch()` |
| 4 | 🖥️ Express Routes | Backend processes requests on `/api/orders` and `/api/stats` |
| 5 | 🔍 Filter Logic | Applies filters, search terms, sorting, and pagination |
| 6 | 📄 orders.json | Reads and retrieves order data from disk |
| 7 | 📡 Response | Returns filtered JSON response back to frontend |
| 8 | 🎨 DOM Updates | Updates page elements: grid, cards, statistics |
| 9 | 📊 Dashboard | User sees complete dashboard with all orders ✓ |

## 📊 Text Flow

```
User Browser
    ↓
app.js (loadOrders, displayOrders, setupEventListeners)
    ↓
Fetch API Calls (XMLHttpRequest/fetch)
    ↓
Express Server Routes (/api/orders, /api/stats)
    ↓
Filter & Search Logic
    ↓
orders.json (read from disk)
    ↓
JSON Response back to Frontend
    ↓
DOM Updates → User sees Dashboard
```