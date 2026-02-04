import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { confessions, revealRequests, payments, users } from '../../shared/schema';
import { eq, desc, count, sum } from 'drizzle-orm';
import { ensureAdmin } from '../services/auth';
import { ImageGenerator } from '../services/imageGenerator';
import { PaymentService } from '../services/paymentService';

const router = express.Router();

// ============================================
// ADMIN DASHBOARD ROUTES
// ============================================

/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */
router.get('/stats', ensureAdmin, async (req, res) => {
  try {
    // Get confession stats
    const [pendingCount] = await db
      .select({ count: count() })
      .from(confessions)
      .where(eq(confessions.status, 'pending'));

    const [approvedCount] = await db
      .select({ count: count() })
      .from(confessions)
      .where(eq(confessions.status, 'approved'));

    const [postedCount] = await db
      .select({ count: count() })
      .from(confessions)
      .where(eq(confessions.status, 'posted'));

    // Get revenue stats
    const [revenueResult] = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(eq(payments.status, 'completed'));

    const [revealsCount] = await db
      .select({ count: count() })
      .from(revealRequests)
      .where(eq(revealRequests.paymentStatus, 'paid'));

    const stats = {
      pendingConfessions: pendingCount?.count || 0,
      approvedConfessions: approvedCount?.count || 0,
      postedConfessions: postedCount?.count || 0,
      totalRevenue: (revenueResult?.total || 0) / 100, // Convert to dollars
      totalReveals: revealsCount?.count || 0,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/admin/confessions
 * Get confessions for admin dashboard (with filtering)
 */
router.get('/confessions', ensureAdmin, async (req, res) => {
  try {
    const { status = 'all', page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db
      .select({
        id: confessions.id,
        confessionNumber: confessions.confessionNumber,
        senderName: confessions.senderName,
        senderInstagram: confessions.senderInstagram,
        vibeType: confessions.vibeType,
        message: confessions.message,
        status: confessions.status,
        validationScore: confessions.validationScore,
        flaggedForReview: confessions.flaggedForReview,
        adminNotes: confessions.adminNotes,
        postedToInstagram: confessions.postedToInstagram,
        instagramPostUrl: confessions.instagramPostUrl,
        createdAt: confessions.createdAt,
        postedAt: confessions.postedAt,
      })
      .from(confessions)
      .orderBy(desc(confessions.createdAt))
      .limit(limitNum)
      .offset(offset);

    if (status !== 'all') {
      query = query.where(eq(confessions.status, status as string));
    }

    const confessionsList = await query;

    // Get reveal requests for each confession
    const confessionsWithReveals = await Promise.all(
      confessionsList.map(async (confession) => {
        const revealData = await db
          .select()
          .from(revealRequests)
          .where(eq(revealRequests.confessionId, confession.id));

        return {
          ...confession,
          revealRequests: revealData,
        };
      })
    );

    res.json({ confessions: confessionsWithReveals });
  } catch (error) {
    console.error('Error fetching admin confessions:', error);
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
});

/**
 * POST /api/admin/confessions/approve
 * Approve a confession
 */
router.post('/confessions/approve', ensureAdmin, async (req, res) => {
  try {
    const { confessionId } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    await db.update(confessions)
      .set({ status: 'approved' })
      .where(eq(confessions.id, confessionId));

    res.json({ message: 'Confession approved successfully' });
  } catch (error) {
    console.error('Error approving confession:', error);
    res.status(500).json({ error: 'Failed to approve confession' });
  }
});

/**
 * POST /api/admin/confessions/reject
 * Reject a confession
 */
router.post('/confessions/reject', ensureAdmin, async (req, res) => {
  try {
    const { confessionId, reason } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    await db.update(confessions)
      .set({ 
        status: 'rejected',
        adminNotes: reason || 'Rejected by admin'
      })
      .where(eq(confessions.id, confessionId));

    res.json({ message: 'Confession rejected successfully' });
  } catch (error) {
    console.error('Error rejecting confession:', error);
    res.status(500).json({ error: 'Failed to reject confession' });
  }
});

/**
 * POST /api/admin/confessions/post
 * Mark confession as posted to Instagram
 */
router.post('/confessions/post', ensureAdmin, async (req, res) => {
  try {
    const { confessionId, instagramPostUrl } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    await db.update(confessions)
      .set({ 
        status: 'posted',
        postedToInstagram: true,
        instagramPostUrl: instagramPostUrl,
        postedAt: new Date(),
      })
      .where(eq(confessions.id, confessionId));

    res.json({ message: 'Confession marked as posted successfully' });
  } catch (error) {
    console.error('Error marking confession as posted:', error);
    res.status(500).json({ error: 'Failed to update confession' });
  }
});

/**
 * POST /api/admin/confessions/:id/notes
 * Update admin notes for a confession
 */
router.post('/confessions/:id/notes', ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    await db.update(confessions)
      .set({ adminNotes: notes })
      .where(eq(confessions.id, id));

    res.json({ message: 'Notes updated successfully' });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// ============================================
// REVEAL MANAGEMENT
// ============================================

/**
 * GET /api/admin/reveals
 * Get all reveal requests
 */
router.get('/reveals', ensureAdmin, async (req, res) => {
  try {
    const { status = 'all', page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db
      .select({
        revealRequest: revealRequests,
        confession: {
          id: confessions.id,
          confessionNumber: confessions.confessionNumber,
          vibeType: confessions.vibeType,
          message: confessions.message,
        },
      })
      .from(revealRequests)
      .leftJoin(confessions, eq(confessions.id, revealRequests.confessionId))
      .orderBy(desc(revealRequests.createdAt))
      .limit(limitNum)
      .offset(offset);

    if (status !== 'all') {
      query = query.where(eq(revealRequests.paymentStatus, status as string));
    }

    const reveals = await query;

    res.json({ reveals });
  } catch (error) {
    console.error('Error fetching reveals:', error);
    res.status(500).json({ error: 'Failed to fetch reveal requests' });
  }
});

/**
 * POST /api/admin/reveals/send
 * Send name reveal to requester
 */
router.post('/reveals/send', ensureAdmin, async (req, res) => {
  try {
    const { confessionId, requestId } = req.body;

    if (!confessionId || !requestId) {
      return res.status(400).json({ error: 'Confession ID and Request ID required' });
    }

    // Process the reveal
    const revealData = await PaymentService.processReveal(requestId);

    // Here you would typically send the reveal via Instagram DM or email
    // For now, we'll just return the data to the admin
    res.json({
      message: 'Reveal sent successfully',
      revealData,
      instructions: 'Please manually send this information to the requester via Instagram DM',
    });
  } catch (error) {
    console.error('Error sending reveal:', error);
    res.status(500).json({ error: 'Failed to send reveal' });
  }
});

// ============================================
// IMAGE GENERATION
// ============================================

/**
 * POST /api/admin/generate-image
 * Generate Instagram image for confession
 */
router.post('/generate-image', ensureAdmin, async (req, res) => {
  try {
    const { confessionId, format = 'story' } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    let imageBuffer: Buffer;
    
    if (format === 'story') {
      imageBuffer = await ImageGenerator.generateConfessionImage(confessionId);
    } else if (format === 'post') {
      imageBuffer = await ImageGenerator.generatePostImage(confessionId);
    } else {
      const allFormats = await ImageGenerator.generateAllFormats(confessionId);
      imageBuffer = allFormats[format as keyof typeof allFormats];
    }

    // Convert buffer to base64 for response
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      imageUrl: dataUrl,
      format,
      confessionId,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
router.get('/users', ensureAdmin, async (req, res) => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        instagramUsername: users.instagramUsername,
        oauthProvider: users.oauthProvider,
        verified: users.verified,
        blocked: users.blocked,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limitNum)
      .offset(offset);

    if (search) {
      // Add search functionality
      query = query.where(
        // This would need to be implemented with proper SQL LIKE clauses
        eq(users.fullName, search as string) // Placeholder
      );
    }

    const userList = await query;

    res.json({ users: userList });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * POST /api/admin/users/:id/block
 * Block or unblock a user
 */
router.post('/users/:id/block', ensureAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { blocked } = req.body;

    await db.update(users)
      .set({ blocked })
      .where(eq(users.id, id));

    res.json({ message: `User ${blocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

export default router;
