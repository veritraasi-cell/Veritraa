/** @type {import('next').NextConfig} */
const shopifyHostname = process.env.SHOPIFY_STORE_DOMAIN;

const nextConfig = {
  experimental: {
    cpus: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      ...(shopifyHostname
        ? [
            {
              protocol: 'https',
              hostname: shopifyHostname,
            },
            {
              protocol: 'https',
              hostname: 'cdn.shopify.com',
            },
          ]
        : []),
    ],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }

    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
