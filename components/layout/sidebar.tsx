"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Package, ClipboardList, Activity, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavLink } from "./nav-link"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    label: "Materias",
    href: "/materiales",
    icon: Package,
  },
  {
    label: "Producción",
    href: "/produccion",
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

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col bg-background border-r border-stroke w-[72px]">
      {/* Logo - sin línea divisoria */}
      <NavLink href="/" className="flex items-center justify-center h-16 hover:bg-surface-secondary transition-colors">
        <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
          F
        </div>
      </NavLink>

      {/* Navegación con tooltips */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

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
