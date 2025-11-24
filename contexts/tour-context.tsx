"use client"

import { createContext, useContext, ReactNode, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useDriver, type DriverStep } from '@/hooks/use-driver'
import { getStepsForRoute, navigationSteps, getFullTourSteps } from '@/lib/tour-steps'

interface TourContextType {
  startTour: (route?: string) => void
  startFullTour: () => void
  stopTour: () => void
  isRunning: boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { startTour: startDriverTour, stopTour: stopDriverTour, isActive } = useDriver()

  const startTour = useCallback((route?: string) => {
    const targetRoute = route || pathname
    const routeSteps = getStepsForRoute(targetRoute)
    
    if (routeSteps.length > 0) {
      // Si la ruta objetivo es diferente a la actual, navegar primero
      if (targetRoute !== pathname) {
        router.push(targetRoute)
        // Esperar a que la navegación se complete antes de iniciar el tour
        setTimeout(() => {
          startDriverTour(routeSteps)
        }, 300)
      } else {
        startDriverTour(routeSteps)
      }
    }
  }, [pathname, router, startDriverTour])

  const startFullTour = useCallback(() => {
    // Obtener los pasos del tour completo que incluyen navegación
    const fullSteps = getFullTourSteps(pathname, router)
    startDriverTour(fullSteps)
  }, [pathname, router, startDriverTour])

  const stopTour = useCallback(() => {
    stopDriverTour()
  }, [stopDriverTour])

  return (
    <TourContext.Provider
      value={{
        startTour,
        startFullTour,
        stopTour,
        isRunning: isActive,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}
