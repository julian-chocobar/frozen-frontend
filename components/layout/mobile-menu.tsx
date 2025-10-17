"use client"

import { useState } from "react"
import { NavLink } from "./nav-link"
import { navItems } from "./navigation"
import { X, Package2, ClipboardList, Activity, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  // Elementos adicionales que no están en el bottom-bar
  const additionalItems = navItems.filter(item => 
    !["Dashboard", "Materias", "Movimientos", "Productos", "Ordenes"].includes(item.label)
  )

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r border-stroke z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stroke">
          <h2 className="text-lg font-semibold text-foreground">Menú</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Secciones adicionales
            </h3>
            
            {additionalItems.map((item) => {
              const Icon = item.icon
              
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "hover:bg-surface-secondary transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-primary-300"
                  )}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {getItemDescription(item.label)}
                    </p>
                  </div>
                </NavLink>
              )
            })}
          </div>

          {/* Footer info */}
          <div className="mt-8 p-3 bg-surface-secondary rounded-lg">
            <p className="text-xs text-muted-foreground">
              Las secciones principales están disponibles en la barra inferior para acceso rápido.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function getItemDescription(label: string): string {
  const descriptions: Record<string, string> = {
    "Packagings": "Administra packagings",
    "Seguimiento": "Monitorea el estado de procesos y entregas",
    "Reportes": "Genera reportes y análisis de datos",
    "Config": "Configuración general de la aplicación"
  }
  
  return descriptions[label] || "Accede a esta sección"
}
