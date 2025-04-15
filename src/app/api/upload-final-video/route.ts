import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const title = formData.get('title') as string;

    if (!file || !projectId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate file name
    const fileName = `${title}${getFileExtension(file.name)}`;
    const blobPath = `uploads/${projectId}/final-videos/${fileName}`;

    // Upload to Vercel Blob Storage
    const blob = await put(blobPath, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        url: blob.url
      }
    });

  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    );
  }
}

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? `.${ext}` : '';
} 