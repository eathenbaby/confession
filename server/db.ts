import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: any = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
} else {
  console.warn("[db] WARNING: DATABASE_URL not set. Database operations will fail but server will start.");
  console.warn("[db] Set DATABASE_URL to enable database features.");
}

export { pool, db };

/**
 * Initialize the database schema - creates tables if they don't exist
 * This ensures the database is ready when the server starts
 */
export async function initializeDatabase() {
  // Skip if no database configured
  if (!pool || !db) {
    console.log("[db] Skipping database initialization - DATABASE_URL not set");
    return;
  }

  let client;
  try {
    console.log("[db] Connecting to database...");
    client = await pool.connect();
    console.log("[db] Database connection established");

    // Check if table exists
    console.log("[db] Checking if confessions table exists...");
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'confessions'
      )
    `);

    const tableExists = tableCheck.rows[0].exists;
    console.log(`[db] Table exists: ${tableExists}`);

    if (!tableExists) {
      // Create confessions table if it doesn't exist
      await client.query(`
        CREATE TABLE confessions (
          id VARCHAR PRIMARY KEY,
          sender_name TEXT NOT NULL,
          sender_contact TEXT,
          intent_option TEXT,
          message TEXT,
          response TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("Created confessions table");
    } else {
      // Table exists - check and add missing columns
      const columnCheck = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'confessions'
      `);

      const existingColumns = columnCheck.rows.map((row: any) => row.column_name);

      // Add missing columns
      if (!existingColumns.includes('sender_name')) {
        // First add as nullable with default
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN sender_name TEXT DEFAULT ''
        `);
        // Update any existing rows
        await client.query(`
          UPDATE confessions 
          SET sender_name = '' 
          WHERE sender_name IS NULL
        `);
        // Now make it NOT NULL
        await client.query(`
          ALTER TABLE confessions 
          ALTER COLUMN sender_name SET NOT NULL,
          ALTER COLUMN sender_name DROP DEFAULT
        `);
        console.log("Added sender_name column");
      }

      if (!existingColumns.includes('sender_contact')) {
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN sender_contact TEXT
        `);
        console.log("Added sender_contact column");
      }

      if (!existingColumns.includes('response')) {
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN response TEXT DEFAULT 'pending'
        `);
        console.log("Added response column");
      }

      if (!existingColumns.includes('created_at')) {
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN created_at TIMESTAMP DEFAULT NOW()
        `);
        console.log("Added created_at column");
      }

      if (!existingColumns.includes('intent_option')) {
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN intent_option TEXT
        `);
        console.log("Added intent_option column");
      }

      if (!existingColumns.includes('message')) {
        await client.query(`
          ALTER TABLE confessions 
          ADD COLUMN message TEXT
        `);
        console.log("Added message column");
      }
    }

    client.release();
    console.log("[db] Database initialized successfully");
  } catch (error) {
    if (client) {
      client.release();
    }
    console.error("[db] Error initializing database:", error);
    // Log the full error details
    if (error instanceof Error) {
      console.error("[db] Error message:", error.message);
      console.error("[db] Error stack:", error.stack);
    }
    throw error;
  }
}