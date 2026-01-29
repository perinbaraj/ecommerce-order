# MCP + GitHub Copilot Integration Flow

## 🎯 Interactive Diagram

```mermaid
graph TD
    A["💬 Copilot Chat User Query"] -->|User asks question| B["🤖 Copilot parses intent<br/>Understands question context"]
    B -->|Identifies tool needed| C["🛠️ Selects MCP Tool<br/>getOrderStats<br/>listOrders<br/>getOrderById"]
    C -->|Connects via| D["📡 MCP Server<br/>stdio transport"]
    D -->|Makes HTTP calls| E["🖥️ Calls Backend API<br/>GET /api/orders<br/>GET /api/stats"]
    E -->|Reads data| F["📄 orders.json retrieved<br/>& processed"]
    F -->|Transform data| G["📦 JSON formatted response"]
    G -->|Returns result| D
    D -->|Sends response| H["💬 MCP Server returns<br/>to Copilot"]
    H -->|Formats answer| I["✨ Copilot displays<br/>natural language answer"]
    I -->|User reads| J["👤 User sees response"]
    
    style A fill:#e91e63,stroke:#ad1457,stroke-width:2px,color:#fff
    style B fill:#9c27b0,stroke:#6a1b9a,stroke-width:2px,color:#fff
    style C fill:#673ab7,stroke:#4527a0,stroke-width:2px,color:#fff
    style D fill:#3f51b5,stroke:#283593,stroke-width:2px,color:#fff
    style E fill:#2196f3,stroke:#1565c0,stroke-width:2px,color:#fff
    style F fill:#00bcd4,stroke:#00838f,stroke-width:2px,color:#fff
    style G fill:#009688,stroke:#004d40,stroke-width:2px,color:#fff
    style H fill:#4caf50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style I fill:#8bc34a,stroke:#558b2f,stroke-width:2px,color:#fff
    style J fill:#cddc39,stroke:#9e9d24,stroke-width:2px,color:#000
```

## 📋 Flow Steps

| # | Component | Action |
|---|-----------|--------|
| 1 | 💬 Copilot Chat | User asks a question about orders |
| 2 | 🤖 Copilot Parser | Copilot analyzes intent and context |
| 3 | 🛠️ Tool Selection | Selects appropriate MCP tool: `getOrderStats`, `listOrders`, or `getOrderById` |
| 4 | 📡 MCP Server | Connects via stdio transport to MCP server |
| 5 | 🖥️ Backend API | Makes HTTP calls to Express backend endpoints |
| 6 | 📄 Data Retrieval | Reads and processes orders from `orders.json` |
| 7 | 📦 Format Response | Transforms data into JSON format |
| 8 | 🔄 Return to MCP | MCP server receives and returns response |
| 9 | ✨ Format Answer | Copilot formats response as natural language |
| 10 | 👤 User Sees Answer | User reads the formatted response in chat |

## 📊 Text Flow

```
Copilot Chat User Query
    ↓
Copilot parses intent
    ↓
Selects MCP Tool (getOrderStats, listOrders, getOrderById)
    ↓
MCP Server (stdio transport)
    ↓
Calls Backend API HTTP endpoints
    ↓
orders.json retrieved & processed
    ↓
JSON formatted response
    ↓
MCP Server returns to Copilot
    ↓
Copilot displays natural language answer
```

## 🔑 MCP Tools Available

| Tool | Purpose | Example |
|------|---------|---------|
| `getOrderStats` | Get aggregate statistics | Total orders, pending count, revenue |
| `listOrders` | List orders with filters | Find orders by status, city, state |
| `getOrderById` | Get single order details | Fetch specific order information |