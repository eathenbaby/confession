import express from 'express';
import { z } from 'zod';
import { ImageGenerator } from '../services/imageGenerator';
import { ensureAdmin } from '../services/auth';

const router = express.Router();

/**
 * POST /api/instagram/generate-image
 * Generate Instagram image for confession
 */
router.post('/generate-image', ensureAdmin, async (req, res) => {
  try {
    const { confessionId, format = 'story' } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    const validFormats = ['story', 'post', 'thumbnail'];
    if (!validFormats.includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Must be story, post, or thumbnail' });
    }

    let imageBuffer: Buffer;
    
    if (format === 'story') {
      imageBuffer = await ImageGenerator.generateConfessionImage(confessionId);
    } else if (format === 'post') {
      imageBuffer = await ImageGenerator.generatePostImage(confessionId);
    } else {
      const allFormats = await ImageGenerator.generateAllFormats(confessionId);
      imageBuffer = allFormats.thumbnail;
    }

    // Convert buffer to base64 for response
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    res.json({
      imageUrl: dataUrl,
      format,
      confessionId,
      size: imageBuffer.length,
    });
  } catch (error) {
    console.error('Error generating Instagram image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

/**
 * POST /api/instagram/generate-all-formats
 * Generate all image formats for confession
 */
router.post('/generate-all-formats', ensureAdmin, async (req, res) => {
  try {
    const { confessionId } = req.body;

    if (!confessionId) {
      return res.status(400).json({ error: 'Confession ID required' });
    }

    const allFormats = await ImageGenerator.generateAllFormats(confessionId);

    // Convert all buffers to base64
    const response = {
      confessionId,
      formats: {
        story: {
          imageUrl: `data:image/png;base64,${allFormats.story.toString('base64')}`,
          size: allFormats.story.length,
        },
        post: {
          imageUrl: `data:image/png;base64,${allFormats.post.toString('base64')}`,
          size: allFormats.post.length,
        },
        thumbnail: {
          imageUrl: `data:image/png;base64,${allFormats.thumbnail.toString('base64')}`,
          size: allFormats.thumbnail.length,
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating all image formats:', error);
    res.status(500).json({ error: 'Failed to generate images' });
  }
});

/**
 * POST /api/instagram/add-text-overlay
 * Add text overlay to existing image
 */
router.post('/add-text-overlay', ensureAdmin, async (req, res) => {
  try {
    const { imageUrl, text, position = 'bottom' } = req.body;

    if (!imageUrl || !text) {
      return res.status(400).json({ error: 'Image URL and text required' });
    }

    const validPositions = ['top', 'bottom', 'center'];
    if (!validPositions.includes(position)) {
      return res.status(400).json({ error: 'Invalid position. Must be top, bottom, or center' });
    }

    // Convert base64 image URL to buffer
    const base64Data = imageUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const overlayedImage = await ImageGenerator.addTextOverlay(imageBuffer, text, position);

    // Convert back to base64
    const base64Overlay = overlayedImage.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Overlay}`;

    res.json({
      imageUrl: dataUrl,
      text,
      position,
      size: overlayedImage.length,
    });
  } catch (error) {
    console.error('Error adding text overlay:', error);
    res.status(500).json({ error: 'Failed to add text overlay' });
  }
});

export default router;
