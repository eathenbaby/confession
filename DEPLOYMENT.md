# Deployment Guide - Free Hosting Options

This guide covers deploying your Valentine Confession app for free using various platforms.

## Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Database** - PostgreSQL (free tiers available)
3. **Environment Variables** - `DATABASE_URL` and `PORT`

---

## Option 1: Railway (Recommended - Easiest) 🚂

Railway offers free tier with PostgreSQL included.

### Steps:

1. **Sign up**: Go to [railway.app](https://railway.app) and sign up with GitHub

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select this repository

3. **Add PostgreSQL Database**:
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` environment variable

4. **Configure Environment Variables**:
   - Go to your service → "Variables"
   - Add: `PORT=5000` (or Railway will auto-assign)
   - `DATABASE_URL` is already set by Railway

5. **Deploy**:
   - Railway auto-detects Node.js
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Railway will automatically deploy

6. **Run Database Migrations**:
   - In Railway, open your service terminal
   - Run: `npm run db:push`

**Free Tier**: $5 credit/month (usually enough for small apps)

---

## Option 2: Render 🎨

Render offers free tier with PostgreSQL.

### Steps:

1. **Sign up**: Go to [render.com](https://render.com) and sign up with GitHub

2. **Create PostgreSQL Database**:
   - Click "New +" → "PostgreSQL"
   - Name it (e.g., "valentine-db")
   - Select free tier
   - Copy the "Internal Database URL"

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Environment**: `Node`
   - Add Environment Variables:
     - `DATABASE_URL`: (from step 2)
     - `NODE_ENV`: `production`
     - `PORT`: (Render auto-assigns, but you can set it)

4. **Run Migrations**:
   - After first deploy, go to "Shell" in Render dashboard
   - Run: `npm run db:push`

**Free Tier**: Free tier available (spins down after inactivity)

---

## Option 3: Fly.io ✈️

Fly.io offers free tier with persistent storage.

### Steps:

1. **Install Fly CLI**:
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Sign up**: Go to [fly.io](https://fly.io) and sign up

3. **Login**:
   ```bash
   fly auth login
   ```

4. **Create App**:
   ```bash
   fly launch
   ```
   - Follow prompts
   - Don't deploy yet (we need database first)

5. **Add PostgreSQL**:
   ```bash
   fly postgres create --name valentine-db
   fly postgres attach valentine-db
   ```

6. **Deploy**:
   ```bash
   fly deploy
   ```

7. **Run Migrations**:
   ```bash
   fly ssh console
   npm run db:push
   ```

**Free Tier**: 3 shared-cpu VMs, 3GB storage

---

## Option 4: Vercel + Supabase (Frontend + Backend Split)

If you want to split frontend/backend:

1. **Deploy Backend to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Vercel will auto-detect and deploy

2. **Use Supabase for Database**:
   - Go to [supabase.com](https://supabase.com)
   - Create free project
   - Get connection string
   - Add as `DATABASE_URL` in Vercel

---

## Environment Variables Setup

Create a `.env` file locally (don't commit this):

```env
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
NODE_ENV=production
```

**Important**: Never commit `.env` files to GitHub!

---

## Database Setup

After deployment, run migrations:

```bash
npm run db:push
```

This creates the `confessions` table in your database.

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables set correctly
- [ ] App accessible via public URL
- [ ] Test creating a confession link
- [ ] Test viewing a confession
- [ ] Check logs for errors

---

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is running (not sleeping on free tier)
- Ensure database allows connections from your host

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### Port Issues
- Most platforms auto-assign PORT
- Don't hardcode port numbers
- Use `process.env.PORT || 5000`

---

## Cost Comparison

| Platform | Free Tier | Database Included | Best For |
|----------|-----------|-------------------|----------|
| Railway  | $5/month credit | ✅ Yes | Easiest setup |
| Render   | Free (sleeps) | ✅ Yes | Simple deployment |
| Fly.io   | 3 VMs free | ✅ Yes | More control |
| Vercel   | Free | ❌ No (use Supabase) | Frontend focus |

---

## Recommended: Railway

For this project, **Railway is recommended** because:
- ✅ Easiest setup
- ✅ PostgreSQL included
- ✅ Auto-deploys from GitHub
- ✅ Good free tier
- ✅ Simple environment variable management

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Fly.io Docs: https://fly.io/docs
