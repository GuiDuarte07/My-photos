/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'gui-galery-project.s3.sa-east-1.amazonaws.com'],
  },
}

module.exports = nextConfig
