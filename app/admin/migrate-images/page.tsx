'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { BUCKET_PRODUCTS } from '@/lib/supabase/storage'
import { migratePublicImageToStorage } from '@/lib/supabase/migration'

interface MigrationResult {
  originalPath: string
  newUrl: string | null
  success: boolean
  error?: string
}

export default function MigrateImagesPage() {
  const [isMigrating, setIsMigrating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<MigrationResult[]>([])
  const [currentFile, setCurrentFile] = useState('')

  // Lista de imagens para migrar (produtos)
  const imagesToMigrate = [
    '/images/Mock-Up-Front-HQ.webp',
    '/images/Mock-Up-Back-HQ.webp',
    // Adicione mais imagens aqui se necessário
  ]

  // Lista COMPLETA de imagens (todas do /public/images)
  const allImages = [
    '/images/artist-jet.webp',
    '/images/artists-duo.webp',
    '/images/Caiiro-IV.webp',
    '/images/caiiro-logo-branco.webp',
    '/images/caiiro-photo-profile.webp',
    '/images/Caiiro-VIII.svg',
    '/images/Caiiro-VIII.webp',
    '/images/club-view.webp',
    '/images/concert-phones.webp',
    '/images/crowd-lights.webp',
    '/images/crowd-pattern.webp',
    '/images/Da-Capo-IX.webp',
    '/images/da-capo-photo-profile.webp',
    '/images/da-capo-photo.webp',
    '/images/Da-Capo-VIII.webp',
    '/images/da-capo-X.svg',
    '/images/da-capo-X.webp',
    '/images/dj-closeup.webp',
    '/images/dj-duo.webp',
    '/images/dj-performance-1.webp',
    '/images/dj-performance-2.webp',
    '/images/dj-red-light.webp',
    '/images/dj-white-shirt.webp',
    '/images/DSCF6032.webp',
    '/images/enoo_napa_logotipo.svg',
    '/images/enoo-napa-i.webp',
    '/images/enoo-napa-logo-official-05.webp',
    '/images/enoo-napa-logo-official-07.webp',
    '/images/enoo-napa-photo-profile.webp',
    '/images/enoo-napa-photo.webp',
    '/images/Enoo-Napa0374.svg',
    '/images/Enoo-Napa0374.webp',
    '/images/hero-dj-booth.webp',
    '/images/logo-branco-da-capo.webp',
    '/images/logo-branco-dacosta.webp',
    '/images/logo-branco-enoo-napa.webp',
    '/images/logo-white.webp',
    '/images/Mock-Up-Back-HQ.webp',
    '/images/Mock-Up-Front-HQ.webp',
    '/images/whitefinal.webp',
  ]

  async function migrateImages(imageList: string[], bucket: string = BUCKET_PRODUCTS) {
    setIsMigrating(true)
    setProgress(0)
    setResults([])

    const migrationResults: MigrationResult[] = []
    const total = imageList.length

    for (let i = 0; i < imageList.length; i++) {
      const imagePath = imageList[i]
      setCurrentFile(imagePath)
      
      try {
        const result = await migratePublicImageToStorage(imagePath, bucket, 'products')
        migrationResults.push(result)
        
        setProgress(((i + 1) / total) * 100)
      } catch (error: any) {
        migrationResults.push({
          originalPath: imagePath,
          newUrl: null,
          success: false,
          error: error.message
        })
      }

      // Pequena pausa para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setResults(migrationResults)
    setIsMigrating(false)
    setCurrentFile('')
  }

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Admin
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mt-2">Migrar Imagens para Supabase Storage</h1>
          <p className="text-white/60 mt-2">
            Migre imagens de /public/images para o bucket do Supabase Storage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controles */}
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle>Opções de Migração</CardTitle>
              <CardDescription>
                Escolha quais imagens migrar para o Supabase Storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-500/10 border-blue-500/50">
                <AlertDescription className="text-blue-300">
                  <strong>Nota:</strong> As imagens serão copiadas para o bucket 'products' no Supabase.
                  Os arquivos originais em /public permanecerão intactos.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={() => migrateImages(imagesToMigrate)}
                  disabled={isMigrating}
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  {isMigrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Migrar Imagens do Produto Caiiro (2 imagens)
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => migrateImages(allImages)}
                  disabled={isMigrating}
                  variant="outline"
                  className="w-full"
                >
                  {isMigrating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Migrando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Migrar TODAS as Imagens ({allImages.length} arquivos)
                    </>
                  )}
                </Button>
              </div>

              {isMigrating && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-white/60">
                    {progress.toFixed(0)}% completo
                  </p>
                  <p className="text-xs text-white/40">
                    {currentFile}
                  </p>
                </div>
              )}

              {results.length > 0 && !isMigrating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">✓ Sucesso: {successCount}</span>
                    <span className="text-red-400">✗ Erro: {errorCount}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resultados */}
          <Card className="bg-black border-white/10">
            <CardHeader>
              <CardTitle>Resultados da Migração</CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <p className="text-white/40 text-sm">
                  Clique em um dos botões para iniciar a migração
                </p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.success
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {result.originalPath}
                          </p>
                          {result.success ? (
                            <p className="text-xs text-white/60 mt-1 truncate">
                              ✓ {result.newUrl}
                            </p>
                          ) : (
                            <p className="text-xs text-red-300 mt-1">
                              {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6 bg-yellow-500/10 border-yellow-500/50">
          <AlertDescription className="text-yellow-300">
            <strong>Importante:</strong> Antes de migrar, certifique-se de que:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>O bucket 'products' existe no Supabase Storage</li>
              <li>As políticas de storage foram configuradas</li>
              <li>Você está autenticado como admin</li>
              <li>O servidor Next.js está rodando</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

