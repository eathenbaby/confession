# 💘 Valentine Confession App

A viral Valentine confession website where users create shareable confession links and send them to their crushes. Features an interactive "Will You Be My Valentine?" page with a running NO button and growing YES button.

## Features

- 🎯 Create unique confession links
- 💕 Interactive Valentine proposal page
- 🏃 NO button that runs away on hover
- 📈 YES button that grows bigger
- 🎉 Confetti celebration on acceptance
- 🎁 Virtual gift options (monetization layer)
- 📱 Mobile-first design

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion

## Quick Start

### Local Development

1. **Clone and install**:
   ```bash
   npm install
   ```

2. **Set up database**:
   - Create a PostgreSQL database
   - Set `DATABASE_URL` in `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/dbname
     ```

3. **Run migrations**:
   ```bash
   npm run db:push
   ```

4. **Start dev server**:
   ```bash
   npm run dev
   ```

5. **Open**: http://localhost:5000

## Deployment

### 🚀 Deploy for Free

**👉 NEW TO WEB DEVELOPMENT?** Start here: **[START_HERE.md](./START_HERE.md)**

**For Complete Beginners:**
- **[BEGINNER_GUIDE.md](./BEGINNER_GUIDE.md)** - Step-by-step guide with zero technical knowledge needed

**For Quick Deployment:**
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute deployment guide

**For Detailed Options:**
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete guide with multiple platforms

**Recommended platforms:**
- **Railway** - Easiest, includes PostgreSQL (best for beginners!)
- **Render** - Free tier with auto-deploy
- **Fly.io** - More control, persistent storage

## Project Structure

```
Asset-Manager/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── hooks/
├── server/          # Express backend
│   ├── index.ts     # Main server
│   ├── routes.ts    # API routes
│   └── storage.ts   # Database layer
├── shared/          # Shared types/schemas
└── script/          # Build scripts
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Run database migrations
- `npm run check` - Type check

## Environment Variables

```env
DATABASE_URL=postgresql://...
PORT=5000
NODE_ENV=production
```

## License

MIT
