import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
    ],
  },
  // Optimize for mobile and WebView
  reactStrictMode: true,
  trailingSlash: true, // Better for static hosting
  // Remove headers for WebView compatibility
  compress: false, // Better for WebView performance
}

export default nextConfig
