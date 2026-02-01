# 🚀 Quick Start - Deploy in 5 Minutes

## Fastest Way: Railway (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect and start building

### Step 3: Add Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway automatically creates `DATABASE_URL` environment variable

### Step 4: Run Migrations

1. Click on your web service
2. Go to **"Settings"** → **"Deploy"**
3. Add a deploy hook or use the terminal:
   ```bash
   npm run db:push
   ```

### Step 5: Get Your URL

Railway gives you a public URL like: `https://your-app.railway.app`

**Done!** 🎉 Your app is live!

---

## Alternative: Render (Also Free)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. **New** → **PostgreSQL** (create database first)
4. **New** → **Web Service** (connect your repo)
5. Set:
   - Build: `npm run build`
   - Start: `npm start`
   - Add `DATABASE_URL` from your database
6. Deploy!

---

## Environment Variables Needed

- `DATABASE_URL` - PostgreSQL connection string (auto-set by Railway/Render)
- `PORT` - Server port (auto-set, defaults to 5000)
- `NODE_ENV=production` - Environment mode

---

## Test Your Deployment

1. Visit your app URL
2. Create a confession link
3. Share the link (format: `your-url.com/v/abc123`)
4. Test the confession viewer page

---

## Need Help?

Check `DEPLOYMENT.md` for detailed instructions and troubleshooting.
