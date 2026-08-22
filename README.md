# Sri Shanmuga Grand Crackers — E-Commerce

Full-stack e-commerce web application for **Sri Shanmuga Grand Crackers**, a fireworks shop based in Sivakasi, Tamil Nadu.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js 18+, Express 4 |
| Database | MongoDB 6+/7 (local or Atlas) |
| Auth | JWT (admin-only login), bcryptjs |
| Payments | Google Pay / UPI (manual verification) |
| Process Manager | PM2 |
| Reverse Proxy | Nginx |

## How It Works in Production (Single Server)

```
Browser ──> yourdomain.com (Nginx :80/:443)
                 │
                 ▼
          Express (PM2, :5000)
                 ├── serves React build  →  client/dist
                 ├── serves product images →  server/uploads
                 └── REST API            →  /api/*
                 │
                 ▼
             MongoDB (Atlas or local)
```

The Express server serves **both** the API and the built frontend from one port — only one PM2 process is needed.

---

# GO-LIVE CHECKLIST

You already have: ✅ Domain purchased ✅ VPS/server purchased.
Do the following steps **in order**.

| # | Task | Status |
|---|------|--------|
| 0 | Point domain DNS to server IP | ⬜ |
| 1 | Update server + install Node.js | ⬜ |
| 2 | Set up MongoDB (Atlas or local) | ⬜ |
| 3 | Clone repo onto server | ⬜ |
| 4 | Install dependencies | ⬜ |
| 5 | Create `.env` files with real values | ⬜ |
| 6 | Build client + seed DB (`npm run deploy:fresh`) | ⬜ |
| 7 | Start app with PM2 | ⬜ |
| 8 | Configure Nginx reverse proxy | ⬜ |
| 9 | Enable HTTPS with Certbot | ⬜ |
| 10 | Enable firewall (UFW) | ⬜ |
| 11 | Verify site + admin login + test order | ⬜ |

---

## Step 0: Point the Domain to Your Server

In your registrar's DNS panel (GoDaddy / Namecheap / Cloudflare):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | `@` | YOUR.SERVER.IP.ADDRESS | 300 |
| A | `www` | YOUR.SERVER.IP.ADDRESS | 300 |

Wait 5–10 minutes, then verify:

```bash
ping yourdomain.com    # should return your server IP
```

> SSH into the server first: `ssh root@YOUR.SERVER.IP` (password/key given by your hosting provider).

---

## Step 1: Update Server & Install Node.js

```bash
sudo apt update && sudo apt upgrade -y

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs git

node -v && npm -v   # verify v18+
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended — free tier, managed backups)

1. https://www.mongodb.com/atlas → create free **M0 Sandbox** cluster.
2. **Database Access** → create DB username + password.
3. **Network Access** → allow your server's IP.
4. Copy connection string:
   ```
   mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/shanmuga-crackers?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB on the VPS

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl enable --now mongod
sudo systemctl status mongod    # must be active (running)
```

Local URI: `mongodb://127.0.0.1:27017/shanmuga-crackers`

## Step 3–4: Clone & Install

```bash
cd /var/www
sudo git clone <your-repo-url> shanmuga-crackers
sudo chown -R $USER:$USER shanmuga-crackers
cd shanmuga-crackers

npm install            # root (concurrently)
npm run install:all    # server + client deps
```

## Step 5: Environment Files (most important step)

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
nano server/.env
```

Fill with **real production values**:

```env
PORT=5000
MONGODB_URI=<your Atlas or local URI>
JWT_SECRET=<run: openssl rand -hex 64>
ADMIN_EMAIL=admin@shanmuga.com
ADMIN_PASSWORD=<strong password>
MIN_ORDER_AMOUNT=2500
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

```bash
nano client/.env
```

```env
VITE_GPAY_NUMBER=7904968103
```

⚠️ **Production safety:** seeding refuses to run if `ADMIN_PASSWORD` is empty or still `change-this-admin-password`.

⚠️ `CORS_ORIGINS` must exactly match your live domain(s), including `https://`.

## Step 6: Build Client + Seed Database

```bash
npm run deploy:fresh
```

This wipes leftover test data, builds the React app into `client/dist`, and seeds the admin user + categories (no sample products in production).

Expected output ends with:

```
Admin user created (admin@shanmuga.com)
Seeded categories
Production mode — skipping test product seeding
Seed complete
```

## Step 7: Start With PM2

```bash
sudo npm install -g pm2
cd /var/www/shanmuga-crackers/server
pm2 start index.js --name shanmuga-server
pm2 save
pm2 startup    # copy & run the command it prints
pm2 status     # shanmuga-server must be "online"
```

Logs: `pm2 logs shanmuga-server`

## Step 8: Nginx Reverse Proxy

```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo nano /etc/nginx/sites-available/shanmuga
```

Paste (replace `yourdomain.com`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Product image uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/shanmuga /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t                   # must pass
sudo systemctl restart nginx
```

Site now loads on **http://yourdomain.com**.

## Step 9: Free HTTPS (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- Choose **Redirect (option 2)** when asked about HTTP → HTTPS.
- Auto-renewal check: `sudo certbot renew --dry-run`

## Step 10: Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## Step 11: Final Verification

1. Open **https://yourdomain.com** → homepage loads with lock icon 🔒
2. Browse categories, add to cart, place one test order.
3. Admin login at **https://yourdomain.com/admin/login**
   - Email: value of `ADMIN_EMAIL`
   - Password: your `ADMIN_PASSWORD`
4. Add real products via **Products → Add Product** (image upload included).
5. Confirm GPay number/QR shows correctly at checkout.

---

## Redeploying After Code Updates

```bash
cd /var/www/shanmuga-crackers
git pull origin main
npm run build
pm2 restart shanmuga-server
```

⚠️ Full clean redeploy (**wipes all products/orders/users**, keeps admin + categories):

```bash
npm run deploy:fresh
pm2 restart shanmuga-server
```

---

# Local Development Setup

## Prerequisites

- Node.js 18+, MongoDB Community Server (local), Git

```bash
npm install            # root
npm run install:all    # server + client
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run seed           # admin + categories + sample products
npm run dev            # client :3000, server :5000
```

- Storefront: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

## Available Scripts (root)

| Command | Description |
|---------|-------------|
| `npm run dev` | Client (:3000) + server (:5000) together |
| `npm run build` | Build client → `client/dist` |
| `npm start` | Start production server (serves built client) |
| `npm run seed` | Create admin + categories (+ test data only in dev) |
| `npm run cleanup` | Delete all products/orders/users/reviews (keeps admin + categories) |
| `npm run deploy:fresh` | Cleanup + build + production seed |
| `npm run test` | Run server + client tests |

---

# Troubleshooting

| Problem | Fix |
|---------|-----|
| `Missing required environment variable: MONGODB_URI / JWT_SECRET` | Check `server/.env` has real values (Step 5) |
| `MongoDB connection failed` | Local: `systemctl status mongod`. Atlas: check user/IP allowlist/URI |
| `502 Bad Gateway` | `pm2 status` → restart or re-start process |
| Site loads but no data / CORS errors | `CORS_ORIGINS` must include exact `https://yourdomain.com` |
| Products not saving | `pm2 logs shanmuga-server --lines 50` |
| SSL expired | `sudo certbot renew && sudo systemctl restart nginx` |
| Forgot admin password | Reset in DB directly, or delete admin document and rerun seed |
| DNS not resolving | Wait 10 min, flush local cache, verify A records (Step 0) |

# Quick Reference

```bash
pm2 status                        # server health
pm2 logs shanmuga-server          # live logs
pm2 restart shanmuga-server       # after code changes
sudo systemctl restart nginx      # after nginx changes
npm run build                     # rebuild frontend
npm run deploy:fresh              # clean DB + rebuild + reseed
```

---

## License

Private — Sri Shanmuga Grand Crackers
