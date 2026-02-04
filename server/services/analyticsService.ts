import { db } from '../db';
import { confessions, payments, revealRequests, users, analytics } from '../../shared/schema';
import { eq, desc, count, sum, and, gte, lte } from 'drizzle-orm';

/**
 * Analytics Service for tracking platform metrics
 * Revenue, user engagement, and performance tracking
 */

export class AnalyticsService {
  
  /**
   * Get comprehensive dashboard statistics
   */
  static async getDashboardStats(): Promise<{
    totalConfessions: number;
    pendingConfessions: number;
    postedConfessions: number;
    totalUsers: number;
    verifiedUsers: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalReveals: number;
    averageRevealPrice: number;
    conversionRate: number;
  }> {
    try {
      // Confession stats
      const [totalConfessions] = await db
        .select({ count: count() })
        .from(confessions);

      const [pendingConfessions] = await db
        .select({ count: count() })
        .from(confessions)
        .where(eq(confessions.status, 'pending'));

      const [postedConfessions] = await db
        .select({ count: count() })
        .from(confessions)
        .where(eq(confessions.status, 'posted'));

      // User stats
      const [totalUsers] = await db
        .select({ count: count() })
        .from(users);

      const [verifiedUsers] = await db
        .select({ count: count() })
        .from(users)
        .where(eq(users.verified, true));

      // Revenue stats
      const [revenueResult] = await db
        .select({ total: sum(payments.amount) })
        .from(payments)
        .where(eq(payments.status, 'completed'));

      const totalRevenue = (revenueResult?.total || 0) / 100; // Convert to dollars

      // Monthly revenue
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const [monthlyRevenueResult] = await db
        .select({ total: sum(payments.amount) })
        .from(payments)
        .where(and(
          eq(payments.status, 'completed'),
          gte(payments.completedAt, currentMonth)
        ));

      const monthlyRevenue = (monthlyRevenueResult?.total || 0) / 100;

      // Reveal stats
      const [totalReveals] = await db
        .select({ count: count() })
        .from(revealRequests)
        .where(eq(revealRequests.paymentStatus, 'paid'));

      const [avgPriceResult] = await db
        .select({ avg: sum(payments.amount) / count() })
        .from(payments)
        .where(eq(payments.status, 'completed'));

      const averageRevealPrice = (avgPriceResult?.avg || 0) / 100;

      // Conversion rate (reveals / posted confessions)
      const conversionRate = postedConfessions.count > 0 
        ? (totalReveals.count / postedConfessions.count) * 100 
        : 0;

      return {
        totalConfessions: totalConfessions.count || 0,
        pendingConfessions: pendingConfessions.count || 0,
        postedConfessions: postedConfessions.count || 0,
        totalUsers: totalUsers.count || 0,
        verifiedUsers: verifiedUsers.count || 0,
        totalRevenue,
        monthlyRevenue,
        totalReveals: totalReveals.count || 0,
        averageRevealPrice,
        conversionRate,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get revenue analytics over time
   */
  static async getRevenueAnalytics(days: number = 30): Promise<{
    dailyRevenue: Array<{ date: string; revenue: number; reveals: number }>;
    totalRevenue: number;
    totalReveals: number;
    averageDailyRevenue: number;
  }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const revenueData = await db
        .select({
          date: payments.completedAt,
          amount: payments.amount,
        })
        .from(payments)
        .where(and(
          eq(payments.status, 'completed'),
          gte(payments.completedAt, startDate)
        ))
        .orderBy(payments.completedAt);

      // Group by date
      const dailyMap = new Map<string, { revenue: number; reveals: number }>();
      
      revenueData.forEach(payment => {
        if (payment.completedAt) {
          const dateKey = payment.completedAt.toISOString().split('T')[0];
          const existing = dailyMap.get(dateKey) || { revenue: 0, reveals: 0 };
          dailyMap.set(dateKey, {
            revenue: existing.revenue + (payment.amount / 100),
            reveals: existing.reveals + 1,
          });
        }
      });

      // Convert to array and fill missing dates
      const dailyRevenue = [];
      const totalRevenue = Array.from(dailyMap.values()).reduce((sum, day) => sum + day.revenue, 0);
      const totalReveals = Array.from(dailyMap.values()).reduce((sum, day) => sum + day.reveals, 0);

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        
        dailyRevenue.push({
          date: dateKey,
          revenue: dailyMap.get(dateKey)?.revenue || 0,
          reveals: dailyMap.get(dateKey)?.reveals || 0,
        });
      }

      return {
        dailyRevenue,
        totalRevenue,
        totalReveals,
        averageDailyRevenue: totalRevenue / days,
      };
    } catch (error) {
      console.error('Error getting revenue analytics:', error);
      throw error;
    }
  }

  /**
   * Get confession analytics
   */
  static async getConfessionAnalytics(): Promise<{
    vibeBreakdown: Array<{ vibe: string; count: number; percentage: number }>;
    statusBreakdown: Array<{ status: string; count: number; percentage: number }>;
    averageValidationScore: number;
    flaggedConfessions: number;
    recentTrend: Array<{ date: string; submissions: number }>;
  }> {
    try {
      // Vibe breakdown
      const vibeStats = await db
        .select({
          vibe: confessions.vibeType,
          count: count(),
        })
        .from(confessions)
        .groupBy(confessions.vibeType);

      const totalConfessions = vibeStats.reduce((sum, stat) => sum + stat.count, 0);
      const vibeBreakdown = vibeStats.map(stat => ({
        vibe: stat.vibe,
        count: stat.count,
        percentage: totalConfessions > 0 ? (stat.count / totalConfessions) * 100 : 0,
      }));

      // Status breakdown
      const statusStats = await db
        .select({
          status: confessions.status,
          count: count(),
        })
        .from(confessions)
        .groupBy(confessions.status);

      const statusBreakdown = statusStats.map(stat => ({
        status: stat.status,
        count: stat.count,
        percentage: totalConfessions > 0 ? (stat.count / totalConfessions) * 100 : 0,
      }));

      // Validation scores
      const [validationResult] = await db
        .select({ avg: sum(confessions.validationScore) / count() })
        .from(confessions);

      const averageValidationScore = validationResult?.avg || 0;

      // Flagged confessions
      const [flaggedResult] = await db
        .select({ count: count() })
        .from(confessions)
        .where(eq(confessions.flaggedForReview, true));

      const flaggedConfessions = flaggedResult.count || 0;

      // Recent trend (last 7 days)
      const recentTrend = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const [dayResult] = await db
          .select({ count: count() })
          .from(confessions)
          .where(and(
            gte(confessions.createdAt, startOfDay),
            lte(confessions.createdAt, endOfDay)
          ));

        recentTrend.push({
          date: date.toISOString().split('T')[0],
          submissions: dayResult.count || 0,
        });
      }

      return {
        vibeBreakdown,
        statusBreakdown,
        averageValidationScore,
        flaggedConfessions,
        recentTrend,
      };
    } catch (error) {
      console.error('Error getting confession analytics:', error);
      throw error;
    }
  }

  /**
   * Track custom events
   */
  static async trackEvent(eventName: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await db.insert(analytics).values({
        eventName,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    } catch (error) {
      console.error('Error tracking event:', error);
      // Don't throw - analytics failures shouldn't break the app
    }
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagementMetrics(): Promise<{
    newUsersThisMonth: number;
    activeUsersThisMonth: number;
    averageConfessionsPerUser: number;
    topVibes: Array<{ vibe: string; count: number }>;
    userRetentionRate: number;
  }> {
    try {
      // New users this month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const [newUsersResult] = await db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, currentMonth));

      const newUsersThisMonth = newUsersResult.count || 0;

      // Active users (users who submitted confessions this month)
      const [activeUsersResult] = await db
        .select({ count: count(confessions.senderId) })
        .from(confessions)
        .where(gte(confessions.createdAt, currentMonth));

      const activeUsersThisMonth = activeUsersResult.count || 0;

      // Average confessions per user
      const [avgConfessionsResult] = await db
        .select({ avg: count(confessions.id) / count(users.id) })
        .from(confessions)
        .rightJoin(users, eq(confessions.senderId, users.id));

      const averageConfessionsPerUser = avgConfessionsResult.avg || 0;

      // Top vibes
      const topVibes = await db
        .select({
          vibe: confessions.vibeType,
          count: count(),
        })
        .from(confessions)
        .groupBy(confessions.vibeType)
        .orderBy(desc(count()))
        .limit(5);

      // User retention (simplified - users who submitted more than one confession)
      const [retentionResult] = await db
        .select({ 
          retained: count(confessions.senderId) / count(users.id) 
        })
        .from(users)
        .leftJoin(confessions, eq(users.id, confessions.senderId))
        .groupBy(users.id)
        .having(count(confessions.senderId), '>', 1);

      const userRetentionRate = retentionResult?.retained || 0;

      return {
        newUsersThisMonth,
        activeUsersThisMonth,
        averageConfessionsPerUser,
        topVibes,
        userRetentionRate,
      };
    } catch (error) {
      console.error('Error getting user engagement metrics:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive analytics report
   */
  static async generateAnalyticsReport(): Promise<{
    dashboard: any;
    revenue: any;
    confessions: any;
    userEngagement: any;
    generatedAt: string;
  }> {
    try {
      const [dashboard, revenue, confessions, userEngagement] = await Promise.all([
        this.getDashboardStats(),
        this.getRevenueAnalytics(30),
        this.getConfessionAnalytics(),
        this.getUserEngagementMetrics(),
      ]);

      return {
        dashboard,
        revenue,
        confessions,
        userEngagement,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      throw error;
    }
  }
}

export default AnalyticsService;
