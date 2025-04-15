import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { projectName } = await request.json();

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
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

    return NextResponse.json({ 
      success: true, 
      project: {
        id: projectName,
        name: projectName,
        createdAt: metadata.createdAt
      }
    });
  } catch (error) {
    console.error('Error in handler:', error);
    return NextResponse.json(
      { error: 'Failed to process the request: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 