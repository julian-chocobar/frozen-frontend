"use client"

import type React from "react"
import { useState } from "react"

/**
 * Componente Header - Encabezado principal
 * - Título de página / breadcrumb
 * - Notificaciones con badge
 * - Avatar de usuario
 * - Menú móvil funcional
 * - Responsive
 */

import { Bell, User, Menu, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileMenu } from "./mobile-menu"

interface HeaderProps {
  title: string
  subtitle?: string
  notificationCount?: number
  actionButton?: React.ReactNode
}

export function Header({ title, subtitle, notificationCount = 0, actionButton }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
            <h1 className="text-base md:text-lg lg:text-xl font-semibold text-primary-800 truncate">{title}</h1>
            {subtitle && <p className="text-xs md:text-sm text-primary-600 hidden md:block truncate">{subtitle}</p>}
          </div>
        </div>

        {/* Derecha: Botón de acción, Notificaciones y usuario */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {actionButton}

          {/* Notificaciones */}
          <button
            className={cn(
              "relative p-2 sm:p-3 hover:bg-surface-secondary rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
            )}
            aria-label={`Notificaciones${notificationCount > 0 ? ` (${notificationCount} nuevas)` : ""}`}
          >
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            {notificationCount > 0 && <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full" />}
          </button>

          {/* Avatar de usuario */}
          <button
            className={cn(
              "flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 pr-3 sm:pr-4 hover:bg-surface-secondary rounded-lg transition-colors border border-stroke",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
            )}
            aria-label="Menú de usuario"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-foreground">Admin Usuario</p>
              <p className="text-xs text-primary-600">Maestro Cervecero</p>
            </div>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-muted hidden lg:block" />
          </button>
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
