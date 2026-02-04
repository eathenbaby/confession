import { createCanvas, loadImage, registerFont } from 'canvas';
import { db } from '../db';
import { confessions } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Instagram Image Generation Service
 * Creates beautiful confession graphics for Instagram posts/stories
 */

export class ImageGenerator {
  
  /**
   * Generate Instagram story/post image for confession
   */
  static async generateConfessionImage(confessionId: string): Promise<Buffer> {
    try {
      // Get confession from database
      const confessionData = await db.select().from(confessions).where(eq(confessions.id, confessionId)).limit(1);
      
      if (!confessionData[0]) {
        throw new Error('Confession not found');
      }

      const confession = confessionData[0];
      
      // Instagram Story size: 1080x1920 (9:16)
      const width = 1080;
      const height = 1920;
      
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#FF6B9D');
      gradient.addColorStop(0.5, '#FFC2E2');
      gradient.addColorStop(1, '#E6B8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add floating hearts (decorative)
      ctx.font = '60px Arial';
      const hearts = ['💕', '💖', '💗', '💓', '💝'];
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const heart = hearts[Math.floor(Math.random() * hearts.length)];
        ctx.fillText(heart, x, y);
      }

      // Add semi-transparent overlay for readability
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const margin = 80;
      const boxY = 400;
      const boxHeight = 1100;
      this.roundRect(ctx, margin, boxY, width - margin * 2, boxHeight, 40);
      ctx.fill();

      // Title
      ctx.fillStyle = '#C73866';
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('💌 Secret Confession 💌', width / 2, 300);

      // Confession number
      ctx.font = '40px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText(`#${confession.confessionNumber}`, width / 2, 500);

      // Vibe type with icon
      const vibeIcons: Record<string, string> = {
        coffee_date: '☕',
        dinner: '🍽️',
        just_talk: '💬',
        study_session: '📚',
        adventure: '🌟',
        the_one: '💕'
      };

      const vibeIcon = vibeIcons[confession.vibeType] || '💕';
      const vibeLabel = confession.vibeType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#FF6B9D';
      ctx.fillText(`${vibeIcon} ${vibeLabel}`, width / 2, 600);

      // Message (word wrap)
      ctx.fillStyle = '#333';
      ctx.font = '45px Arial';
      ctx.textAlign = 'center';
      
      const maxWidth = width - 200;
      const lineHeight = 65;
      const words = confession.message.split(' ');
      let line = '';
      let y = 750;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, width / 2, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, width / 2, y);

      // Call to action
      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#FF6B9D';
      ctx.fillText('DM us to find out who! 💕', width / 2, height - 300);

      // Branding/Handle
      ctx.font = '40px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText('@YourConfessionPage', width / 2, height - 150);

      return canvas.toBuffer('image/png');
    } catch (error) {
      console.error('Error generating confession image:', error);
      throw error;
    }
  }

  /**
   * Generate Instagram post image (1:1 ratio)
   */
  static async generatePostImage(confessionId: string): Promise<Buffer> {
    try {
      // Get confession from database
      const confessionData = await db.select().from(confessions).where(eq(confessions.id, confessionId)).limit(1);
      
      if (!confessionData[0]) {
        throw new Error('Confession not found');
      }

      const confession = confessionData[0];
      
      // Instagram Post size: 1080x1080 (1:1)
      const size = 1080;
      
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#FF6B9D');
      gradient.addColorStop(0.5, '#FFC2E2');
      gradient.addColorStop(1, '#E6B8E8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Add decorative hearts
      ctx.font = '40px Arial';
      const hearts = ['💕', '💖', '💗', '💓', '💝'];
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const heart = hearts[Math.floor(Math.random() * hearts.length)];
        ctx.fillText(heart, x, y);
      }

      // Content box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const margin = 60;
      const boxSize = size - margin * 2;
      this.roundRect(ctx, margin, margin, boxSize, boxSize, 30);
      ctx.fill();

      // Title
      ctx.fillStyle = '#C73866';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('💌 Secret Confession 💌', size / 2, 120);

      // Confession number
      ctx.font = '30px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText(`#${confession.confessionNumber}`, size / 2, 170);

      // Vibe type
      const vibeIcons: Record<string, string> = {
        coffee_date: '☕',
        dinner: '🍽️',
        just_talk: '💬',
        study_session: '📚',
        adventure: '🌟',
        the_one: '💕'
      };

      const vibeIcon = vibeIcons[confession.vibeType] || '💕';
      const vibeLabel = confession.vibeType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

      ctx.font = 'bold 40px Arial';
      ctx.fillStyle = '#FF6B9D';
      ctx.fillText(`${vibeIcon} ${vibeLabel}`, size / 2, 230);

      // Message (word wrap)
      ctx.fillStyle = '#333';
      ctx.font = '35px Arial';
      ctx.textAlign = 'center';
      
      const maxWidth = size - 160;
      const lineHeight = 50;
      const words = confession.message.split(' ');
      let line = '';
      let y = 320;

      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line, size / 2, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, size / 2, y);

      // Call to action
      ctx.font = 'bold 35px Arial';
      ctx.fillStyle = '#FF6B9D';
      ctx.fillText('DM us to find out who! 💕', size / 2, size - 120);

      // Branding
      ctx.font = '25px Arial';
      ctx.fillStyle = '#999';
      ctx.fillText('@YourConfessionPage', size / 2, size - 70);

      return canvas.toBuffer('image/png');
    } catch (error) {
      console.error('Error generating post image:', error);
      throw error;
    }
  }

  /**
   * Helper function to draw rounded rectangles
   */
  private static roundRect(ctx: any, x: number, y: number, width: number, height: number, radius: number) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  /**
   * Generate multiple image formats for different platforms
   */
  static async generateAllFormats(confessionId: string): Promise<{
    story: Buffer;
    post: Buffer;
    thumbnail: Buffer;
  }> {
    const [story, post] = await Promise.all([
      this.generateConfessionImage(confessionId),
      this.generatePostImage(confessionId)
    ]);

    // Generate thumbnail (smaller version)
    const thumbnailCanvas = createCanvas(300, 300);
    const thumbnailCtx = thumbnailCanvas.getContext('2d');
    
    // Load the post image and scale it down
    const postImage = await loadImage(post);
    thumbnailCtx.drawImage(postImage, 0, 0, 300, 300);
    
    const thumbnail = thumbnailCanvas.toBuffer('image/png');

    return {
      story,
      post,
      thumbnail
    };
  }

  /**
   * Add text overlay to existing image
   */
  static async addTextOverlay(imageBuffer: Buffer, text: string, position: 'top' | 'bottom' | 'center' = 'bottom'): Promise<Buffer> {
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original image
    ctx.drawImage(image, 0, 0);

    // Add semi-transparent overlay for text readability
    const overlayHeight = 150;
    const gradient = ctx.createLinearGradient(0, 0, 0, overlayHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    
    if (position === 'top') {
      ctx.fillRect(0, 0, image.width, overlayHeight);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, image.width / 2, 80);
    } else if (position === 'bottom') {
      ctx.fillRect(0, image.height - overlayHeight, image.width, overlayHeight);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, image.width / 2, image.height - 70);
    } else {
      // Center overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, image.width, image.height);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 50px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(text, image.width / 2, image.height / 2);
    }

    return canvas.toBuffer('image/png');
  }
}
