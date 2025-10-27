"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context" // Asegúrate de crear este contexto

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError() // Limpiar errores anteriores

    try {
      await login({ username, password })
      // La redirección se maneja en el useEffect
    } catch (err) {
      // El error ya se maneja en el contexto
      console.error("Error en login:", err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "username") setUsername(value)
    if (field === "password") setPassword(value)
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) clearError()
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Botón de regreso */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Link href="/">
          <Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a inicio
          </Button>
        </Link>
      </div>

      {/* Contenedor principal */}
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/Frozen-icon.png"
              alt="Frozen Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
            Bienvenido a Frozen
          </h1>
          <p className="text-sm text-muted">
            Sistema de Gestión de Producción Cervecera
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-surface border-2 border-border rounded-lg p-6 md:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Usuario (reemplaza Email) */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-foreground">
                Nombre de usuario
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  className="pl-10 h-11"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="pl-10 pr-10 h-11"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mostrar errores */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Botón de inicio de sesión */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}