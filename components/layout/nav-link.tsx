/**
 * Componente de enlace de navegación con indicador de carga
 * Muestra feedback inmediato al usuario cuando hace clic
 */

"use client"

import type React from "react"

import Link from "next/link"
import { useNavigation } from "@/components/providers/navigation-provider"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode
}

export function NavLink({ href, children, onClick, ...props }: NavLinkProps) {
  const { startNavigation } = useNavigation()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Solo iniciar navegación si es una ruta diferente
    if (href !== pathname) {
      startNavigation()
    }

    // Llamar al onClick original si existe
    onClick?.(e)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
