import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Check if project with the same name already exists
    const existingProject = await db.query(
      'SELECT * FROM projects WHERE name = $1',
      [projectName]
    );

    if (existingProject.rows.length > 0) {
      return res.status(400).json({ error: 'A project with this name already exists' });
    }

    // Create project in the database
    const result = await db.query(
      'INSERT INTO projects (name) VALUES ($1) RETURNING id, name, created_at',
      [projectName]
    );

    const project = result.rows[0];

    // Create project metadata in the database
    const metadata = {
      name: projectName,
      createdAt: project.created_at,
      stages: {
        stage1: { completed: false },
        stage2: { completed: false },
        stage3: { completed: false },
        stage4: { completed: false }
      }
    };

    await db.query(
      'INSERT INTO project_data (project_id, key, value) VALUES ($1, $2, $3)',
      [project.id, 'metadata', metadata]
    );

    // Create stage data entries
    const stages = ['stage1', 'stage2', 'stage3', 'stage4'];
    for (const stage of stages) {
      await db.query(
        'INSERT INTO project_data (project_id, key, value) VALUES ($1, $2, $3)',
        [project.id, stage, { completed: false }]
      );
    }

    return res.status(200).json({ 
      success: true, 
      project: {
        id: project.id.toString(),
        name: project.name,
        createdAt: project.created_at
      }
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to process the request: ' + (error as Error).message });
  }
} 