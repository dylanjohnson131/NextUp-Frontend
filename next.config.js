/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5164/api/:path*',
      },
      {
        source: '/auth/:path*',
        destination: 'http://localhost:5164/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig
