import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const projectsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    
    // Create the directory if it doesn't exist
    try {
      await readdir(projectsDir);
    } catch (error) {
      // Directory doesn't exist, return empty list
      return NextResponse.json({ projects: [] });
    }
    
    // Read all project directories
    const projectDirs = await readdir(projectsDir, { withFileTypes: true });
    const projects = await Promise.all(
      projectDirs
        .filter(dirent => dirent.isDirectory())
        .map(async dirent => {
          try {
            const metadataPath = path.join(projectsDir, dirent.name, 'metadata.json');
            const metadataContent = await readFile(metadataPath, 'utf-8');
            const metadata = JSON.parse(metadataContent);
            
            return {
              id: dirent.name,
              name: metadata.name,
              createdAt: metadata.createdAt
            };
          } catch (error) {
            console.error(`Error reading metadata for project ${dirent.name}:`, error);
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