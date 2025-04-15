import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

// Configure the API route to handle large files
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

    if (!file || !projectName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
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

    try {
      // Verify required environment variables
      const requiredEnvVars = [
        'AZURE_AD_TENANT_ID',
        'AZURE_AD_CLIENT_ID',
        'AZURE_AD_CLIENT_SECRET',
        'TEAMS_TEAM_ID',
        'TEAMS_CHANNEL_ID'
      ];

      for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
          throw new Error(`Missing required environment variable: ${envVar}`);
        }
      }

      // Get Azure credentials
      const credential = new ClientSecretCredential(
        process.env.AZURE_AD_TENANT_ID!,
        process.env.AZURE_AD_CLIENT_ID!,
        process.env.AZURE_AD_CLIENT_SECRET!
      );

      // Get access token
      const token = await credential.getToken('https://graph.microsoft.com/.default');
      
      // Initialize Graph client
      const client = Client.init({
        authProvider: (done) => {
          done(null, token.token);
        },
      });

      // Get Teams drive
      console.log('Attempting to access Teams drive with:', {
        teamId: process.env.TEAMS_TEAM_ID,
        channelId: process.env.TEAMS_CHANNEL_ID
      });

      const teamDrive = await client
        .api(`/teams/${process.env.TEAMS_TEAM_ID}/channels/${process.env.TEAMS_CHANNEL_ID}/filesFolder`)
        .get();

      if (!teamDrive || !teamDrive.id) {
        console.error('Teams drive response:', teamDrive);
        throw new Error('Failed to get Teams drive information');
      }

      console.log('Successfully accessed Teams drive:', {
        driveId: teamDrive.id,
        parentReference: teamDrive.parentReference
      });

      // Create folder structure based on file type
      let folderPath = projectName;
      if (file.type.startsWith('audio/')) {
        folderPath += '/voices';
      } else if (file.type.startsWith('video/')) {
        folderPath += '/videos';
      } else if (file.type.startsWith('text/')) {
        folderPath += '/documents';
      }

      // Create folder structure
      const folders = folderPath.split('/');
      let currentPath = '';
      let parentId = teamDrive.id;

      for (const folder of folders) {
        currentPath = currentPath ? `${currentPath}/${folder}` : folder;
        try {
          console.log(`Attempting to access/create folder: ${folder} in path: ${currentPath}`);
          
          // Try to get the folder
          const folderItem = await client
            .api(`/drives/${teamDrive.parentReference.driveId}/items/${parentId}/children`)
            .filter(`name eq '${folder}' and folder ne null`)
            .get();

          if (folderItem.value && folderItem.value.length > 0) {
            // Folder exists, use its ID
            parentId = folderItem.value[0].id;
            console.log(`Found existing folder: ${folder} with ID: ${parentId}`);
          } else {
            // Create the folder
            console.log(`Creating new folder: ${folder}`);
            const newFolder = await client
              .api(`/drives/${teamDrive.parentReference.driveId}/items/${parentId}/children`)
              .post({
                name: folder,
                folder: {},
                "@microsoft.graph.conflictBehavior": "rename"
              });
            parentId = newFolder.id;
            console.log(`Created new folder: ${folder} with ID: ${parentId}`);
          }
        } catch (error: any) {
          console.error(`Error creating/accessing folder ${folder}:`, error);
          console.error('Full error details:', {
            folder,
            currentPath,
            parentId,
            driveId: teamDrive.parentReference.driveId,
            error: error.message,
            response: error.response?.body
          });
          throw new Error(`Failed to create/access folder ${folder}: ${error.message}`);
        }
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload file to the created folder
      const response = await client
        .api(`/drives/${teamDrive.parentReference.driveId}/items/${parentId}/children/${file.name}/content`)
        .put(buffer);

      return NextResponse.json({ 
        success: true,
        message: 'File uploaded successfully',
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          url: response.webUrl,
          folderPath
        }
      });

    } catch (error) {
      console.error('Teams upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload to Teams: ' + (error as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 