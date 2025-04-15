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
  serverless: {
    maxDuration: 60, // Set to maximum allowed value for Hobby plan
  },
};

module.exports = nextConfig; 