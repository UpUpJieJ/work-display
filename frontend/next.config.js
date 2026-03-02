/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Enable dynamic rendering for pages that depend on external API
  dynamicParams: true,
  // Treat dynamic routes as non-static to avoid build-time API calls
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Skip static generation errors during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  }
}

module.exports = nextConfig
