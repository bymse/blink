/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/ws-api/:path*',
        destination: 'http://localhost:8000/ws-api/:path*',
      },
    ]
  }
}

module.exports = nextConfig
