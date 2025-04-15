import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get projectId from URL: /api/videos/[projectId]/list -> projectId
    const projectId = request.nextUrl.pathname.split('/')[3];
    
    const publicUploadsPath = path.join(process.cwd(), 'public', 'uploads');
    const videosPath = path.join(publicUploadsPath, projectId, 'final-videos');

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
      // If directory doesn't exist or can't be read, return empty list
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