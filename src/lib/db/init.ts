import { createTables } from './schema';
import { checkConnection } from './config';

export async function initializeDatabase() {
  try {
    // Check if we can connect to the database
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to the database');
      return false;
    }
    
    // Create tables if they don't exist
    await createTables();
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
} 