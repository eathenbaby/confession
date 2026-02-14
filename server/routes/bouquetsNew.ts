import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { bouquets } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// ============================================
// BOUQUET CREATION ROUTES
// ============================================

/**
 * POST /api/bouquets/create
 * Create a new digital bouquet
 */
router.post('/create', async (req, res) => {
  try {
    const bouquetSchema = z.object({
      senderName: z.string().min(1, 'Sender name is required'),
      senderEmail: z.string().email().optional(),
      recipientName: z.string().min(1, 'Recipient name is required'),
      recipientEmail: z.string().email().optional(),
      message: z.string().min(1, 'Message is required').max(500, 'Message too long'),
      flowerTypes: z.array(z.string()).min(1, 'At least one flower is required'),
      theme: z.enum(['romantic', 'friendly', 'cheerful', 'elegant']).default('romantic'),
      isPublic: z.boolean().default(false),
      deliveryDate: z.string().optional(),
    });

    const validatedData = bouquetSchema.parse(req.body);

    // Generate unique bouquet ID
    const bouquetId = `bouquet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save bouquet to database
    const [bouquet] = await db.insert(bouquets).values({
      id: bouquetId,
      senderName: validatedData.senderName,
      senderEmail: validatedData.senderEmail,
      recipientName: validatedData.recipientName,
      recipientEmail: validatedData.recipientEmail,
      message: validatedData.message,
      flowerTypes: validatedData.flowerTypes,
      theme: validatedData.theme,
      isPublic: validatedData.isPublic,
      deliveryDate: validatedData.deliveryDate ? new Date(validatedData.deliveryDate) : null,
      createdAt: new Date(),
    }).returning();

    // Generate bouquet URL
    const bouquetUrl = `${process.env.NEXT_PUBLIC_URL}/bouquet/${bouquetId}`;

    res.status(201).json({
      id: bouquet.id,
      url: bouquetUrl,
      message: 'Bouquet created successfully!',
      bouquet: {
        id: bouquet.id,
        senderName: bouquet.senderName,
        recipientName: bouquet.recipientName,
        message: bouquet.message,
        flowerTypes: bouquet.flowerTypes,
        theme: bouquet.theme,
        isPublic: bouquet.isPublic,
        deliveryDate: bouquet.deliveryDate,
        createdAt: bouquet.createdAt,
        url: bouquetUrl,
      },
    });
  } catch (error) {
    console.error('Error creating bouquet:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid data', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create bouquet' });
  }
});

/**
 * GET /api/bouquets/:id
 * Get a specific bouquet
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Query bouquet from database
    const [bouquet] = await db
      .select()
      .from(bouquets)
      .where(eq(bouquets.id, id))
      .limit(1);

    if (!bouquet) {
      return res.status(404).json({ error: 'Bouquet not found' });
    }

    res.json({
      bouquet: {
        id: bouquet.id,
        senderName: bouquet.senderName,
        recipientName: bouquet.recipientName,
        message: bouquet.message,
        flowerTypes: bouquet.flowerTypes,
        theme: bouquet.theme,
        isPublic: bouquet.isPublic,
        deliveryDate: bouquet.deliveryDate,
        createdAt: bouquet.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching bouquet:', error);
    res.status(500).json({ error: 'Failed to fetch bouquet' });
  }
});

/**
 * GET /api/bouquets/public
 * Get public bouquets for gallery
 */
router.get('/public', async (req, res) => {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const publicBouquets = await db
      .select()
      .from(bouquets)
      .where(eq(bouquets.isPublic, true))
      .orderBy(desc(bouquets.createdAt))
      .limit(limitNum)
      .offset(offset);

    res.json({
      bouquets: publicBouquets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: publicBouquets.length,
      },
    });
  } catch (error) {
    console.error('Error fetching public bouquets:', error);
    res.status(500).json({ error: 'Failed to fetch bouquets' });
  }
});

/**
 * POST /api/bouquets/:id/send
 * Send bouquet to recipient
 */
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { senderEmail } = req.body;

    // Get bouquet details
    const [bouquet] = await db
      .select()
      .from(bouquets)
      .where(eq(bouquets.id, id))
      .limit(1);

    if (!bouquet) {
      return res.status(404).json({ error: 'Bouquet not found' });
    }

    // Here you would implement email sending logic
    // For now, we'll just mark as sent
    await db.update(bouquets)
      .set({ sentAt: new Date() })
      .where(eq(bouquets.id, id));

    res.json({
      message: 'Bouquet sent successfully!',
      bouquetId: id,
      recipientEmail: bouquet.recipientEmail,
    });
  } catch (error) {
    console.error('Error sending bouquet:', error);
    res.status(500).json({ error: 'Failed to send bouquet' });
  }
});

export default router;
