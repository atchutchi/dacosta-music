/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para não pré-renderizar páginas administrativas
  experimental: {
    // Remover appDir que está causando o aviso
  },
  // Configuração para imagens externas
  images: {
    domains: [
      'localhost', 
      'supabase.co', 
      'storage.googleapis.com',
      'oxplahazlmpcpkelpolv.supabase.co' // Domínio específico do seu projeto Supabase
    ],
    // Remover unoptimized: true para permitir que o Next.js otimize as imagens
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
