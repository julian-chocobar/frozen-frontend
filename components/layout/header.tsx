"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Bell, User, Menu, ChevronDown, LogOut, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileMenu } from "./mobile-menu"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

interface HeaderProps {
  title: string
  subtitle?: string
  notificationCount?: number
  actionButton?: React.ReactNode
}

export function Header({ title, subtitle, notificationCount = 0, actionButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  const { user, logout, isAuthenticated } = useAuth()

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error("Error durante logout:", error)
    }
  }

  // Si no está autenticado, no mostrar el header completo
  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-40 bg-background border-b border-stroke">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-primary-800">{title}</h1>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background border-b border-stroke">
        <div className="flex items-center justify-between h-16 px-2 sm:px-4 md:px-6">
          {/* Izquierda: Título y breadcrumb */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Botón de menú móvil funcional */}
            <button
              className="md:hidden p-2 hover:bg-surface-secondary rounded-lg transition-colors flex-shrink-0"
              aria-label="Abrir menú"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg lg:text-xl font-semibold text-primary-800 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-primary-600 hidden md:block truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Derecha: Botón de acción, Notificaciones y usuario */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
            {actionButton}

            {/* Notificaciones */}
            <button
              className={cn(
                "relative p-2 sm:p-3 hover:bg-surface-secondary rounded-lg transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-300"
              )}
              aria-label={`Notificaciones${notificationCount > 0 ? ` (${notificationCount} nuevas)` : ""}`}
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Avatar de usuario con menú desplegable */}
            <div className="relative" ref={userMenuRef}>
              <button
                className={cn(
                  "flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 pr-3 sm:pr-4 hover:bg-surface-secondary rounded-lg transition-colors border border-stroke",
                  "focus:outline-none focus:ring-2 focus:ring-primary-300"
                )}
                aria-label="Menú de usuario"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user?.username || "Usuario"}
                  </p>
                  <p className="text-xs text-primary-600 capitalize">
                    {user?.roles?.[0]?.toLowerCase() || "Usuario"}
                  </p>
                </div>
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 sm:w-5 sm:h-5 text-muted hidden lg:block transition-transform",
                    isUserMenuOpen && "rotate-180"
                  )} 
                />
              </button>

              {/* Menú desplegable del usuario */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-stroke rounded-lg shadow-card z-50">
                  {/* Perfil */}
                  <Link
                    href="/perfil"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-stroke"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Mi perfil</span>
                  </Link>

                  {/* Gestión de Usuarios - Solo para ADMIN */}
                  {user?.roles?.includes('ADMIN') && (
                    <Link
                      href="/usuarios"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary transition-colors border-b border-stroke"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Users className="w-4 h-4" />
                      <span>Gestión de Usuarios</span>
                    </Link>
                  )}

                  {/* Cerrar sesión */}
                  <button
                    className="flex items-center gap-3 px-4 py-3 hover:bg-surface-secondary transition-colors w-full text-left text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  )
}