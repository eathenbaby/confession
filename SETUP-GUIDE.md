# 🚀 STEP-BY-STEP SETUP GUIDE

## 📋 What You Need to Do (in order)

### **Step 1: Get Razorpay Account (5 minutes)**
1. Go to https://razorpay.com/signup
2. Create account → Dashboard → Settings → API Keys
3. Generate Test Keys (copy Key ID and Key Secret)

### **Step 2: Deploy to Vercel (2 minutes)**
1. Go to https://vercel.com
2. Click "Add New..." → "Project" → "Import Git Repository"
3. Connect your GitHub: `https://github.com/eathenbaby/valentine`
4. Vercel will automatically detect it's a Next.js app
5. Click "Deploy"

### **Step 3: Set Up Environment Variables in Vercel (2 minutes)**
1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```bash
# Essential
NODE_ENV=production
SESSION_SECRET=your-super-secret-here-12345

# Razorpay (from Step 1)
RAZORPAY_KEY_ID=rzp_test_your-key-id-here
RAZORPAY_KEY_SECRET=your-key-secret-here
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret-here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your-key-id-here

# OAuth (we'll set these in Step 4)
INSTAGRAM_CLIENT_ID=coming-next-step
INSTAGRAM_CLIENT_SECRET=coming-next-step
GOOGLE_CLIENT_ID=coming-next-step
GOOGLE_CLIENT_SECRET=coming-next-step

# Vercel Specific
NEXT_PUBLIC_URL=https://your-app-name.vercel.app
```

### **Step 4: Get Instagram OAuth (10 minutes)**
1. Go to https://developers.facebook.com/
2. Create new app → Choose "Consumer" type
3. Add "Instagram Basic Display" product
4. In Instagram Basic Display settings:
   - Add redirect URI: `https://your-app-name.vercel.app/api/auth/instagram/callback`
   - Add your email for deactivation
5. Save and copy:
   - App ID → INSTAGRAM_CLIENT_ID
   - App Secret → INSTAGRAM_CLIENT_SECRET

### **Step 5: Get Google OAuth (10 minutes)**
1. Go to https://vercel.com (or https://console.cloud.google.com/)
2. Create new project or use existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: "Web application"
   - Name: "Confession Platform"
   - Add redirect URI: `https://your-app-name.vercel.app/api/auth/google/callback`
6. Create and copy:
   - Client ID → GOOGLE_CLIENT_ID
   - Client Secret → GOOGLE_CLIENT_SECRET

### **Step 6: Update Environment Variables (2 minutes)**
1. Go back to Vercel Dashboard → Environment Variables
2. Update the OAuth variables with the actual values from Steps 4 & 5
3. Vercel will automatically redeploy

### **Step 7: Test Your App (5 minutes)**
1. Wait for Vercel deployment (usually 2-3 minutes)
2. Visit: `https://your-app-name.vercel.app/`
3. Test:
   - Login buttons work
   - Can submit a confession
   - Can create a bouquet
   - Admin dashboard accessible

---

## 🔧 Vercel vs Railway - Key Differences

### **Vercel (Recommended for Next.js):**
✅ **Pros:**
- Built specifically for Next.js apps
- Automatic GitHub integration
- Better CDN and performance
- Automatic HTTPS and custom domains
- Built-in analytics and monitoring
- Free tier with generous limits
- Easy environment variable management
- Automatic deployments on git push

✅ **Features:**
- Edge functions support
- Serverless functions
- Automatic scaling
- Global CDN
- Preview deployments
- Custom domains support

### **Railway:**
❌ **Cons for this use case:**
- Not optimized for Next.js (better for Node.js/Express)
- More complex deployment process
- Limited free tier
- Manual SSL certificate management
- Less reliable scaling

---

## 🎯 Your Vercel URLs

After deployment, your app will be available at:
- **Main App:** `https://your-app-name.vercel.app/`
- **API:** `https://your-app-name.vercel.app/api/`
- **Admin:** `https://your-app-name.vercel.app/admin/`

## 📊 Updated Webhook URLs

Update your OAuth redirect URIs:
- **Instagram:** `https://your-app-name.vercel.app/api/auth/instagram/callback`
- **Google:** `https://your-app-name.vercel.app/api/auth/google/callback`
- **Razorpay:** `https://your-app-name.vercel.app/api/payments/webhook`

---

## 🚀 Quick Deploy Commands

If you prefer command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel --prod

# Set environment variables
vercel env add NODE_ENV=production
vercel env add SESSION_SECRET=your-secret
vercel env add RAZORPAY_KEY_ID=your-key
# ... add all variables
```

---

## 🎉 Benefits of Vercel

✅ **Better Performance:** Global CDN, edge caching  
✅ **Reliability:** 99.99% uptime SLA  
✅ **Scaling:** Automatic scaling to millions of users  
✅ **Security:** Free SSL, DDoS protection  
✅ **Analytics:** Built-in performance monitoring  
✅ **Cost:** More generous free tier than Railway  

---

## 📞 Need Help?

If you get stuck:
1. **Vercel Docs:** https://vercel.com/docs
2. **Next.js + Vercel Guide:** https://vercel.com/guides/deploying-nextjs
3. **Community Support:** https://vercel.com/help

**Your platform is now optimized for Vercel deployment!** 🚀

### **Step 6: Test the Platform (5 minutes)**
1. Open your app URL
2. Click "Login with Instagram" or "Login with Google"
3. Submit a test confession
4. Check if it appears in admin dashboard

---

## 🔧 If Something Goes Wrong

### **Problem: "Database error"**
**Solution:** The migration will fix this automatically when the server starts.

### **Problem: "OAuth redirect error"**
**Solution:** Make sure redirect URIs match exactly:
- Instagram: `https://valentine-app-production-99ad.up.railway.app/api/auth/instagram/callback`
- Google: `https://valentine-app-production-99ad.up.railway.app/api/auth/google/callback`

### **Problem: "Payment not working"**
**Solution:** Check Razorpay keys are correct and in test mode.

---

## 🎯 Quick Test Checklist

- [ ] App loads at your Railway URL
- [ ] Login buttons work (Instagram/Google)
- [ ] Can submit a confession
- [ ] Admin dashboard shows your confession
- [ ] Payment system creates orders

---

## 📞 Need Help?

If you get stuck on any step:
1. Check Railway logs for errors
2. Make sure all environment variables are set
3. Verify redirect URIs match exactly
4. Test with incognito browser window

---

## 🎉 Once Everything Works

Your platform is ready! You can:
1. Start accepting confessions
2. Post them to Instagram
3. Charge ₹30 for name reveals
4. Track revenue in admin dashboard

**Potential Revenue:** ₹30 × 10 reveals/day = ₹300/day = ₹9,000/month!
