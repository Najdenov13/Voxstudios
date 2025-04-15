import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import { auth } from '@/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const { isAuthenticated, user } = await auth(request);
    if (!isAuthenticated || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const accessToken = formData.get('accessToken') as string;

    if (!file || !accessToken) {
      return NextResponse.json(
        { error: 'File and access token are required' },
        { status: 400 }
      );
    }

    const client = Client.init({
      authProvider: (done) => {
        done(null, accessToken || null);
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
      .api(`/drives/${driveItem.parentReference.driveId}/items/${driveItem.id}:/${file.name}:/createUploadSession`)
      .post({
        item: {
          "@microsoft.graph.conflictBehavior": "rename",
          name: file.name,
          fileSize: file.size
        },
      });

    return NextResponse.json({
      uploadUrl: uploadSession.uploadUrl,
      folderPath: `Teams > ${teamId} > ${channelId} > ${file.name}`,
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