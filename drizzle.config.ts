import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',  // Changed to a supported driver type
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;