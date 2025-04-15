import { NextRequest } from 'next/server';
import { getProjectData, setProjectData, deleteProjectData, listProjectData } from '@/lib/db/project-data';

// GET /api/projects/[projectId]/data
export async function GET(request: NextRequest) {
  try {
    const projectId = parseInt(request.nextUrl.pathname.split('/')[3]);
    
    if (isNaN(projectId)) {
      return Response.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // Check if a specific key was requested
    const key = request.nextUrl.searchParams.get('key');
    
    if (key) {
      // Get specific data
      const data = await getProjectData(projectId, key);
      
      if (!data) {
        return Response.json(
          { error: 'Data not found' },
          { status: 404 }
        );
      }
      
      return Response.json(data);
    } else {
      // List all data for the project
      const data = await listProjectData(projectId);
      return Response.json(data);
    }
  } catch (error) {
    console.error('Error in GET /api/projects/[projectId]/data:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/projects/[projectId]/data
export async function POST(request: NextRequest) {
  try {
    const projectId = parseInt(request.nextUrl.pathname.split('/')[3]);
    
    if (isNaN(projectId)) {
      return Response.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { key, value } = body;
    
    if (!key) {
      return Response.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }
    
    const data = await setProjectData(projectId, key, value);
    return Response.json(data, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects/[projectId]/data:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[projectId]/data
export async function DELETE(request: NextRequest) {
  try {
    const projectId = parseInt(request.nextUrl.pathname.split('/')[3]);
    
    if (isNaN(projectId)) {
      return Response.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // Check if a specific key was requested
    const key = request.nextUrl.searchParams.get('key');
    
    if (!key) {
      return Response.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }
    
    await deleteProjectData(projectId, key);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/projects/[projectId]/data:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 