import {
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  uuid,
  integer,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// NEW CONFESSION PLATFORM TABLES
// ============================================

/**
 * Users Table - OAuth Authentication & Verified Identities
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(), // Real name from OAuth
  instagramUsername: text("instagram_username"), // @handle from Instagram OAuth
  instagramId: text("instagram_id"), // Instagram user ID
  profilePicture: text("profile_picture"), // Profile image URL
  oauthProvider: text("oauth_provider").notNull(), // 'instagram' | 'google'
  oauthId: text("oauth_id").notNull(), // Provider's user ID
  verified: boolean("verified").default(true), // OAuth accounts are pre-verified
  blocked: boolean("blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Bouquets Table - Digital Flower Bouquets
 */
export const bouquets = pgTable('bouquets', {
  id: text('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  senderEmail: text('sender_email'),
  recipientName: text('recipient_name').notNull(),
  recipientEmail: text('recipient_email'),
  message: text('message').notNull(),
  flowerTypes: text('flower_types').notNull().array(),
  theme: text('theme').notNull(),
  isPublic: boolean('is_public').default(false),
  deliveryDate: timestamp('delivery_date'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================
// BOUQUET SCHEMAS
// ============================================

export const bouquetCreationSchema = z.object({
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

export type BouquetCreationInput = z.infer<typeof bouquetCreationSchema>;

export const bouquetSchema = z.object({
  id: z.string(),
  senderName: z.string(),
  senderEmail: z.string().optional(),
  recipientName: z.string(),
  recipientEmail: z.string().optional(),
  message: z.string(),
  flowerTypes: z.array(z.string()),
  theme: z.string(),
  isPublic: z.boolean(),
  deliveryDate: z.string().nullable(),
  sentAt: z.string().nullable(),
  createdAt: z.string(),
});

export type Bouquet = z.infer<typeof bouquetSchema>;

/**
 * Confessions Table - Main confession submissions
 */
export const confessions = pgTable("confessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  confessionNumber: integer("confession_number").notNull().unique(), // Auto-increment for easy reference
  senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  senderName: text("sender_name").notNull(), // Real name (admin only)
  senderInstagram: text("sender_instagram"), // Instagram handle (admin only)
  vibeType: text("vibe_type").notNull(), // Coffee date, dinner, etc.
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, posted
  postedToInstagram: boolean("posted_to_instagram").default(false),
  instagramPostUrl: text("instagram_post_url"),
  instagramImageUrl: text("instagram_image_url"),
  validationScore: integer("validation_score").default(100), // 0-100 confidence score
  flaggedForReview: boolean("flagged_for_review").default(false),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  postedAt: timestamp("posted_at"),
});

/**
 * Reveal Requests Table - Name reveal monetization
 */
export const revealRequests = pgTable("reveal_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  confessionId: uuid("confession_id").notNull().references(() => confessions.id, { onDelete: "cascade" }),
  requesterInstagram: text("requester_instagram").notNull(), // Person asking for reveal
  requesterName: text("requester_name"), // Optional name
  requesterEmail: text("requester_email"), // For notifications
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, refunded
  paymentAmount: integer("payment_amount").notNull(), // Amount in cents
  paymentMethod: text("payment_method").notNull(), // stripe, paypal, manual
  paymentId: text("payment_id"), // Stripe session ID or transaction ID
  revealed: boolean("revealed").default(false),
  revealedAt: timestamp("revealed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Payments Table - Payment tracking
 */
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  confessionId: uuid("confession_id").references(() => confessions.id, { onDelete: "cascade" }),
  revealRequestId: uuid("reveal_request_id").references(() => revealRequests.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(), // Amount in cents
  currency: text("currency").notNull().default("USD"),
  paymentProvider: text("payment_provider").notNull(), // stripe, paypal, manual
  paymentId: text("payment_id").notNull(), // Provider transaction ID
  status: text("status").notNull().default("pending"), // pending, completed, failed, refunded
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// ============================================
// ZOD SCHEMAS
// ============================================

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  instagramUsername: true,
  instagramId: true,
  profilePicture: true,
  oauthProvider: true,
  oauthId: true,
});

// Confession schemas
export const insertConfessionSchema = createInsertSchema(confessions).pick({
  vibeType: true,
  message: true,
});

export const confessionSubmissionSchema = z.object({
  vibeType: z.enum(["coffee_date", "dinner", "just_talk", "study_session", "adventure", "the_one"]),
  message: z.string().min(20, "Message must be at least 20 characters").max(1000, "Message must be less than 1000 characters"),
});

// Reveal request schemas
export const insertRevealRequestSchema = createInsertSchema(revealRequests).pick({
  confessionId: true,
  requesterInstagram: true,
  requesterName: true,
  requesterEmail: true,
  paymentAmount: true,
  paymentMethod: true,
});

// Payment schemas
export const insertPaymentSchema = createInsertSchema(payments).pick({
  confessionId: true,
  revealRequestId: true,
  amount: true,
  currency: true,
  paymentProvider: true,
  paymentId: true,
  metadata: true,
});

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Confession = typeof confessions.$inferSelect;
export type InsertConfession = typeof confessions.$inferInsert;

export type RevealRequest = typeof revealRequests.$inferSelect;
export type InsertRevealRequest = typeof revealRequests.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type ConfessionSubmission = z.infer<typeof confessionSubmissionSchema>;

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface CreateConfessionRequest {
  vibeType: string;
  message: string;
}

export interface ConfessionResponse {
  id: string;
  confessionNumber: number;
  vibeType: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface AdminConfessionResponse extends ConfessionResponse {
  senderName: string;
  senderInstagram: string;
  validationScore: number;
  flaggedForReview: boolean;
  adminNotes?: string;
  postedToInstagram: boolean;
  instagramPostUrl?: string;
  revealRequests?: RevealRequest[];
}

export interface CreateRevealRequestRequest {
  confessionId: string;
  requesterInstagram: string;
  requesterName?: string;
  requesterEmail?: string;
  paymentMethod: 'stripe' | 'paypal' | 'manual';
}

export interface PaymentLinkResponse {
  paymentUrl: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export interface AdminStats {
  pendingConfessions: number;
  approvedConfessions: number;
  postedConfessions: number;
  totalRevenue: number;
  totalReveals: number;
}

// ============================================
// LEGACY SCHEMAS (Backwards Compatibility)
// ============================================

/**
 * Legacy Valentine's Day confessions table.
 * Kept for backwards compatibility with the existing flow.
 */
export const legacyConfessions = pgTable("legacy_confessions", {
  id: varchar("id").primaryKey(),
  senderName: text("sender_name").notNull(), // ADMIN ONLY - never exposed to recipient
  senderContact: text("sender_contact"),
  intentOption: text("intent_option"), // PUBLIC - shown to recipient
  message: text("message"), // PUBLIC - confession text
  response: text("response").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const senderInfoSchema = z.object({
  senderName: z.string().min(1, "Name is required"),
  intentOption: z.string().min(1, "Please select an option"),
});

export const confessionComposeSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

export const insertLegacyConfessionSchema = createInsertSchema(legacyConfessions).pick({
  senderName: true,
  senderContact: true,
  intentOption: true,
  message: true,
});

export const publicConfessionSchema = z.object({
  id: z.string(),
  intentOption: z.string().nullable(),
  message: z.string().nullable(),
  response: z.string(),
  createdAt: z.date().nullable(),
});

export type LegacyConfession = typeof legacyConfessions.$inferSelect;
export type InsertLegacyConfession = typeof legacyConfessions.$inferInsert;
export type PublicConfession = z.infer<typeof publicConfessionSchema>;
export type SenderInfo = z.infer<typeof senderInfoSchema>;
export type ConfessionCompose = z.infer<typeof confessionComposeSchema>;

export type UpdateConfessionStatusRequest = { response: "yes" | "no" };
export type PublicConfessionResponse = PublicConfession;

export interface GiftOption {
  id: string;
  name: string;
  price: string;
  emoji: string;
  image?: string;
}
