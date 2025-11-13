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
  
  // Configuração para imagens externas - Otimizada para performance
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Otimizado em produção no Vercel
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
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
  },
}

export default nextConfig
