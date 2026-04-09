/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://nextup-api-production.up.railway.app/api/:path*",
      },
      {
        source: "/auth/:path*",
        destination: "https://nextup-api-production.up.railway.app/auth/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
