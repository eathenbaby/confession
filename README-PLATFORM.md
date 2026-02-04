# 💕 Anonymous Confession Platform with Monetization

A modern anonymous confession platform where users submit Valentine's confessions through verified identity (hidden from recipients), admins curate and post confessions to Instagram, and charge for name reveals.

**Business Model:** NGL + Bumble verification + monetized reveal system

---

## 🚀 Features

### Core Features
- ✅ **OAuth Authentication** (Instagram/Google) for verified identities
- ✅ **Multi-layer Name Validation** to prevent fake accounts
- ✅ **Confession Submission** with vibe selector (coffee date, dinner, etc.)
- ✅ **Admin Dashboard** for reviewing and managing confessions
- ✅ **Instagram Integration** with automatic image generation
- ✅ **Monetized Name Reveals** via Stripe payments ($30 per reveal)
- ✅ **Revenue Analytics** and payment tracking
- ✅ **Anti-fraud System** with validation scores

### Technical Stack
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Frontend:** React + TypeScript + Tailwind CSS
- **Authentication:** Passport.js (Instagram/Google OAuth)
- **Payments:** Stripe
- **Image Generation:** Canvas API
- **UI Components:** Shadcn/ui + Radix UI

---

## 📋 How It Works

### For Users
1. **Login** with Instagram or Google OAuth (verifies real identity)
2. **Select Vibe** (coffee date, dinner, study session, etc.)
3. **Write Confession** (anonymous message)
4. **Submit** - goes directly to admin dashboard
5. **Wait** for admin review and Instagram posting

### For Admins
1. **Review** confessions in admin dashboard
2. **Approve/Reject** based on content and validation scores
3. **Generate** Instagram graphics automatically
4. **Post** to Instagram manually or via API
5. **Handle** reveal requests and payments
6. **Track** revenue and analytics

### Monetization Flow
1. Someone sees confession on Instagram
2. DMs asking "who sent this?"
3. Admin sends payment link ($30)
4. User pays via Stripe
5. Admin reveals sender's identity via DM
6. Revenue tracked in dashboard

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for sessions)
- Stripe account
- Instagram Developer account
- Google Cloud Console project

### 1. Clone and Install
```bash
git clone <repository-url>
cd confession-platform
npm install
```

### 2. Database Setup
```bash
# Create database
createdb confession_platform

# Run migrations
npm run db:push
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env
```

### 4. OAuth Setup

#### Instagram OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app → Instagram Basic Display
3. Add redirect URI: `http://localhost:5000/api/auth/instagram/callback`
4. Copy App ID and Secret to `.env`

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
5. Copy Client ID and Secret to `.env`

### 5. Stripe Setup
1. Create [Stripe account](https://stripe.com)
2. Get API keys from Dashboard → Developers
3. Set up webhook endpoint: `http://your-domain.com/api/payments/webhook`
4. Copy keys to `.env`

### 6. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5000`

---

## 📊 Database Schema

### Core Tables
- **users** - OAuth accounts and verified identities
- **confessions** - Anonymous confession submissions
- **reveal_requests** - Name reveal payment requests
- **payments** - Transaction tracking

### Key Features
- Auto-incrementing confession numbers
- Validation scores for anti-fraud
- Payment status tracking
- Admin notes and flags

---

## 🔧 API Endpoints

### Authentication
- `GET /api/auth/instagram` - Instagram OAuth
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/current-user` - Get current user
- `POST /api/auth/logout` - Logout

### Confessions
- `POST /api/confessions` - Submit confession (auth required)
- `GET /api/confessions/public` - Get public confessions
- `GET /api/confessions/my` - Get user's confessions
- `POST /api/confessions/:id/request-reveal` - Request name reveal

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/confessions` - Manage confessions
- `POST /api/admin/confessions/approve` - Approve confession
- `POST /api/admin/confessions/reject` - Reject confession
- `POST /api/admin/reveals/send` - Send name reveal

### Payments
- `POST /api/payments/create-reveal-link` - Create Stripe payment link
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/revenue-stats` - Revenue analytics

### Instagram
- `POST /api/instagram/generate-image` - Generate confession graphic
- `POST /api/instagram/generate-all-formats` - All image formats

---

## 🎨 Frontend Components

### Core Components
- **ConfessionForm** - Main submission form with vibe selector
- **AdminDashboard** - Complete admin interface
- **FloatingHearts** - Decorative animations
- **NameInput** - Real-time name validation

### UI Features
- Responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Modern components with Shadcn/ui
- Real-time form validation
- Loading states and error handling

---

## 💰 Monetization Details

### Pricing Model
- **Name Reveals:** $30 per reveal
- **Payment Methods:** Stripe (cards), PayPal (manual), Venmo (manual)
- **Revenue Split:** 100% to platform owner

### Payment Flow
1. User requests reveal via Instagram DM
2. Admin creates payment link
3. User pays $30 via Stripe
4. Admin receives confirmation
5. Admin reveals sender identity via DM
6. Transaction tracked in dashboard

### Revenue Tracking
- Total revenue dashboard
- Monthly revenue analytics
- Average revenue per reveal
- Payment success rates

---

## 🔒 Security Features

### Identity Verification
- OAuth login (Instagram/Google)
- Multi-layer name validation
- Validation scoring system
- Manual admin review

### Anti-Fraud System
- Pattern detection for fake names
- Profanity filtering
- Suspicious activity flagging
- IP-based rate limiting

### Data Protection
- Anonymous submissions
- Secure payment processing
- Session management
- GDPR compliance ready

---

## 📈 Analytics & Monitoring

### Built-in Analytics
- Confession submission rates
- Payment conversion rates
- User engagement metrics
- Revenue tracking

### Admin Dashboard
- Real-time statistics
- Confession management
- Payment overview
- User management

### Optional Integrations
- Google Analytics
- Sentry for error tracking
- Custom webhook integrations

---

## 🚀 Deployment

### Production Setup
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=production-secret
STRIPE_SECRET_KEY=sk_live_...
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Railway Deployment
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits
- Proper error handling

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

### Common Issues
- **OAuth not working:** Check redirect URIs in developer consoles
- **Database errors:** Verify DATABASE_URL and run migrations
- **Payment failures:** Check Stripe webhook configuration
- **Image generation:** Install canvas dependencies

### Getting Help
- Check GitHub Issues
- Review documentation
- Join Discord community
- Email support@example.com

---

## 🎯 Future Roadmap

### Phase 2 Features
- [ ] Instagram auto-posting API
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] A/B testing for pricing
- [ ] Multi-language support

### Phase 3 Features
- [ ] Video confessions
- [ ] Group confessions
- [ ] Subscription model
- [ ] API for third-party integrations
- [ ] Machine learning for content moderation

---

## 📊 Business Metrics

### Key Performance Indicators
- **Daily Active Users:** Target 100+
- **Confession Submission Rate:** Target 10/day
- **Payment Conversion Rate:** Target 15%
- **Monthly Revenue:** Target $1,500+
- **User Retention:** Target 60% monthly

### Growth Strategy
- Social media marketing
- Campus ambassador program
- Partnership with influencers
- Referral program
- Seasonal campaigns

---

**Built with ❤️ for anonymous confessions and modern dating culture**
