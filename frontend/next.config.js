/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lawvanta/shared'],
  env: {
    NEXT_PUBLIC_API_URL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, ''),
    NEXT_PUBLIC_WS_URL: (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000').replace(/\/$/, ''),
  },
}

module.exports = nextConfig
