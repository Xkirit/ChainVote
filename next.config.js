/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      process.env.NEXT_PUBLIC_PINATA_GATEWAY,
      'ipfs.io',
      'gateway.pinata.cloud'
    ],
  },
}

module.exports = nextConfig 