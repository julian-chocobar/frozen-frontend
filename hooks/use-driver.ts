"use client"

import { useCallback, useRef, useEffect, useState } from 'react'
import { driver, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

export interface DriverStep {
  element: string
  popover: {
    title?: string
    description: string
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
  }
}

export interface UseDriverReturn {
  startTour: (steps: DriverStep[]) => void
  stopTour: () => void
  isActive: boolean
}

export function useDriver() {
  const driverRef = useRef<Driver | null>(null)
  const [isActive, setIsActive] = useState(false)

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [])

  const startTour = useCallback((steps: DriverStep[]) => {
    // Convertir pasos al formato de Driver.js
    const driverSteps = steps.map((step) => ({
      element: step.element,
      popover: {
        title: step.popover.title,
        description: step.popover.description,
        side: step.popover.side || 'bottom',
        align: step.popover.align || 'start',
      },
    }))

    // Destruir instancia anterior si existe
    if (driverRef.current) {
      driverRef.current.destroy()
    }

    // Crear nueva instancia con los pasos
    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      allowClose: true,
      overlayOpacity: 0.5,
      smoothScroll: true,
      stagePadding: 4,
      stageRadius: 8,
      popoverClass: 'driverjs-theme',
      popoverOffset: 10,
      steps: driverSteps,
      onDestroyStarted: () => {
        setIsActive(false)
      },
      onDestroyed: () => {
        setIsActive(false)
      },
    })

    // Iniciar el tour
    driverRef.current.drive()
    setIsActive(true)
  }, [])

  const stopTour = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy()
      setIsActive(false)
    }
  }, [])

  return {
    startTour,
    stopTour,
    isActive,
  }
}

