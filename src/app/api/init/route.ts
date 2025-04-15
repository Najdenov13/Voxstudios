import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db/init';

export async function GET() {
  try {
    const success = await initializeDatabase();
    
    if (success) {
      return NextResponse.json({ status: 'success', message: 'Database initialized successfully' });
    } else {
      return NextResponse.json(
        { status: 'error', message: 'Failed to initialize database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { status: 'error', message: 'Internal server error' },
      { status: 500 }
    );
  }
} 