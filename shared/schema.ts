import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const confessions = pgTable("confessions", {
  id: varchar("id").primaryKey(),
  senderName: text("sender_name").notNull(), // ADMIN ONLY - never exposed to recipient
  senderContact: text("sender_contact"),
  intentOption: text("intent_option"), // PUBLIC - shown to recipient
  message: text("message"), // PUBLIC - confession text
  response: text("response").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for Stage 1: Sender info and intent selection
export const senderInfoSchema = z.object({
  senderName: z.string().min(1, "Name is required"),
  intentOption: z.string().min(1, "Please select an option"),
});

// Schema for Stage 2: Confession composition
export const confessionComposeSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

// Full confession creation schema (combines both stages)
export const insertConfessionSchema = createInsertSchema(confessions).pick({
  senderName: true,
  senderContact: true,
  intentOption: true,
  message: true,
});

// Public confession schema (excludes sender_name)
export const publicConfessionSchema = z.object({
  id: z.string(),
  intentOption: z.string().nullable(),
  message: z.string().nullable(),
  response: z.string(),
  createdAt: z.date().nullable(),
});

export type Confession = typeof confessions.$inferSelect;
export type InsertConfession = z.infer<typeof insertConfessionSchema>;
export type PublicConfession = z.infer<typeof publicConfessionSchema>;
export type SenderInfo = z.infer<typeof senderInfoSchema>;
export type ConfessionCompose = z.infer<typeof confessionComposeSchema>;

export type CreateConfessionRequest = InsertConfession;
export type UpdateConfessionStatusRequest = { response: "yes" | "no" };
export type ConfessionResponse = Confession;
export type PublicConfessionResponse = PublicConfession;

export interface GiftOption {
  id: string;
  name: string;
  price: string;
  emoji: string;
  image?: string;
}
