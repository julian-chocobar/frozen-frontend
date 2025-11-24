"use client"

import { useCallback, useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  // Ruta opcional: si se especifica, navegará a esta ruta antes de mostrar el paso
  route?: string
}

export interface UseDriverReturn {
  startTour: (steps: DriverStep[]) => void
  stopTour: () => void
  isActive: boolean
}

export function useDriver() {
  const driverRef = useRef<Driver | null>(null)
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const stepsRef = useRef<DriverStep[]>([])

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [])

  const startTour = useCallback((steps: DriverStep[]) => {
    stepsRef.current = steps

    // Convertir pasos al formato de Driver.js (sin la propiedad route)
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
      onHighlighted: (element, step, options) => {
        // Navegar cuando se resalta un paso si tiene una ruta
        const currentStepIndex = options.state.activeIndex
        if (currentStepIndex !== undefined) {
          const currentStep = steps[currentStepIndex]
          
          if (currentStep?.route) {
            // Navegar sin bloquear
            router.push(currentStep.route)
            // Esperar un momento para que la navegación se complete y los elementos estén disponibles
            setTimeout(() => {
              if (driverRef.current && element) {
                // Refrescar el highlight para asegurar que el elemento esté visible
                driverRef.current.refresh()
              }
            }, 300)
          }
        }
      },
      onNextClick: (element, step, options) => {
        // Verificar si es el último paso (botón "Done")
        const currentStepIndex = options.state.activeIndex
        if (currentStepIndex !== undefined && driverRef.current) {
          const isLastStep = driverRef.current.isLastStep()
          
          if (isLastStep) {
            // Si es el último paso, cerrar el tour
            driverRef.current.destroy()
            return
          }
          
          // Si no es el último paso, verificar si el siguiente paso tiene una ruta
          const nextStepIndex = currentStepIndex + 1
          const nextStep = steps[nextStepIndex]
          
          if (nextStep?.route) {
            // Navegar primero
            router.push(nextStep.route)
            // Esperar un momento y luego avanzar
            setTimeout(() => {
              if (driverRef.current) {
                driverRef.current.moveNext()
              }
            }, 400)
          } else {
            // Si no hay navegación, avanzar normalmente
            driverRef.current.moveNext()
          }
        } else {
          // Si no hay índice activo, avanzar normalmente
          if (driverRef.current) {
            driverRef.current.moveNext()
          }
        }
      },
      onPrevClick: () => {
        // Retroceder normalmente
        if (driverRef.current) {
          driverRef.current.movePrevious()
        }
      },
      onCloseClick: () => {
        // Cerrar el tour
        if (driverRef.current) {
          driverRef.current.destroy()
        }
      },
    })

    // Iniciar el tour
    driverRef.current.drive()
    setIsActive(true)
  }, [router])

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

