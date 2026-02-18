const Fastify = require("fastify");
const websocket = require("fastify-websocket");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = Fastify({ logger: true });
app.register(websocket);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// --- Basic auth (MVP) ---
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

// --- Nodes registry (MVP in-memory; move to DB next) ---
const nodes = new Map(); // nodeId -> { url, token, lastSeen }

app.post("/nodes/register", async (req, reply) => {
  // node sends: { nodeId, url, token }
  const { nodeId, url, token } = req.body || {};
  if (!nodeId || !url || !token) return reply.code(400).send({ error: "missing" });
  nodes.set(nodeId, { url, token, lastSeen: new Date().toISOString() });
  return { ok: true };
});

app.get("/nodes", async (req, reply) => {
  requireAuth(req, reply);
  return {
    nodes: [...nodes.entries()].map(([id, v]) => ({
      id,
      url: v.url,
      lastSeen: v.lastSeen
    }))
  };
});

app.get("/health", async () => ({ ok: true }));

// --- WebSocket placeholder (console streaming later) ---
app.get("/ws/console", { websocket: true }, (conn, req) => {
  conn.socket.send(JSON.stringify({ msg: "console ws connected (wire node streams next)" }));
});

app.listen({ port: 4000, host: "0.0.0.0" }).catch((e) => {
  app.log.error(e);
  process.exit(1);
});
