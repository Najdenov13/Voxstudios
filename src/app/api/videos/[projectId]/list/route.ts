import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';
import { existsSync } from 'fs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get projectId from URL: /api/videos/[projectId]/list -> projectId
    const projectId = request.nextUrl.pathname.split('/')[3];
    
    const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const projectPath = path.join(publicUploadsPath, projectId);
    const videosPath = path.join(projectPath, 'final-videos');

    // Check authentication
    const { isAuthenticated, user } = await auth(request);
    if (!isAuthenticated || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if directory exists before trying to read it
    if (!existsSync(videosPath)) {
      return NextResponse.json({
        success: true,
        videos: []
      });
    }

    try {
      const files = await readdir(videosPath);
      const videos = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.mp4', '.webm', '.mov', '.avi'].includes(ext);
      });

      return NextResponse.json({
        success: true,
        videos: videos.map(name => ({
          name,
          url: `/uploads/${projectId}/final-videos/${encodeURIComponent(name)}`
        }))
      });
    } catch (error) {
      console.error('Error accessing videos directory:', error);
      return NextResponse.json({
        success: true,
        videos: []
      });
    }
  } catch (error) {
    console.error('Error listing videos:', error);
    return NextResponse.json(
      { error: 'Failed to list videos' },
      { status: 500 }
    );
  }
} 