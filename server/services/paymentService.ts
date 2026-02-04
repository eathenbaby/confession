import Stripe from 'stripe';
import { db } from '../db';
import { confessions, revealRequests, payments } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Stripe Payment Service for Name Reveals
 * Handles payment processing, webhooks, and revenue tracking
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const REVEAL_PRICE_CENTS = 3000; // $30.00

export class PaymentService {
  
  /**
   * Create a payment link for name reveal
   */
  static async createRevealPaymentLink(params: {
    confessionId: string;
    requesterInstagram: string;
    requesterName?: string;
    requesterEmail?: string;
  }): Promise<{
    paymentUrl: string;
    paymentId: string;
    revealRequestId: string;
  }> {
    try {
      // Create reveal request record
      const [revealRequest] = await db.insert(revealRequests).values({
        confessionId: params.confessionId,
        requesterInstagram: params.requesterInstagram,
        requesterName: params.requesterName,
        requesterEmail: params.requesterEmail,
        paymentAmount: REVEAL_PRICE_CENTS,
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
      }).returning();

      // Create Stripe payment link
      const paymentLink = await stripe.paymentLinks.create({
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Confession Name Reveal',
              description: `Find out who sent confession #${await this.getConfessionNumber(params.confessionId)}`,
              images: [], // Add confession image if available
            },
            unit_amount: REVEAL_PRICE_CENTS,
          },
          quantity: 1,
        }],
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${process.env.NEXT_PUBLIC_URL}/reveal-success?request_id=${revealRequest.id}`,
          },
        },
        metadata: {
          confessionId: params.confessionId,
          revealRequestId: revealRequest.id,
          requesterInstagram: params.requesterInstagram,
        },
      });

      // Update reveal request with Stripe payment link ID
      await db.update(revealRequests)
        .set({ paymentId: paymentLink.id })
        .where(eq(revealRequests.id, revealRequest.id));

      return {
        paymentUrl: paymentLink.url,
        paymentId: paymentLink.id,
        revealRequestId: revealRequest.id,
      };
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  }

  /**
   * Create a checkout session for name reveal (alternative method)
   */
  static async createCheckoutSession(params: {
    confessionId: string;
    requesterInstagram: string;
    requesterName?: string;
    requesterEmail?: string;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<{
    checkoutUrl: string;
    sessionId: string;
    revealRequestId: string;
  }> {
    try {
      // Create reveal request record
      const [revealRequest] = await db.insert(revealRequests).values({
        confessionId: params.confessionId,
        requesterInstagram: params.requesterInstagram,
        requesterName: params.requesterName,
        requesterEmail: params.requesterEmail,
        paymentAmount: REVEAL_PRICE_CENTS,
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
      }).returning();

      const confessionNumber = await this.getConfessionNumber(params.confessionId);

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Confession Name Reveal',
              description: `Find out who sent confession #${confessionNumber}`,
            },
            unit_amount: REVEAL_PRICE_CENTS,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: params.successUrl || `${process.env.NEXT_PUBLIC_URL}/reveal-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: params.cancelUrl || `${process.env.NEXT_PUBLIC_URL}/reveal-cancel`,
        metadata: {
          confessionId: params.confessionId,
          revealRequestId: revealRequest.id,
          requesterInstagram: params.requesterInstagram,
        },
        customer_email: params.requesterEmail,
      });

      // Update reveal request with session ID
      await db.update(revealRequests)
        .set({ paymentId: session.id })
        .where(eq(revealRequests.id, revealRequest.id));

      return {
        checkoutUrl: session.url!,
        sessionId: session.id,
        revealRequestId: revealRequest.id,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  static async handleWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
          break;
          
        case 'payment_link.completed':
          await this.handlePaymentLinkCompleted(event.data.object as Stripe.PaymentLink);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment intent
   */
  private static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const { confessionId, revealRequestId, requesterInstagram } = paymentIntent.metadata;
    
    if (!confessionId || !revealRequestId) {
      console.error('Missing metadata in payment intent');
      return;
    }

    // Update reveal request
    await db.update(revealRequests)
      .set({
        paymentStatus: 'paid',
      })
      .where(eq(revealRequests.id, revealRequestId));

    // Create payment record
    await db.insert(payments).values({
      confessionId,
      revealRequestId,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency.toUpperCase(),
      paymentProvider: 'stripe',
      paymentId: paymentIntent.id,
      status: 'completed',
      metadata: JSON.stringify({
        requesterInstagram,
        paymentIntentId: paymentIntent.id,
      }),
      completedAt: new Date(),
    });

    console.log(`Payment succeeded for reveal request ${revealRequestId}`);
  }

  /**
   * Handle completed checkout session
   */
  private static async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const { confessionId, revealRequestId, requesterInstagram } = session.metadata;
    
    if (!confessionId || !revealRequestId) {
      console.error('Missing metadata in checkout session');
      return;
    }

    // Update reveal request
    await db.update(revealRequests)
      .set({
        paymentStatus: 'paid',
      })
      .where(eq(revealRequests.id, revealRequestId));

    // Create payment record
    await db.insert(payments).values({
      confessionId,
      revealRequestId,
      amount: session.amount_total!,
      currency: session.currency!.toUpperCase(),
      paymentProvider: 'stripe',
      paymentId: session.id,
      status: 'completed',
      metadata: JSON.stringify({
        requesterInstagram,
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
      }),
      completedAt: new Date(),
    });

    console.log(`Checkout completed for reveal request ${revealRequestId}`);
  }

  /**
   * Handle completed payment link
   */
  private static async handlePaymentLinkCompleted(paymentLink: Stripe.PaymentLink): Promise<void> {
    // Payment links don't contain payment details directly
    // We'll handle this through payment_intent.succeeded events
    console.log(`Payment link completed: ${paymentLink.id}`);
  }

  /**
   * Process name reveal after payment confirmation
   */
  static async processReveal(revealRequestId: string): Promise<{
    senderName: string;
    senderInstagram: string;
    confessionMessage: string;
  }> {
    try {
      // Get reveal request with confession details
      const [revealRequest] = await db
        .select({
          revealRequest: revealRequests,
          confession: confessions,
        })
        .from(revealRequests)
        .leftJoin(confessions, eq(confessions.id, revealRequests.confessionId))
        .where(eq(revealRequests.id, revealRequestId))
        .limit(1);

      if (!revealRequest || !revealRequest.confession) {
        throw new Error('Reveal request or confession not found');
      }

      if (revealRequest.revealRequest.paymentStatus !== 'paid') {
        throw new Error('Payment not completed for this reveal request');
      }

      if (revealRequest.revealRequest.revealed) {
        throw new Error('Name already revealed for this request');
      }

      // Mark as revealed
      await db.update(revealRequests)
        .set({
          revealed: true,
          revealedAt: new Date(),
        })
        .where(eq(revealRequests.id, revealRequestId));

      // Increment confession's reveal count
      await db.update(confessions)
        .set({
          // You might want to add a revealCount field to confessions table
        })
        .where(eq(confessions.id, revealRequest.confession.id));

      return {
        senderName: revealRequest.confession.senderName,
        senderInstagram: revealRequest.confession.senderInstagram || 'No Instagram',
        confessionMessage: revealRequest.confession.message,
      };
    } catch (error) {
      console.error('Error processing reveal:', error);
      throw error;
    }
  }

  /**
   * Get revenue statistics
   */
  static async getRevenueStats(): Promise<{
    totalRevenue: number;
    totalReveals: number;
    averageRevenuePerReveal: number;
    monthlyRevenue: number;
  }> {
    try {
      const completedPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.status, 'completed'));

      const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
      const totalReveals = completedPayments.length;
      const averageRevenuePerReveal = totalReveals > 0 ? totalRevenue / totalReveals : 0;

      // Calculate monthly revenue (current month)
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const monthlyPayments = completedPayments.filter(payment => 
        payment.completedAt && new Date(payment.completedAt) >= currentMonth
      );
      const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);

      return {
        totalRevenue: totalRevenue / 100, // Convert to dollars
        totalReveals,
        averageRevenuePerReveal: averageRevenuePerReveal / 100,
        monthlyRevenue: monthlyRevenue / 100,
      };
    } catch (error) {
      console.error('Error getting revenue stats:', error);
      throw error;
    }
  }

  /**
   * Helper: Get confession number from ID
   */
  private static async getConfessionNumber(confessionId: string): Promise<number> {
    const [confession] = await db
      .select({ confessionNumber: confessions.confessionNumber })
      .from(confessions)
      .where(eq(confessions.id, confessionId))
      .limit(1);

    return confession?.confessionNumber || 0;
  }

  /**
   * Refund a payment
   */
  static async refundPayment(paymentId: string, reason?: string): Promise<void> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentId,
        reason: reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer',
      });

      // Update payment record
      await db.update(payments)
        .set({
          status: 'refunded',
        })
        .where(eq(payments.paymentId, paymentId));

      // Update reveal request
      await db.update(revealRequests)
        .set({
          paymentStatus: 'refunded',
        })
        .where(eq(revealRequests.paymentId, paymentId));

      console.log(`Payment refunded: ${refund.id}`);
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return false;
    }
  }
}

export default PaymentService;
