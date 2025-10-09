/**
 * Indicador de navegación global
 * Muestra una barra de progreso en la parte superior cuando se navega entre páginas
 */

"use client"

import { useNavigation } from "@/components/providers/navigation-provider"

export function NavigationLoader() {
  const { isNavigating } = useNavigation()

  if (!isNavigating) return null

  return (
    <>
      {/* Barra de progreso superior */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{
            width: "70%",
            animation: "progress 1s ease-in-out infinite",
          }}
        />
      </div>

      {/* Overlay sutil para indicar que está cargando */}
      <div className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px] pointer-events-none" />
    </>
  )
}
