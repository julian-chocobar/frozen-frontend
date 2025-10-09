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

export function BottomBar() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-stroke z-50"
      role="navigation"
      aria-label="Navegación principal móvil"
    >
      <ul className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

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
