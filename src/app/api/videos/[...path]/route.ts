import { NextRequest, NextResponse } from 'next/server';
import { list, head } from '@vercel/blob';

export async function GET(
  request: NextRequest,
  context: { params: { path: string[] } }
) {
  try {
    const blobPath = `uploads/${context.params.path.join('/')}`;
    
    // Get the blob metadata
    const { blobs } = await list({ prefix: blobPath });
    
    if (blobs.length === 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    const blob = blobs[0];
    const blobInfo = await head(blob.url);

    if (!blobInfo) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Determine content type based on file extension
    const ext = blobPath.split('.').pop()?.toLowerCase();
    let contentType = 'video/mp4'; // default
    switch (ext) {
      case 'webm':
        contentType = 'video/webm';
        break;
      case 'mov':
        contentType = 'video/quicktime';
        break;
      case 'avi':
        contentType = 'video/x-msvideo';
        break;
      // Add more video types as needed
    }

    // Redirect to the blob URL with appropriate headers
    return NextResponse.redirect(blob.url, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': blobInfo.size.toString(),
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving video:', error);
    return new NextResponse('Error serving video', { status: 500 });
  }
} 