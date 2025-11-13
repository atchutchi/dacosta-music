'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClientClient } from '@/lib/supabase/client'
import { BUCKET_PRODUCTS } from '@/lib/supabase/storage'

export default function TestUploadPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function testStorage() {
    setLoading(true)
    try {
      const supabase = createClientClient()
      
      // Verificar autenticação
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      const authResult = {
        authenticated: !!user,
        userEmail: user?.email,
        authError: authError?.message
      }
      
      // Listar buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      
      const bucketsResult = {
        totalBuckets: buckets?.length || 0,
        allBuckets: buckets?.map(b => ({ name: b.name, public: b.public })) || [],
        bucketsError: bucketsError?.message,
        productsBucket: buckets?.find(b => b.name === 'products') || null
      }
      
      // Tentar listar arquivos no bucket products
      let filesResult = null
      if (buckets?.find(b => b.name === 'products')) {
        const { data: files, error: filesError } = await supabase.storage
          .from('products')
          .list('', { limit: 10 })
        
        filesResult = {
          files: files?.length || 0,
          filesError: filesError?.message
        }
      }
      
      setResult({
        ...authResult,
        ...bucketsResult,
        filesResult,
        timestamp: new Date().toISOString()
      })
    } catch (error: any) {
      setResult({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-black">
      <div className="container mx-auto px-4">
        <Card className="bg-black border-white/10">
          <CardHeader>
            <CardTitle>Teste de Storage - Client Side</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testStorage} 
              disabled={loading}
              className="bg-white text-black hover:bg-white/90"
            >
              {loading ? 'Testando...' : 'Testar Acesso ao Storage'}
            </Button>
            
            {result && (
              <pre className="bg-white/5 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

