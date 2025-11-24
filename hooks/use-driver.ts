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

    // Función helper para verificar si un elemento está visible
    const isElementVisible = (element: Element | null): boolean => {
      if (!element) return false
      
      const rect = element.getBoundingClientRect()
      const style = window.getComputedStyle(element)
      
      // Verificar que el elemento tenga dimensiones y esté visible
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0'
      )
    }

    // Función helper para resolver selectores múltiples y encontrar el elemento visible
    const resolveElement = (selector: string): string => {
      // Si el selector tiene múltiples opciones (separadas por coma)
      if (selector.includes(',')) {
        const selectors = selector.split(',').map(s => s.trim())
        
        // En mobile, priorizar bottom-bar; en desktop, priorizar sidebar
        if (typeof window !== 'undefined') {
          const isMobile = window.innerWidth < 768
          
          if (isMobile) {
            // En mobile, buscar bottom-bar primero
            const bottomBarSelector = selectors.find(s => s.includes('navigation-bottom-bar'))
            if (bottomBarSelector) {
              const element = document.querySelector(bottomBarSelector)
              if (isElementVisible(element)) {
                return bottomBarSelector
              }
            }
          } else {
            // En desktop, buscar sidebar primero
            const sidebarSelector = selectors.find(s => s.includes('navigation-sidebar'))
            if (sidebarSelector) {
              const element = document.querySelector(sidebarSelector)
              if (isElementVisible(element)) {
                return sidebarSelector
              }
            }
          }
          
          // Si no se encontró el preferido, buscar cualquier elemento visible
          for (const sel of selectors) {
            const element = document.querySelector(sel)
            if (isElementVisible(element)) {
              return sel
            }
          }
        }
      }
      
      return selector
    }

    // Convertir pasos al formato de Driver.js (sin la propiedad route)
    const driverSteps = steps.map((step) => {
      const resolvedElement = resolveElement(step.element)
      
      // Ajustar el side del popover para mobile
      let popoverSide = step.popover.side || 'bottom'
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        if (resolvedElement.includes('navigation-bottom-bar')) {
          popoverSide = 'top'
        } else if (
          resolvedElement.includes('products-view-button') ||
          resolvedElement.includes('orders-view-button')
        ) {
          // Los botones de visualización están en la esquina superior derecha de las cards
          // En mobile, es mejor mostrar el popover a la izquierda para evitar que quede fuera de pantalla
          popoverSide = 'left'
        }
      }
      
      return {
        element: resolvedElement,
        popover: {
          title: step.popover.title,
          description: step.popover.description,
          side: popoverSide,
          align: step.popover.align || 'start',
        },
      }
    })

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
          
          // Hacer scroll automático al elemento si no está completamente visible
          if (element && typeof window !== 'undefined') {
            setTimeout(() => {
              const rect = element.getBoundingClientRect()
              const viewportHeight = window.innerHeight || document.documentElement.clientHeight
              const viewportWidth = window.innerWidth || document.documentElement.clientWidth
              
              // En mobile, considerar el bottom-bar (64px = 4rem = h-16)
              const isMobile = viewportWidth < 768
              const bottomBarHeight = isMobile ? 64 : 0
              const availableHeight = viewportHeight - bottomBarHeight
              
              // Verificar si el elemento está completamente visible (considerando el bottom-bar en mobile)
              const isVisible = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= availableHeight &&
                rect.right <= viewportWidth
              )
              
              if (!isVisible) {
                // Calcular la posición ideal para el elemento
                const elementTop = rect.top + window.scrollY
                const elementHeight = rect.height
                
                // Calcular el offset para centrar el elemento considerando el bottom-bar
                // Queremos que el elemento quede centrado en el espacio disponible (viewport - bottom-bar)
                const idealScrollY = elementTop - (availableHeight / 2) + (elementHeight / 2)
                
                // Asegurar que el elemento quede visible pero no quede oculto detrás del bottom-bar
                const finalScrollY = Math.max(0, idealScrollY)
                
                window.scrollTo({
                  top: finalScrollY,
                  behavior: 'smooth'
                })
              }
            }, 100)
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

