// Serverless entry point for Vercel
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import { initializeDatabase } from "./db";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app: express.Express | null = null;
let httpServer: any = null;
let initialized = false;

async function getApp() {
  if (app && initialized) {
    return app;
  }

  console.log("[serverless] Initializing Express app...");
  
  app = express();
  httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  // Serve static files from dist/public
  const publicPath = path.join(__dirname, "..", "dist", "public");
  console.log("[serverless] Serving static files from:", publicPath);
  app.use(express.static(publicPath));

  // Register routes
  try {
    await registerRoutes(httpServer, app);
    console.log("[serverless] Routes registered");
  } catch (error) {
    console.error("[serverless] Route registration failed:", error);
  }
  
  // Initialize database
  try {
    await initializeDatabase();
    console.log("[serverless] Database initialized");
  } catch (error) {
    console.error("[serverless] Database initialization failed:", error);
    // Continue anyway - some routes might work without DB
  }

  // SPA fallback - serve index.html for non-API routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api") && req.path !== "/health" && !req.path.startsWith("/assets")) {
      res.sendFile(path.join(publicPath, "index.html"));
    } else {
      next();
    }
  });

  // Error handler
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("[serverless] Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });
  
  initialized = true;
  console.log("[serverless] Initialization complete");
  
  return app;
}

// Export handler for Vercel
export default async function handler(req: any, res: any) {
  try {
    const expressApp = await getApp();
    return expressApp(req, res);
  } catch (error) {
    console.error("[serverless] Handler error:", error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
