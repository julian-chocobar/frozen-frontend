"use client"

/**
 * Componente de paginación reutilizable
 * Funciona con cualquier página que use searchParams
 */

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationClientProps {
  currentPage: number
  totalPages: number
  /** Nombre del parámetro de página en la URL (por defecto 'page') */
  pageParam?: string
}

export function PaginationClient({ 
  currentPage, 
  totalPages, 
  pageParam = 'page' 
}: PaginationClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (page === 0) {
      params.delete(pageParam)
    } else {
      params.set(pageParam, page.toString())
    }
    
    const queryString = params.toString()
    const url = queryString ? `?${queryString}` : window.location.pathname
    
    router.push(url)
  }

  const goToPrevious = () => {
    if (currentPage > 0) {
      navigateToPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages - 1) {
      navigateToPage(currentPage + 1)
    }
  }

  const goToFirst = () => {
    navigateToPage(0)
  }

  const goToLast = () => {
    navigateToPage(totalPages - 1)
  }

  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) {
    return null
  }

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con elipsis
      if (currentPage <= 2) {
        // Al inicio
        for (let i = 0; i < 3; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages - 1)
      } else if (currentPage >= totalPages - 3) {
        // Al final
        pages.push(0)
        pages.push('...')
        for (let i = totalPages - 3; i < totalPages; i++) pages.push(i)
      } else {
        // En el medio
        pages.push(0)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages - 1)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Botón Primera página */}
      <button
        onClick={goToFirst}
        disabled={currentPage === 0}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Primera página"
      >
        <ChevronLeft className="w-4 h-4" />
        <ChevronLeft className="w-4 h-4 -ml-2" />
      </button>

      {/* Botón Página anterior */}
      <button
        onClick={goToPrevious}
        disabled={currentPage === 0}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </button>

      {/* Números de página */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? navigateToPage(page) : undefined}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary-600 text-white'
                : page === '...'
                ? 'text-primary-400 cursor-default'
                : 'text-primary-600 bg-white border border-stroke hover:bg-primary-50'
            }`}
            aria-label={typeof page === 'number' ? `Página ${page + 1}` : undefined}
          >
            {typeof page === 'number' ? page + 1 : page}
          </button>
        ))}
      </div>

      {/* Botón Página siguiente */}
      <button
        onClick={goToNext}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página siguiente"
      >
        Siguiente
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Botón Última página */}
      <button
        onClick={goToLast}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Última página"
      >
        <ChevronRight className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 -ml-2" />
      </button>
    </div>
  )
}
