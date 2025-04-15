import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

// Configure the API route to handle large files
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Create a custom response stream
const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json({ error: 'No request body' }, { status: 400 });
    }

    // Parse the multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectName = formData.get('projectName') as string;
    
    console.log('Received upload request:', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      projectName
    });

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!projectName) {
      return NextResponse.json(
        { error: 'No project specified' },
        { status: 400 }
      );
    }

    // Validate file type - allow video, text, audio, and PDF files
    if (!file.type.startsWith('video/') && 
        !file.type.startsWith('text/') && 
        !file.type.startsWith('audio/') && 
        file.type !== 'application/pdf') {
      console.log('Invalid file type:', file.type);
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only video, text, audio, and PDF files are allowed` },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Return success response with file info
    return NextResponse.json({ 
      success: true,
      message: 'File received successfully',
      fileInfo: {
        name: file.name,
        type: file.type,
        size: file.size,
        projectName
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 