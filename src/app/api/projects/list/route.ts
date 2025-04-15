import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    // List all project metadata files
    const { blobs } = await list({ prefix: 'projects/' });
    
    // Filter and process metadata files
    const projects = await Promise.all(
      blobs
        .filter(blob => blob.pathname.endsWith('/metadata.json'))
        .map(async blob => {
          try {
            const response = await fetch(blob.url);
            const metadata = await response.json();
            
            return {
              id: blob.pathname.split('/')[1], // Get project name from path
              name: metadata.name,
              createdAt: metadata.createdAt
            };
          } catch (error) {
            console.error(`Error reading metadata for project ${blob.pathname}:`, error);
            return null;
          }
        })
    );

    // Filter out any failed reads and sort by creation date
    const validProjects = projects
      .filter((project): project is NonNullable<typeof project> => project !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ projects: validProjects });
  } catch (error) {
    console.error('Error listing projects:', error);
    return NextResponse.json({ error: 'Failed to list projects' }, { status: 500 });
  }
} 