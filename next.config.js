/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure for local file storage
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'voxstudios.blob.core.windows.net',
        port: '',
        pathname: '/videos/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  // Remove the serverless config and use Vercel's configuration file instead
};

module.exports = nextConfig; 