import passport from 'passport';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// ============================================
// OAUTH CONFIGURATION
// ============================================

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';

if (!INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET) {
  console.warn('Instagram OAuth credentials not found in environment variables');
}

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials not found in environment variables');
}

// ============================================
// PASSPORT STRATEGIES
// ============================================

// Instagram Strategy
passport.use(new InstagramStrategy({
  clientID: INSTAGRAM_CLIENT_ID!,
  clientSecret: INSTAGRAM_CLIENT_SECRET!,
  callbackURL: `${CALLBACK_URL}/api/auth/instagram/callback`,
  scope: ['user_profile', 'user_media']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await db.select().from(users).where(eq(users.instagramId, profile.id)).limit(1);
    
    if (user.length === 0) {
      // Check if user exists by email
      if (profile.emails && profile.emails[0]) {
        const existingUser = await db.select().from(users).where(eq(users.email, profile.emails[0].value)).limit(1);
        if (existingUser.length > 0) {
          // Update existing user with Instagram info
          await db.update(users).set({
            instagramUsername: profile.username,
            instagramId: profile.id,
            profilePicture: profile.photos?.[0]?.value,
            updatedAt: new Date()
          }).where(eq(users.id, existingUser[0].id));
          user = existingUser;
        }
      }
    }

    if (user.length === 0) {
      // Create new user
      const newUser = await db.insert(users).values({
        email: profile.emails?.[0]?.value || `${profile.username}@instagram.local`,
        fullName: profile.displayName,
        instagramUsername: profile.username,
        instagramId: profile.id,
        profilePicture: profile.photos?.[0]?.value,
        oauthProvider: 'instagram',
        oauthId: profile.id,
        verified: true,
      }).returning();
      
      user = newUser;
    }

    return done(null, user[0]);
  } catch (error) {
    return done(error, undefined);
  }
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: `${CALLBACK_URL}/api/auth/google/callback`,
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await db.select().from(users).where(eq(users.oauthId, profile.id)).limit(1);
    
    if (user.length === 0) {
      // Check if user exists by email
      if (profile.emails && profile.emails[0]) {
        const existingUser = await db.select().from(users).where(eq(users.email, profile.emails[0].value)).limit(1);
        if (existingUser.length > 0) {
          // Update existing user with Google info
          await db.update(users).set({
            profilePicture: profile.photos?.[0]?.value,
            updatedAt: new Date()
          }).where(eq(users.id, existingUser[0].id));
          user = existingUser;
        }
      }
    }

    if (user.length === 0) {
      // Create new user
      const newUser = await db.insert(users).values({
        email: profile.emails?.[0]?.value || '',
        fullName: profile.displayName,
        profilePicture: profile.photos?.[0]?.value,
        oauthProvider: 'google',
        oauthId: profile.id,
        verified: true,
      }).returning();
      
      user = newUser;
    }

    return done(null, user[0]);
  } catch (error) {
    return done(error, undefined);
  }
}));

// ============================================
// SERIALIZATION/DESERIALIZATION
// ============================================

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    done(null, user[0] || null);
  } catch (error) {
    done(error, null);
  }
});

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

export const ensureAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

export const ensureAdmin = (req: any, res: any, next: any) => {
  if (req.isAuthenticated() && req.user.email === process.env.ADMIN_EMAIL) {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
};

// ============================================
// OAUTH URL GENERATORS
// ============================================

export class AuthService {
  
  /**
   * Get Instagram OAuth URL
   */
  static getInstagramAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: INSTAGRAM_CLIENT_ID!,
      redirect_uri: `${CALLBACK_URL}/api/auth/instagram/callback`,
      scope: 'user_profile,user_media',
      response_type: 'code'
    });

    return `https://api.instagram.com/oauth/authorize?${params}`;
  }

  /**
   * Get Google OAuth URL
   */
  static getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID!,
      redirect_uri: `${CALLBACK_URL}/api/auth/google/callback`,
      scope: 'profile email',
      response_type: 'code',
      access_type: 'offline'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  /**
   * Get current user from session
   */
  static getCurrentUser(req: any) {
    return req.user || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(req: any): boolean {
    return req.isAuthenticated();
  }

  /**
   * Logout user
   */
  static logout(req: any, res: any) {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  }
}

export default passport;
