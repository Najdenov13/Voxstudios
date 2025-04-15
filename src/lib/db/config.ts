import { createPool } from '@vercel/postgres';

// The pool will be automatically configured using environment variables
// POSTGRES_URL, POSTGRES_PRISMA_URL, POSTGRES_URL_NON_POOLING, POSTGRES_USER,
// POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_DATABASE
export const db = createPool();

// Helper function to check database connection
export async function checkConnection() {
  try {
    const client = await db.connect();
    await client.query('SELECT NOW()');
    client.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
} 