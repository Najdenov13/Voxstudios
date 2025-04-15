/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure for local file storage
  output: 'standalone',
};

module.exports = nextConfig; 