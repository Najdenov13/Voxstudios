import { NextApiRequest, NextApiResponse } from 'next';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create projects directory if it doesn't exist
    const projectsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    await mkdir(projectsDir, { recursive: true });

    // Create project directory
    const projectDir = path.join(projectsDir, projectName);
    await mkdir(projectDir, { recursive: true });

    // Create project metadata file
    const metadata = {
      name: projectName,
      createdAt: new Date().toISOString(),
      stages: {
        stage1: { completed: false },
        stage2: { completed: false },
        stage3: { completed: false },
        stage4: { completed: false }
      }
    };

    await writeFile(
      path.join(projectDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Create stage directories
    const stages = ['stage1', 'stage2', 'stage3', 'stage4'];
    for (const stage of stages) {
      await mkdir(path.join(projectDir, stage), { recursive: true });
    }

    return res.status(200).json({ 
      success: true, 
      project: {
        id: projectName,
        name: projectName,
        createdAt: metadata.createdAt
      }
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Failed to process the request: ' + (error as Error).message });
  }
} 