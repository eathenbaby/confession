import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.confessions.create.path, async (req, res) => {
    try {
      const input = api.confessions.create.input.parse(req.body);
      const confession = await storage.createConfession(input);
      res.status(201).json(confession);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.confessions.get.path, async (req, res) => {
    const confession = await storage.getConfession(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: 'Confession not found' });
    }
    res.json(confession);
  });

  app.patch(api.confessions.updateStatus.path, async (req, res) => {
    try {
      const input = z.object({ response: z.enum(['yes', 'no']) }).parse(req.body);
      const confession = await storage.updateConfessionStatus(req.params.id, input);
      if (!confession) {
        return res.status(404).json({ message: 'Confession not found' });
      }
      res.json(confession);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
        });
      }
      throw err;
    }
  });

  app.get(api.gifts.list.path, (_req, res) => {
    const gifts = [
      { id: '1', name: 'Chocolates', price: '$15', emoji: '🍫' },
      { id: '2', name: 'Teddy Bear', price: '$25', emoji: '🧸' },
      { id: '3', name: 'Love Letter', price: '$5', emoji: '💌' },
      { id: '4', name: 'Rose Bouquet', price: '$40', emoji: '🌹' },
    ];
    res.json(gifts);
  });

  return httpServer;
}
