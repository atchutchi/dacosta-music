/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simplified configuration to fix runtime errors
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Server external packages
  serverExternalPackages: ['sharp'],
  
  // Enhanced compression
  compress: true,
  poweredByHeader: false,
  
  // Configuração para origens permitidas em desenvolvimento
  allowedDevOrigins: [
    'localhost:3000',
    'localhost:3001', 
    '192.168.1.217:3000',
    '192.168.1.217:3001',
    '192.168.50.93:3000',
    '127.0.0.1:3000',
    '0.0.0.0:3000'
  ],
  
  // Configuração para imagens externas - Otimizada para performance
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oxplahazlmpcpkelpolv.supabase.co',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 ano
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    loader: 'default',
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // Simplified webpack configuration
  webpack: (config) => {
    return config
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  env: {
    CSRF_SECRET: process.env.CSRF_SECRET || 'da-costa-music-csrf-secret-key',
    NEXT_PUBLIC_BIT_APP_ID_CAIRO: process.env.NEXT_PUBLIC_BIT_APP_ID_CAIRO,
    // Will add these later:
    // NEXT_PUBLIC_BIT_APP_ID_ENOO_NAPA: process.env.NEXT_PUBLIC_BIT_APP_ID_ENOO_NAPA,
    // NEXT_PUBLIC_BIT_APP_ID_DA_CAPO: process.env.NEXT_PUBLIC_BIT_APP_ID_DA_CAPO,
  },
}

export default nextConfig
