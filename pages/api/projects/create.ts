import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Client } from '@microsoft/microsoft-graph-client';
import { getToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { projectName } = req.body;

    if (!projectName) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    try {
      console.log('Received project creation request for:', projectName);

      // Create a new directory locally
      const projectDir = path.join(process.cwd(), 'teams', projectName);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }

      console.log('Creating local directory at:', projectDir);

      // Get access token for Microsoft Graph API
      console.log('Obtaining access token for Microsoft Graph API');
      const accessToken = await getToken();
      console.log('Access token obtained');

      // Initialize Microsoft Graph client
      const client = Client.init({
        authProvider: (done) => {
          done(null, accessToken);
        },
      });

      // Define the Teams folder path where you want to create the project folder
      const teamId = process.env.TEAMS_TEAM_ID;
      const channelId = process.env.TEAMS_CHANNEL_ID;

      if (!teamId || !channelId) {
        throw new Error('Teams configuration is missing');
      }

      console.log('Creating folder in Teams for teamId:', teamId, 'channelId:', channelId);

      // Create a new folder in Teams
      const driveItem = await client
        .api(`/teams/${teamId}/channels/${channelId}/filesFolder`)
        .get();

      await client
        .api(`/drives/${driveItem.parentReference.driveId}/items/${driveItem.id}/children`)
        .post({
          name: projectName,
          folder: {},
          "@microsoft.graph.conflictBehavior": "rename"
        });

      console.log('Folder created successfully in Teams');

      return res.status(200).json({ message: 'Project directory created successfully in Teams' });
    } catch (error) {
      console.error('Error creating project directory:', error as Error);
      return res.status(500).json({ error: 'Failed to create project directory: ' + (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 