import express from 'express';
import passport from '../services/auth';
import { AuthService } from '../services/auth';

const router = express.Router();

// ============================================
// AUTHENTICATION ROUTES
// ============================================

/**
 * GET /api/auth/instagram
 * Redirect to Instagram OAuth
 */
router.get('/instagram', (req, res) => {
  const authUrl = AuthService.getInstagramAuthUrl();
  res.redirect(authUrl);
});

/**
 * GET /api/auth/instagram/callback
 * Instagram OAuth callback
 */
router.get('/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login?error=instagram_failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

/**
 * GET /api/auth/google
 * Redirect to Google OAuth
 */
router.get('/google', (req, res) => {
  const authUrl = AuthService.getGoogleAuthUrl();
  res.redirect(authUrl);
});

/**
 * GET /api/auth/google/callback
 * Google OAuth callback
 */
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

/**
 * GET /api/auth/current-user
 * Get current authenticated user
 */
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    const user = req.user as any;
    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      instagramUsername: user.instagramUsername,
      profilePicture: user.profilePicture,
      verified: user.verified,
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', (req, res) => {
  AuthService.logout(req, res);
});

/**
 * GET /api/auth/check
 * Check if user is authenticated
 */
router.get('/check', (req, res) => {
  res.json({
    authenticated: AuthService.isAuthenticated(req),
    user: AuthService.isAuthenticated(req) ? AuthService.getCurrentUser(req) : null,
  });
});

export default router;
