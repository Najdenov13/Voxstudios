import { NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { getToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { fileName, fileSize, fileType } = await req.json();

    // Get access token for Microsoft Graph API
    const accessToken = await getToken();

    // Initialize Microsoft Graph client
    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });

    // Define the Teams folder path where you want to upload
    const teamId = process.env.TEAMS_TEAM_ID;
    const channelId = process.env.TEAMS_CHANNEL_ID;

    if (!teamId || !channelId) {
      throw new Error('Teams configuration is missing');
    }

    // Create upload session
    const driveItem = await client
      .api(`/teams/${teamId}/channels/${channelId}/filesFolder`)
      .get();

    const uploadSession = await client
      .api(`/drives/${driveItem.parentReference.driveId}/items/${driveItem.id}:/${fileName}:/createUploadSession`)
      .post({
        item: {
          "@microsoft.graph.conflictBehavior": "rename",
          name: fileName,
          fileSize: fileSize
        },
      });

    return NextResponse.json({
      uploadUrl: uploadSession.uploadUrl,
      folderPath: `Teams > ${teamId} > ${channelId} > ${fileName}`,
      expirationDateTime: uploadSession.expirationDateTime
    });
  } catch (error) {
    console.error('Error setting up file upload:', error);
    return NextResponse.json(
      { error: 'Failed to set up file upload: ' + (error as Error).message },
      { status: 500 }
    );
  }
} 