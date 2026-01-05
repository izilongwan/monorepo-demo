/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: {
    unoptimized: true,
  },
  rewrites: async () => {
    return [
      {
        source: '/apig/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_PROXY_TARGET}/:path*`, // Proxy to Backend
      },
    ];
  },
}

module.exports = nextConfig
