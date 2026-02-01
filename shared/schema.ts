import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const confessions = pgTable("confessions", {
  id: varchar("id").primaryKey(), // We'll generate short IDs like 'abc1234'
  senderName: text("sender_name").notNull(),
  senderContact: text("sender_contact"), // Optional instagram/phone
  response: text("response").default("pending"), // 'pending', 'yes', 'no'
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConfessionSchema = createInsertSchema(confessions).pick({
  senderName: true,
  senderContact: true,
});

export type Confession = typeof confessions.$inferSelect;
export type InsertConfession = z.infer<typeof insertConfessionSchema>;

export type CreateConfessionRequest = InsertConfession;
export type UpdateConfessionStatusRequest = { response: "yes" | "no" };
export type ConfessionResponse = Confession;

// Static gift data type for the monetization layer
export interface GiftOption {
  id: string;
  name: string;
  price: string;
  emoji: string;
  image?: string;
}
