const Fastify = require("fastify");
const websocket = require("fastify-websocket");
const cors = require("@fastify/cors");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const app = Fastify({ logger: true });
app.register(websocket);
app.register(cors, { origin: true });

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// --- Basic login (MVP) ---
app.post("/auth/login", async (req, reply) => {
  const { username, password } = req.body || {};
  if (username !== "admin" || password !== "admin") {
    return reply.code(401).send({ error: "bad login" });
  }
  const token = jwt.sign({ userId: 1, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  return { token };
});

function requireAuth(req, reply) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return reply.code(401).send({ error: "no token" });
  try { req.user = jwt.verify(t, JWT_SECRET); }
  catch { return reply.code(401).send({ error: "bad token" }); }
}

const nodes = new Map();
const servers = new Map();

function id8() {
  return Math.random().toString(16).slice(2, 10);
}

app.get("/nodes", async (req, reply) => {
  requireAuth(req, reply);
  return { nodes: [...nodes.entries()].map(([id, v]) => ({ id, url: v.url })) };
});

app.post("/nodes/register", async (req, reply) => {
  const { nodeId, url, token } = req.body || {};
  if (!nodeId || !url || !token) return reply.code(400).send({ error: "missing" });
  nodes.set(nodeId, { url, token });
  return { ok: true };
});

app.get("/servers", async (req, reply) => {
  requireAuth(req, reply);
  return { servers: [...servers.values()] };
});

app.post("/servers", async (req, reply) => {
  requireAuth(req, reply);
  const { name, nodeId, game, memoryMb, cpu, port } = req.body || {};
  if (!name || !nodeId || !game) return reply.code(400).send({ error: "missing fields" });
  if (!nodes.has(nodeId)) return reply.code(400).send({ error: "unknown node" });

  const id = id8();
  const rec = {
    id, name, nodeId, game,
    memoryMb: Number(memoryMb || 2048),
    cpu: Number(cpu || 1),
    port: Number(port || 25565),
    createdAt: new Date().toISOString()
  };
  servers.set(id, rec);
  return { server: rec };
});

app.get("/servers/:id", async (req, reply) => {
  requireAuth(req, reply);
  const s = servers.get(req.params.id);
  if (!s) return reply.code(404).send({ error: "not found" });
  return { server: s };
});

app.get("/health", async () => ({ ok: true }));

app.listen({ port: 4000, host: "0.0.0.0" });
