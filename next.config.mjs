/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para desenvolvimento
  experimental: {
    // Remover appDir que está causando o aviso
  },
  
  // Configuração para origens permitidas em desenvolvimento
  allowedDevOrigins: [
    'localhost:3000',
    '192.168.17.16:3000'
  ],
  
  // Configuração para imagens externas - Nova sintaxe (corrigido)
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
    unoptimized: false, // Permitir otimização
  },
  
  // Compressão automática
  compress: true,
  
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
