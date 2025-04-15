import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { fileInfo, fileBuffer } = await request.json();

    if (!fileInfo || !fileBuffer) {
      return NextResponse.json({ error: 'Missing file information or data' }, { status: 400 });
    }

    try {
      console.log('Getting Azure credentials...');
      // Get access token using client credentials
      const credential = new ClientSecretCredential(
        process.env.AZURE_TENANT_ID!,
        process.env.AZURE_CLIENT_ID!,
        process.env.AZURE_CLIENT_SECRET!
      );

      console.log('Getting token...');
      const token = await credential.getToken('https://graph.microsoft.com/.default');
      
      // Initialize Graph client
      const client = Client.init({
        authProvider: (done) => {
          done(null, token.token);
        },
      });

      console.log('Getting SharePoint site...');
      // First get the site
      const site = await client.api('/sites/adamass.sharepoint.com:/sites/VoxStudiosplatform')
        .get();

      console.log('Getting drive...');
      // Then get the drive
      const drive = await client.api(`/sites/${site.id}/drives`)
        .get();

      // Create folder structure for different file types
      let folderPath = fileInfo.projectName;
      if (fileInfo.type.startsWith('audio/')) {
        folderPath += '/voices';
      } else if (fileInfo.type.startsWith('video/')) {
        folderPath += '/videos';
      } else if (fileInfo.type.startsWith('text/')) {
        folderPath += '/documents';
      }

      // Get the project folder path
      const projectFolderPath = `${folderPath}/${fileInfo.name}`;
      console.log('Uploading to path:', projectFolderPath);

      // Upload to the project folder
      const response = await client.api(`/sites/${site.id}/drives/${drive.value[0].id}/items/root:/${projectFolderPath}:/content`)
        .put(Buffer.from(fileBuffer));

      console.log('Upload successful:', response);

      return NextResponse.json({ 
        success: true,
        message: `File uploaded successfully to project folder: ${projectFolderPath}`,
        fileUrl: response.webUrl
      });

    } catch (err) {
      console.error('Failed to upload to SharePoint:', err);
      return NextResponse.json(
        { error: 'Failed to upload to SharePoint: ' + (err as Error).message },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 