import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.bananaprompts.xyz',
      },
    ],
  },
  experimental:{
    serverActions:{
      bodySizeLimit: '5mb',
    }
  }
};

export default nextConfig;
