/**
 * Proveedor de contexto para el estado de navegación
 * Gestiona el estado de carga global durante la navegación entre páginas
 */

"use client"

import type React from "react"
import { Suspense } from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

interface NavigationContextType {
  isNavigating: boolean
  startNavigation: () => void
  stopNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType>({
  isNavigating: false,
  startNavigation: () => {},
  stopNavigation: () => {},
})

export function useNavigation() {
  return useContext(NavigationContext)
}

// Inner component that uses useSearchParams
function NavigationProviderInner({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const startNavigation = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const stopNavigation = useCallback(() => {
    setIsNavigating(false)
  }, [])

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => {
        setIsNavigating(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isNavigating])

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigation, stopNavigation }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <NavigationProviderInner>
        {children}
      </NavigationProviderInner>
    </Suspense>
  )
}
