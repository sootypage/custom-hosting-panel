# Custom Hosting Panel (Node.js) — Panel + Multi-Node Daemon

This repository is a **starter skeleton** for a hosting-company style game panel:
- **Panel**: Web UI + API + Postgres + Redis (**Docker Compose**)
- **Daemon**: Node agent installed on each game node that controls Docker containers

---

## Super easy install (Panel VPS)
```bash
git clone https://github.com/sootypage/custom-hosting-panel.git
cd custom-hosting-panel

# (optional) installs Docker + Node 20
chmod +x install.sh
./install.sh

# installs repo deps (workspaces)
npm run install:all

# builds + starts web/api + db
npm run start
npm run logs
```

Open:
- Web UI: `http://YOUR_PANEL_IP:3000`
- API: `http://YOUR_PANEL_IP:4000/health`

> If you want everything on **port 80**, put Nginx/Caddy in front later (or use the included `infra/` example).

---

## Game Node daemon (each node)
```bash
cd apps/daemon
npm install

export NODE_ID="node-1"
export NODE_TOKEN="super_secret_node_token"
export PANEL_URL="http://PANEL_IP:4000"          # NOTE: direct to API port for now
export PUBLIC_DAEMON_URL="http://NODE_IP:8443"

npm run start
```

Lock down daemon port to panel only (UFW):
```bash
sudo ufw allow 22
sudo ufw allow from PANEL_IP to any port 8443
sudo ufw enable
```

---

## Notes
- The daemon currently demos starting a **Minecraft Paper** container using `itzg/minecraft-server`.
- Next step is a proper **Template/Egg system** to support Paper/Forge/Fabric/NeoForge, Rust, Satisfactory, Discord bots, etc.


## Uninstall (remove panel from VPS)

From the repo folder on your VPS:

```bash
cd ~/custom-hosting-panel
chmod +x uninstall.sh
./uninstall.sh
```

The script will:
- stop/remove containers
- optionally remove volumes (database data)
- optionally remove images
- optionally delete the repo folder (uses sudo if needed)


### Next.js build note
This repo uses ESM for the web app. PostCSS config is provided as `postcss.config.cjs` to avoid ESM `module is not defined` build errors.
