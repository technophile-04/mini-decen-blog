/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ipfs.io",
      "ipfs.fleek.co",
      "res.cloudinary.com",
      "ipfs.fleek.io",
      "cloudflare-ipfs.com",
      "arweave.net",
      "ipfs.infura.io",
      "images.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
