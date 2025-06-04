/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure firebase-admin is not bundled for client-side
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        events: false,
        stream: false,
        util: false,
        path: false,
        crypto: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        assert: false,
        url: false,
        buffer: false,
        process: false,
      }
    }
    return config
  },
}

export default nextConfig
