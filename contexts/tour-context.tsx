"use client"

import { createContext, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useDriver, type DriverStep } from '@/hooks/use-driver'
import { getStepsForRoute, fullTourSteps } from '@/lib/tour-steps'

interface TourContextType {
  startTour: (route?: string) => void
  startFullTour: () => void
  stopTour: () => void
  isRunning: boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { startTour: startDriverTour, stopTour: stopDriverTour, isActive } = useDriver()

  const startTour = (route?: string) => {
    const targetRoute = route || pathname
    const routeSteps = getStepsForRoute(targetRoute)
    
    if (routeSteps.length > 0) {
      startDriverTour(routeSteps)
    }
  }

  const startFullTour = () => {
    startDriverTour(fullTourSteps)
  }

  const stopTour = () => {
    stopDriverTour()
  }

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
