import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Mock data for demonstration purposes
// In a real application, this would come from a database or cloud storage
const mockVideos: Record<string, Array<{ name: string; url: string }>> = {
  'project1': [
    { name: 'video1.mp4', url: '/uploads/project1/final-videos/video1.mp4' },
    { name: 'video2.mp4', url: '/uploads/project1/final-videos/video2.mp4' }
  ],
  'project2': [
    { name: 'presentation.mp4', url: '/uploads/project2/final-videos/presentation.mp4' }
  ]
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get projectId from URL: /api/videos/[projectId]/list -> projectId
    const projectId = request.nextUrl.pathname.split('/')[3];
    
    // Check authentication
    const { isAuthenticated, user } = await auth(request);
    if (!isAuthenticated || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return mock data for the project
    // In a real application, this would query a database or cloud storage
    const videos = mockVideos[projectId] || [];

    return NextResponse.json({
      success: true,
      videos
    });
  } catch (error) {
    console.error('Error listing videos:', error);
    return NextResponse.json(
      { error: 'Failed to list videos' },
      { status: 500 }
    );
  }
} 