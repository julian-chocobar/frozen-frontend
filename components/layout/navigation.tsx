/**
 * Componente Navigation genérico reutilizable
 * Maneja tanto sidebar como bottom bar con diferentes layouts
 */

"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Package, ClipboardList, Activity, FileText, Settings, LayoutDashboard, ArrowRightLeft, Package2, BeerIcon, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavLink } from "./nav-link"

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Materias",
    href: "/materiales?estado=Activo",
    icon: Package,
  },
  {
    label: "Movimientos",
    href: "/movimientos",
    icon: ArrowRightLeft,
  },
  {
    label: "Packagings",
    href: "/packagings",
    icon: Package2,
  },
  {
    label: "Productos",
    href: "/productos",
    icon: BeerIcon,
  },
  {
    label: "Ordenes",
    href: "/ordenes",
    icon: ClipboardList,
  },
  {
    label: "Seguimiento",
    href: "/seguimiento",
    icon: Activity,
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: FileText,
  },
  {
    label: "Config",
    href: "/configuracion",
    icon: Settings,
  },
]

// Elementos prioritarios para mostrar en bottom-bar móvil (máximo 5 para mejor UX)
export const mobileNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Materias",
    href: "/materiales?estado=Activo",
    icon: Package,
  },
  {
    label: "Movimientos",
    href: "/movimientos",
    icon: ArrowRightLeft,
  },
  {
    label: "Productos",
    href: "/productos",
    icon: BeerIcon,
  },
  {
    label: "Ordenes",
    href: "/ordenes",
    icon: ClipboardList,
  },
]

// Función helper para determinar si una ruta está activa
export function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    // Para el dashboard, solo está activo si estamos exactamente en "/"
    return pathname === "/"
  }
  
  // Para otras rutas, verificar si el pathname empieza con la ruta
  return pathname.startsWith(href)
}

interface NavigationProps {
  variant: 'sidebar' | 'bottom-bar'
  className?: string
}

export function Navigation({ variant, className }: NavigationProps) {
  const pathname = usePathname()

  if (variant === 'sidebar') {
    return (
      <aside className={cn("hidden md:flex flex-col bg-background border-r border-stroke w-[72px]", className)}>
        {/* Logo */}
        <NavLink href="/" className="flex items-center justify-center h-20 hover:bg-surface-secondary transition-colors">
          <div className="w-18 h-18 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
            <img 
              src="/Frozen-image.png" 
              alt="Frozen Cervecería Artesanal" 
              className="w-full h-full object-contain"
            />
          </div>
        </NavLink>

        {/* Navegación con tooltips */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = isRouteActive(pathname, item.href)

              return (
                <li key={item.href} className="relative group">
                  <NavLink
                    href={item.href}
                    className={cn(
                      "flex items-center justify-center w-full h-12 rounded-lg transition-all",
                      "hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-300",
                      isActive ? "bg-primary-700 text-white shadow-sm" : "text-foreground hover:text-primary-700",
                    )}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5" />
                  </NavLink>
                  {/* Tooltip en hover */}
                  <div
                    className={cn(
                      "absolute left-full ml-2 top-1/2 -translate-y-1/2",
                      "px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md",
                      "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                      "transition-all duration-200 pointer-events-none whitespace-nowrap z-50",
                    )}
                  >
                    {item.label}
                    {/* Flecha del tooltip */}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    )
  }

  // Bottom bar variant
  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-stroke z-50",
        className
      )}
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      <ul className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const Icon = item.icon
          const isActive = isRouteActive(pathname, item.href)

          return (
            <li key={item.href} className="flex-1">
              <NavLink
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-full",
                  "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-inset",
                  "transition-colors",
                  isActive
                    ? "text-primary-600 bg-primary-50"
                    : "text-muted hover:text-foreground hover:bg-surface-secondary",
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
