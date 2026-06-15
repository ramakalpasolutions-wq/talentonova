// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'pub-*.r2.dev' },
      { protocol: 'https', hostname: '*.cloudflarestorage.com' },
    ],
  },
}

export default nextConfig