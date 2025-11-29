'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { logger } from '@/lib/logger'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')
  const supabase = createClientClient()

  useEffect(() => {
    checkAuth()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      } else if (event === 'SIGNED_IN' && session) {
        checkAuth()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function checkAuth() {
    try {
      setIsChecking(true)
      setError(null)

      // Verificar se está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.log('Not authenticated, redirecting to login')
        router.push('/login?redirect=/admin')
        return
      }

      setUserEmail(user.email || '')

      // Verificar se é admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError) {
        logger.error('Error fetching profile:', profileError)
        setError('Erro ao verificar permissões. A tabela profiles pode não estar configurada.')
        setIsChecking(false)
        return
      }

      // @ts-ignore - TypeScript type narrowing issue with Supabase client
      if (!profile || profile.role !== 'admin') {
        // @ts-ignore - TypeScript type narrowing issue with Supabase client
        logger.log('User is not admin:', { email: user.email, role: profile?.role })
        // @ts-ignore - TypeScript type narrowing issue with Supabase client
        setError(`Acesso negado. Você não tem permissões de administrador. Role atual: ${profile?.role || 'não definido'}`)
        setIsChecking(false)
        return
      }

      // Usuário autenticado e é admin
      setIsAuthorized(true)
      setIsChecking(false)
    } catch (err) {
      console.error('Error in checkAuth:', err)
      setError('Erro ao verificar autenticação')
      setIsChecking(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Mostrar loading enquanto verifica
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-white" />
          <p className="text-white/80">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Mostrar erro se não autorizado
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-white">
              {error}
            </AlertDescription>
          </Alert>
          
          {userEmail && (
            <p className="text-white/60 text-sm text-center">
              Conectado como: {userEmail}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full"
            >
              Fazer Logout
            </Button>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Voltar ao Site
              </Button>
            </Link>
          </div>

          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <p className="text-white/80 text-sm mb-2">
              <strong>Como resolver:</strong>
            </p>
            <ol className="text-white/60 text-xs space-y-1 list-decimal list-inside">
              <li>Acesse o Supabase Dashboard</li>
              <li>Execute o script: scripts/fix-admin-authentication.sql</li>
              <li>Substitua o email pelo seu no script</li>
              <li>Faça logout e login novamente</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  // Se autorizado, mostrar conteúdo com header
  if (isAuthorized) {
    return (
      <div className="min-h-screen bg-black">
        {/* Admin Header */}
        <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-white font-bold text-lg hover:text-white/80 transition-colors">
                Admin Panel
              </Link>
              <span className="text-white/40">|</span>
              <span className="text-white/60 text-sm">{userEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Ver Site
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
        
        {/* Admin Content */}
        {children}
      </div>
    )
  }

  return null
}

