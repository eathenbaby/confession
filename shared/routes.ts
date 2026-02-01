import { z } from 'zod';
import { insertConfessionSchema, confessions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  confessions: {
    create: {
      method: 'POST' as const,
      path: '/api/confessions',
      input: insertConfessionSchema,
      responses: {
        201: z.custom<typeof confessions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/confessions/:id',
      responses: {
        200: z.custom<typeof confessions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/confessions/:id/status',
      input: z.object({ response: z.enum(['yes', 'no']) }),
      responses: {
        200: z.custom<typeof confessions.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  gifts: {
    list: {
      method: 'GET' as const,
      path: '/api/gifts',
      responses: {
        200: z.array(z.object({
          id: z.string(),
          name: z.string(),
          price: z.string(),
          emoji: z.string(),
        })),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
