import { db } from "./db";
import {
  confessions,
  type Confession,
  type InsertConfession,
  type UpdateConfessionStatusRequest
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  createConfession(confession: InsertConfession): Promise<Confession>;
  getConfession(id: string): Promise<Confession | undefined>;
  updateConfessionStatus(id: string, update: UpdateConfessionStatusRequest): Promise<Confession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createConfession(insertConfession: InsertConfession): Promise<Confession> {
    const id = nanoid(6); // Generate a short 6-char ID
    const [confession] = await db.insert(confessions).values({
      ...insertConfession,
      id,
    }).returning();
    return confession;
  }

  async getConfession(id: string): Promise<Confession | undefined> {
    const [confession] = await db.select().from(confessions).where(eq(confessions.id, id));
    return confession;
  }

  async updateConfessionStatus(id: string, update: UpdateConfessionStatusRequest): Promise<Confession | undefined> {
    const [confession] = await db.update(confessions)
      .set({ response: update.response })
      .where(eq(confessions.id, id))
      .returning();
    return confession;
  }
}

export const storage = new DatabaseStorage();
