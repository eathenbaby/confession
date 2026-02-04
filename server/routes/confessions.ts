import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { users, confessions } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';
import { ensureAuthenticated } from '../services/auth';
import { NameValidator } from '../services/nameValidation';
import { confessionSubmissionSchema } from '../../shared/schema';

const router = express.Router();

// ============================================
// CONFESSION SUBMISSION
// ============================================

/**
 * POST /api/confessions
 * Submit a new confession (authenticated users only)
 */
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Validate request body
    const validatedData = confessionSubmissionSchema.parse(req.body);

    // Get next confession number
    const lastConfession = await db
      .select({ confessionNumber: confessions.confessionNumber })
      .from(confessions)
      .orderBy(desc(confessions.confessionNumber))
      .limit(1);

    const nextNumber = (lastConfession[0]?.confessionNumber || 0) + 1;

    // Validate user's name (additional security)
    const nameValidation = NameValidator.validate(req.user.fullName);
    if (!nameValidation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid user name', 
        details: nameValidation.errors 
      });
    }

    // Create confession
    const [confession] = await db.insert(confessions).values({
      confessionNumber: nextNumber,
      senderId: req.user.id,
      senderName: req.user.fullName,
      senderInstagram: req.user.instagramUsername,
      vibeType: validatedData.vibeType,
      message: validatedData.message,
      validationScore: nameValidation.confidence,
      flaggedForReview: nameValidation.confidence < 70,
      status: 'pending',
    }).returning();

    res.status(201).json({
      id: confession.id,
      confessionNumber: confession.confessionNumber,
      vibeType: confession.vibeType,
      message: confession.message,
      status: confession.status,
      createdAt: confession.createdAt,
    });
  } catch (error) {
    console.error('Error submitting confession:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to submit confession' });
  }
});

/**
 * GET /api/confessions
 * Get public confessions (for display on website)
 */
router.get('/public', async (req, res) => {
  try {
    const { page = '1', limit = '10', vibe } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = db
      .select({
        id: confessions.id,
        confessionNumber: confessions.confessionNumber,
        vibeType: confessions.vibeType,
        message: confessions.message,
        status: confessions.status,
        createdAt: confessions.createdAt,
        postedAt: confessions.postedAt,
      })
      .from(confessions)
      .where(eq(confessions.status, 'posted'))
      .orderBy(desc(confessions.postedAt))
      .limit(limitNum)
      .offset(offset);

    if (vibe) {
      query = query.where(eq(confessions.vibeType, vibe as string));
    }

    const publicConfessions = await query;

    res.json({
      confessions: publicConfessions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: publicConfessions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching public confessions:', error);
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
});

/**
 * GET /api/confessions/my
 * Get current user's confessions (authenticated only)
 */
router.get('/my', ensureAuthenticated, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userConfessions = await db
      .select({
        id: confessions.id,
        confessionNumber: confessions.confessionNumber,
        vibeType: confessions.vibeType,
        message: confessions.message,
        status: confessions.status,
        validationScore: confessions.validationScore,
        flaggedForReview: confessions.flaggedForReview,
        adminNotes: confessions.adminNotes,
        createdAt: confessions.createdAt,
        postedAt: confessions.postedAt,
      })
      .from(confessions)
      .where(eq(confessions.senderId, req.user.id))
      .orderBy(desc(confessions.createdAt));

    res.json({ confessions: userConfessions });
  } catch (error) {
    console.error('Error fetching user confessions:', error);
    res.status(500).json({ error: 'Failed to fetch your confessions' });
  }
});

/**
 * GET /api/confessions/:id
 * Get specific confession details (public only)
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [confession] = await db
      .select({
        id: confessions.id,
        confessionNumber: confessions.confessionNumber,
        vibeType: confessions.vibeType,
        message: confessions.message,
        status: confessions.status,
        createdAt: confessions.createdAt,
        postedAt: confessions.postedAt,
      })
      .from(confessions)
      .where(eq(confessions.id, id))
      .limit(1);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Only show posted confessions publicly
    if (confession.status !== 'posted') {
      return res.status(403).json({ error: 'Confession not available' });
    }

    res.json(confession);
  } catch (error) {
    console.error('Error fetching confession:', error);
    res.status(500).json({ error: 'Failed to fetch confession' });
  }
});

/**
 * GET /api/confessions/vibes
 * Get available vibe options
 */
router.get('/vibes', async (req, res) => {
  try {
    const vibes = [
      { id: 'coffee_date', label: 'Coffee Date', icon: '☕', description: 'Casual coffee, get to know each other' },
      { id: 'dinner', label: 'Dinner', icon: '🍽️', description: 'Nice dinner, proper date' },
      { id: 'just_talk', label: 'Just Talk', icon: '💬', description: 'Want to talk and see where it goes' },
      { id: 'study_session', label: 'Study Session', icon: '📚', description: 'Study together, maybe more' },
      { id: 'adventure', label: 'Adventure', icon: '🌟', description: 'Something exciting and spontaneous' },
      { id: 'the_one', label: 'The One', icon: '💕', description: 'I think you might be the one' },
    ];

    res.json({ vibes });
  } catch (error) {
    console.error('Error fetching vibes:', error);
    res.status(500).json({ error: 'Failed to fetch vibe options' });
  }
});

/**
 * POST /api/confessions/:id/request-reveal
 * Request to reveal a confession's sender
 */
router.post('/:id/request-reveal', async (req, res) => {
  try {
    const { id } = req.params;
    const { requesterInstagram, requesterName, requesterEmail, paymentMethod } = req.body;

    // Validate request
    const revealRequestSchema = z.object({
      requesterInstagram: z.string().min(1, 'Instagram handle required'),
      requesterName: z.string().optional(),
      requesterEmail: z.string().email().optional(),
      paymentMethod: z.enum(['stripe', 'paypal', 'manual']),
    });

    const validatedData = revealRequestSchema.parse(req.body);

    // Check if confession exists and is posted
    const [confession] = await db
      .select()
      .from(confessions)
      .where(eq(confessions.id, id))
      .limit(1);

    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    if (confession.status !== 'posted') {
      return res.status(400).json({ error: 'Confession not available for reveal' });
    }

    // Create reveal request (payment processing will be handled separately)
    const { PaymentService } = await import('../services/paymentService');
    
    if (validatedData.paymentMethod === 'stripe') {
      const paymentLink = await PaymentService.createRevealPaymentLink({
        confessionId: id,
        requesterInstagram: validatedData.requesterInstagram,
        requesterName: validatedData.requesterName,
        requesterEmail: validatedData.requesterEmail,
      });

      res.json({
        revealRequestId: paymentLink.revealRequestId,
        paymentUrl: paymentLink.paymentUrl,
        paymentId: paymentLink.paymentId,
        amount: 3000, // $30.00 in cents
        currency: 'USD',
      });
    } else {
      // For manual payment methods, create the request and return instructions
      const { revealRequests } = await import('../../shared/schema');
      const [revealRequest] = await db.insert(revealRequests).values({
        confessionId: id,
        requesterInstagram: validatedData.requesterInstagram,
        requesterName: validatedData.requesterName,
        requesterEmail: validatedData.requesterEmail,
        paymentAmount: 3000,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: 'pending',
      }).returning();

      res.json({
        revealRequestId: revealRequest.id,
        message: 'Please contact admin to arrange manual payment',
        instructions: 'DM us on Instagram to arrange payment for name reveal',
        amount: 3000,
        currency: 'USD',
      });
    }
  } catch (error) {
    console.error('Error requesting reveal:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to request reveal' });
  }
});

export default router;
