"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClientClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [accessDenied, setAccessDenied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientClient()
  
  const redirectTo = searchParams.get('redirect') || '/admin'
  
  useEffect(() => {
    // Verificar se veio de uma página que requer autenticação
    if (searchParams.get('access') === 'denied') {
      setAccessDenied(true)
      setError('Você precisa fazer login para acessar esta página')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data?.user) {
        console.log("Login bem-sucedido:", data.user)

        // Redirecionar para a página original ou admin
        const destination = redirectTo || '/admin'
        console.log("Redirecting to:", destination)

        // Use both router.push and window.location for more reliable redirection
        router.push(destination)

        // Force a hard navigation to ensure the session is applied
        setTimeout(() => {
          window.location.href = destination
        }, 100)
      }
    } catch (err) {
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
      <div className="mb-8 w-full max-w-[200px]">
        <Image src="/images/logo-white.webp" alt="Da Costa Music" width={200} height={80} className="w-full" priority />
      </div>

      <Card className="w-full max-w-md border-gray-800 bg-black text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white">Login</CardTitle>
          <CardDescription className="text-gray-400">
            Entre com suas credenciais para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {accessDenied && (
              <Alert className="border-yellow-800 bg-yellow-950 text-yellow-300">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Você precisa fazer login para acessar o painel administrativo
                </AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="border-red-800 bg-red-950 text-red-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Link href="/reset-password" className="text-sm text-gray-400 hover:text-white">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-700 bg-gray-900 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-gray-400">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-white hover:underline">
                Registre-se
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4">
        <div className="mb-8 w-full max-w-[200px]">
          <Image src="/images/logo-white.webp" alt="Da Costa Music" width={200} height={80} className="w-full" priority />
        </div>
        <Card className="w-full max-w-md border-gray-800 bg-black text-white">
          <CardContent className="pt-6">
            <p className="text-center text-gray-400">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
