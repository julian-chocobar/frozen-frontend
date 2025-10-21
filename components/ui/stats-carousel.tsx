/**
 * Componente StatsCarousel - Carrusel para tarjetas de estadísticas
 * Incluye botones de navegación y scroll suave
 */

"use client"

import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCarouselProps {
  children: React.ReactNode
  className?: string
}

export function StatsCarousel({ children, className }: StatsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollability = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  useEffect(() => {
    checkScrollability()
    window.addEventListener("resize", checkScrollability)
    return () => window.removeEventListener("resize", checkScrollability)
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const newScrollLeft = direction === "left" 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    })

    // Actualizar botones después del scroll
    setTimeout(checkScrollability, 300)
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Botón izquierdo */}
      <button
        onClick={() => scroll("left")}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-300",
          "hover:bg-primary-50 hover:shadow-xl hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "hidden md:flex items-center justify-center",
          !canScrollLeft && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 text-primary-700" />
      </button>

      {/* Botón derecho */}
      <button
        onClick={() => scroll("right")}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 transition-all duration-300",
          "hover:bg-primary-50 hover:shadow-xl hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          "hidden md:flex items-center justify-center",
          !canScrollRight && "opacity-0 pointer-events-none"
        )}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 text-primary-700" />
      </button>

      {/* Container scrolleable */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className="overflow-x-auto overflow-y-hidden pb-2"
        style={{ 
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}
      >
        <div className="flex gap-4 min-w-full">
          {children}
        </div>
      </div>
      
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Indicadores de scroll en móvil */}
      <div className="md:hidden flex justify-center gap-1 mt-3">
        <div className={cn(
          "h-1 rounded-full transition-all",
          canScrollLeft ? "w-2 bg-primary-300" : "w-6 bg-primary-600"
        )} />
        <div className={cn(
          "h-1 rounded-full transition-all",
          !canScrollLeft && !canScrollRight ? "w-6 bg-primary-600" : "w-2 bg-primary-300"
        )} />
        <div className={cn(
          "h-1 rounded-full transition-all",
          canScrollRight ? "w-2 bg-primary-300" : "w-6 bg-primary-600"
        )} />
      </div>
    </div>
  )
}

