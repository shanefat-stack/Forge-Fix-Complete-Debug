/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    // Don't bundle the Anthropic SDK through webpack — let Node.js load it
    // natively at runtime. This avoids the missing 'encoding' module error
    // from node-fetch inside @anthropic-ai/sdk.
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
};

module.exports = nextConfig;
