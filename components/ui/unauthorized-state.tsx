"use client"

/**
 * Componente para mostrar mensajes amigables cuando el usuario no tiene acceso
 * (errores 401 o 403)
 * Respeta los estilos y colores de la aplicación
 */

import { ShieldX, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UnauthorizedStateProps {
  /** Código de estado HTTP (401 o 403) */
  statusCode: 401 | 403
  /** Mensaje personalizado (opcional) */
  message?: string
  /** Título personalizado (opcional) */
  title?: string
}

export function UnauthorizedState({ 
  statusCode, 
  message,
  title 
}: UnauthorizedStateProps) {
  const router = useRouter()

  const isForbidden = statusCode === 403

  const defaultTitle = isForbidden 
    ? "Acceso Denegado" 
    : "Sesión Expirada"

  const defaultMessage = isForbidden
    ? "No cuentas con los permisos necesarios para acceder a esta sección. Por favor, contacta al administrador si necesitas acceso."
    : "Tu sesión ha expirado. Por favor, inicia sesión nuevamente para continuar."

  const Icon = isForbidden ? ShieldX : Lock

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icono */}
        <div className="flex justify-center">
          <div className={cn(
            "p-6 rounded-full",
            isForbidden 
              ? "bg-orange-100 dark:bg-orange-900/20" 
              : "bg-primary-100 dark:bg-primary-900/20"
          )}>
            <Icon className={cn(
              "w-16 h-16",
              isForbidden 
                ? "text-orange-600 dark:text-orange-400" 
                : "text-primary-600 dark:text-primary-400"
            )} />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h2 className={cn(
            "text-2xl font-bold",
            isForbidden 
              ? "text-orange-900 dark:text-orange-100" 
              : "text-primary-900 dark:text-primary-100"
          )}>
            {title || defaultTitle}
          </h2>
          <p className="text-primary-700 dark:text-primary-300 text-base leading-relaxed">
            {message || defaultMessage}
          </p>
        </div>

        {/* Acciones */}
        {!isForbidden && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => router.push('/login')}
              className="bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Iniciar Sesión
            </Button>
          </div>
        )}

        {/* Información adicional */}
        <div className="pt-6 border-t border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-600 dark:text-primary-400">
            Código de error: {statusCode}
          </p>
        </div>
      </div>
    </div>
  )
}

