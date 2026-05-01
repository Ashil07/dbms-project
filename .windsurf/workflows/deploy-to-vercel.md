---
description: Step-by-step guide to deploy the Cloth Rental app frontend to Vercel and backend to Render
---

# Deploy Cloth Rental App

This app has two parts: a React frontend (`client/`) and a Node.js/Express backend with Prisma + PostgreSQL.

## Architecture
- **Frontend (Vercel)**: Static React SPA built with Vite
- **Backend (Render/Railway)**: Node.js API server + PostgreSQL database

---

## Step 1 — Prepare the Backend for Deployment

### 1.1 Choose a PostgreSQL host
You need a live PostgreSQL database. Options:
- **Neon** (neon.tech) — free tier, serverless Postgres
- **Supabase** (supabase.com) — free tier
- **Render** — can provision Postgres alongside your app

Create a database and copy the connection string (`DATABASE_URL`).

### 1.2 Create environment variables for production
Your backend needs these env vars at minimum:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-super-secret-jwt-key"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NODE_ENV="production"
PORT=3000
```

### 1.3 Add a start script (already exists)
`package.json` already has `"start": "node server.js"` which is what Render/Railway will use.

### 1.4 Update CORS for production
In `server.js`, change the CORS origin from localhost to your deployed frontend URL:

```js
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
```

### 1.5 Add a `vercel.json` if deploying backend to Vercel (serverless)
Skip this if using Render/Railway. If you want the backend on Vercel too, convert Express to Vercel serverless functions (advanced — not covered here).

---

## Step 2 — Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `cloth-rental-api`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma migrate deploy && npx prisma generate`
   - **Start Command**: `node server.js`
5. Add all environment variables from Step 1.2
6. Click **Create Web Service**
7. Copy the deployed URL (e.g. `https://cloth-rental-api.onrender.com`)

> **Note**: Render free tier spins down after inactivity. First request may take 30-60s to wake up.

---

## Step 3 — Prepare Frontend for Vercel

### 3.1 Update the API base URL
In `client/src/api/axios.js`, change the `baseURL` to point to your deployed backend:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})
```

### 3.2 Create `client/.env.production`

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Replace with your actual Render backend URL + `/api`.

### 3.3 Configure `vite.config.js` for production

Make sure `client/vite.config.js` has the base path set correctly:

```js
export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

---

## Step 4 — Deploy Frontend to Vercel

### Option A: Vercel CLI (Recommended for full control)

1. Install Vercel CLI: `npm i -g vercel`
2. In the project root, run:
   ```bash
   vercel --prod
   ```
3. During setup:
   - Set **Root Directory** to `client/`
   - Set **Build Command** to `npm run build`
   - Set **Output Directory** to `dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`

### Option B: Vercel Dashboard (Easier)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New Project**
3. Import your GitHub repo
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
6. Click **Deploy**

---

## Step 5 — Verify Everything

1. Open your Vercel frontend URL
2. Check the browser Network tab — API calls should hit your Render backend
3. Test login/signup and core flows
4. If CORS errors appear, double-check `CLIENT_URL` in backend env matches your Vercel domain exactly

---

## Quick Reference: Environment Variables

| Service | Variable | Value |
|---------|----------|-------|
| Render (backend) | `DATABASE_URL` | PostgreSQL connection string |
| Render (backend) | `JWT_SECRET` | Strong random string |
| Render (backend) | `CLIENT_URL` | Your Vercel frontend URL |
| Render (backend) | `CLOUDINARY_*` | Your Cloudinary credentials |
| Vercel (frontend) | `VITE_API_URL` | Your Render backend URL + `/api` |
