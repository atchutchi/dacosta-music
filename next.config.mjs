/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enhanced experimental features
  experimental: {
    optimizePackageImports: ['lucide-react'],
    optimizeServerReact: true,
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  
  // Server external packages (moved from experimental)
  serverExternalPackages: [],
  
  // Configuração para origens permitidas em desenvolvimento
  allowedDevOrigins: [
    'localhost:3000',
    'localhost:3001', 
    '192.168.17.16:3000',
    '192.168.17.16:3001'
  ],
  
  // Configuração para imagens externas - Otimizada para performance
  images: {
    remotePatterns: [
      {
        protocol: 'http',
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
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Otimizações de performance
  compress: true,
  poweredByHeader: false,
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Produção optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      }
    }
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

  // Enhanced security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
      {
        source: '/videos/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
