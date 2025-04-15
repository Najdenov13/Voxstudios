import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all projects from the database
    const result = await db.query(
      'SELECT id, name, created_at FROM projects ORDER BY created_at DESC'
    );

    const projects = result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      createdAt: row.created_at
    }));

    return res.status(200).json({ projects });
  } catch (error) {
    console.error('Error listing projects:', error);
    return res.status(500).json({ error: 'Failed to list projects' });
  }
} 