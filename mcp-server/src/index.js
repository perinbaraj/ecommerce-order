import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fetch from "node-fetch";
import { z } from "zod";

const API_BASE = process.env.ECOM_API_BASE || "http://localhost:3000/api";
const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const server = new McpServer({
  name: "ecommerce-orders-mcp",
  version: "0.1.0"
});

const listOrdersSchema = z.object({
  status: z.enum(STATUSES).optional(),
  state: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  customerId: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional()
});

server.registerTool(
  "getOrderStats",
  {
    description: "Get aggregate order statistics (counts, revenue, averages, status counts, top cities).",
    inputSchema: z.object({})
  },
  async () => {
    const stats = await getOrderStats();
    return textContent(stats);
  }
);

server.registerTool(
  "listOrders",
  {
    description: "List orders with optional filters and pagination.",
    inputSchema: listOrdersSchema
  },
  async (args) => {
    const list = await listOrders(args);
    return textContent(list);
  }
);

server.registerTool(
  "getOrderById",
  {
    description: "Fetch a single order by its id (e.g., ORD-123456).",
    inputSchema: z.object({
      id: z.string()
    })
  },
  async ({ id }) => {
    const order = await getOrderById(id);
    return textContent(order);
  }
);

await server.connect(new StdioServerTransport());

async function getOrderStats() {
  const res = await fetchJson("/stats");
  if (!res.success) {
    throw new Error(res.error || "Failed to fetch stats");
  }
  return res.data;
}

async function listOrders(args) {
  const searchParams = new URLSearchParams();
  if (args.status) searchParams.set("status", args.status);
  if (args.state) searchParams.set("state", args.state);
  if (args.city) searchParams.set("city", args.city);
  if (args.customerId) searchParams.set("customerId", args.customerId);
  if (args.search) searchParams.set("search", args.search);
  if (args.page) searchParams.set("page", String(args.page));
  if (args.limit) searchParams.set("limit", String(args.limit));

  const res = await fetchJson(`/orders?${searchParams.toString()}`);
  if (!res.success) {
    throw new Error(res.error || "Failed to fetch orders");
  }
  return {
    total: res.total,
    page: res.page,
    limit: res.limit,
    totalPages: res.totalPages,
    data: res.data
  };
}

async function getOrderById(id) {
  const res = await fetchJson(`/orders/${encodeURIComponent(id)}`);
  if (!res.success) {
    throw new Error(res.error || "Failed to fetch order");
  }
  return res.data;
}

async function fetchJson(pathname) {
  const url = `${API_BASE}${pathname}`;
  const response = await fetch(url);
  if (!response.ok) {
    const message = `HTTP ${response.status} for ${url}`;
    throw new Error(message);
  }
  return response.json();
}

function textContent(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2)
      }
    ]
  };
}

function errorContent(message) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: message
      }
    ]
  };
}
