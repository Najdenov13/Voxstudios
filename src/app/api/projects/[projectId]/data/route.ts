import { NextRequest, NextResponse } from 'next/server';
import { getProjectData, setProjectData, deleteProjectData, listProjectData } from '@/lib/db/project-data';

// GET /api/projects/[projectId]/data
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = parseInt(params.projectId);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // Check if a specific key was requested
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (key) {
      // Get specific data
      const data = await getProjectData(projectId, key);
      
      if (!data) {
        return NextResponse.json(
          { error: 'Data not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(data);
    } else {
      // List all data for the project
      const data = await listProjectData(projectId);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error in GET /api/projects/[projectId]/data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/data
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = parseInt(params.projectId);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }
    
    const data = await setProjectData(projectId, key, value);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects/[projectId]/data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = parseInt(params.projectId);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // Check if a specific key was requested
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }
    
    await deleteProjectData(projectId, key);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[projectId]/data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 