import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { projectName } = await request.json();

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Create project metadata
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

    // Store metadata in Blob Storage
    const metadataBlob = await put(
      `projects/${projectName}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      { access: 'public' }
    );

    return NextResponse.json({ 
      success: true, 
      project: {
        id: projectName,
        name: projectName,
        createdAt: metadata.createdAt,
        metadataUrl: metadataBlob.url
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