# Custom Hosting Panel (Node.js) — Panel + Multi-Node Daemon

This repository is a **starter skeleton** for a hosting-company style game panel:
- **Panel**: Web UI + API + Postgres + Redis (Docker Compose)
- **Daemon**: Node agent installed on each game node that controls Docker containers

> This is an MVP scaffold designed to be extended into full multi-game support (Paper/Forge/Fabric/NeoForge, Rust, Satisfactory, bots, etc.) using a **Template/Egg system**.

---

## Prereqs
- Ubuntu 22.04/24.04 recommended
- Node.js **20+** (for local development)
- Docker + Docker Compose plugin

---

## Quick start (Panel VPS)
1. Copy repo to your panel VPS.
2. Edit secrets:
   - `infra/.env` (recommended) or environment variables in `infra/docker-compose.yml`
3. Start stack:
```bash
cd infra
docker compose up -d
docker compose logs -f nginx
```

Open:
- `http://YOUR_PANEL_IP/` (Web UI)
- `http://YOUR_PANEL_IP/api/health` (API)

---

## Quick start (Game Node)
On each node (Ubuntu):
- Install Docker
- Run daemon with environment variables:
```bash
cd apps/daemon
npm install
export NODE_ID="node-1"
export NODE_TOKEN="super_secret_node_token"
export PANEL_URL="http://PANEL_IP"
export PUBLIC_DAEMON_URL="http://NODE_PUBLIC_IP:8443"
npm run start
```

Lock down daemon port to panel only (example with UFW):
```bash
sudo ufw allow 22
sudo ufw allow from PANEL_IP to any port 8443
sudo ufw enable
```

---

## Notes
- The Web UI is intentionally minimal and clean (Next.js + Tailwind).
- The API is Fastify-based and currently stores nodes in-memory (move to DB next).
- The daemon demonstrates container start/stop for a **Paper** template using `itzg/minecraft-server`.
- Next steps: add **Template/Egg system**, server allocations, file access (SFTP), console streaming from containers, backups, users/plans, etc.
