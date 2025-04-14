import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import 'dotenv/config';

async function getSharePointIds() {
  try {
    // Initialize credentials
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID!,
      process.env.AZURE_CLIENT_ID!,
      process.env.AZURE_CLIENT_SECRET!
    );

    // Get access token
    const token = await credential.getToken('https://graph.microsoft.com/.default');

    // Initialize Graph client
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, token.token);
      },
    });

    // Get site ID
    const site = await graphClient
      .api('/sites/adamass.sharepoint.com:/sites/VoxStudiosplatform')
      .get();
    
    console.log('\nSite Information:');
    console.log('Site ID:', site.id);
    console.log('Site Name:', site.displayName);

    // Get drive ID
    const drives = await graphClient
      .api(`/sites/${site.id}/drives`)
      .get();

    console.log('\nDrive Information:');
    drives.value.forEach((drive: any) => {
      console.log('Drive ID:', drive.id);
      console.log('Drive Name:', drive.name);
      console.log('---');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

getSharePointIds(); 