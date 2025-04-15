import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId;
    const prefix = `uploads/${projectId}/final-videos/`;

    // List all videos in the project's final-videos directory
    const { blobs } = await list({ prefix });

    // Filter video files by extension
    const videos = blobs.filter(blob => {
      const ext = blob.pathname.split('.').pop()?.toLowerCase();
      return ['mp4', 'webm', 'mov', 'avi'].includes(ext || '');
    });

    return NextResponse.json({
      success: true,
      videos: videos.map(blob => ({
        name: blob.pathname.split('/').pop() || '',
        url: blob.url
      }))
    });
  } catch (error) {
    console.error('Error listing videos:', error);
    return NextResponse.json(
      { error: 'Failed to list videos' },
      { status: 500 }
    );
  }
} 