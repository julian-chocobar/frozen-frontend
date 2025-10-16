"use client"

/**
 * Componente DataFilters genérico reutilizable
 * Proporciona filtros configurables que pueden ser adaptados para cualquier tipo de datos
 */

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

export interface FilterField {
  key: string
  type: 'text' | 'select' | 'date' | 'number'
  label: string
  placeholder?: string
  options?: FilterOption[]
  className?: string
}

export interface FilterConfig {
  searchFields: FilterField[]
  selectFields: FilterField[]
  onFilterChange?: (filters: Record<string, any>) => void
  onSearch?: (searchTerm: string) => void
  className?: string
}

interface DataFiltersProps {
  config: FilterConfig
  initialValues?: Record<string, any>
}

export function DataFilters({ config, initialValues = {} }: DataFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {}
    
    // Inicializar con valores de URL o valores iniciales
    config.searchFields.forEach(field => {
      initial[field.key] = searchParams.get(field.key) || initialValues[field.key] || ""
    })
    
    config.selectFields.forEach(field => {
      initial[field.key] = searchParams.get(field.key) || initialValues[field.key] || ""
    })
    
    return initial
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    config.onFilterChange?.(newFilters)
    
    // Actualizar URL con los filtros
    const params = new URLSearchParams(searchParams.toString())
    
    // Si el valor es "Todas", "Todos", o está vacío, eliminar el parámetro
    if (value && value !== "" && !["Todas", "Todos"].includes(value)) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Actualizar parámetros de búsqueda
    config.searchFields.forEach(field => {
      if (filters[field.key]) {
        params.set(field.key, filters[field.key])
      } else {
        params.delete(field.key)
      }
    })
    
    router.push(`?${params.toString()}`)
    config.onSearch?.(filters[config.searchFields[0]?.key] || "")
  }

  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className={cn("flex-1 relative", field.className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
            <input
              type="text"
              placeholder={field.placeholder || `Buscar por ${field.label.toLowerCase()}...`}
              value={filters[field.key] || ""}
              onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900 placeholder:text-primary-600",
              )}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className={cn("relative", field.className)}>
            <select
              value={filters[field.key] || ""}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              className={cn(
                "appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 border border-stroke rounded-lg bg-background",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900 bg-white cursor-pointer",
              )}
            >
              {/* Solo agregar opción por defecto si no hay opciones manuales */}
              {!field.options || field.options.length === 0 ? (
                <option value="">{field.placeholder || `Todos los ${field.label.toLowerCase()}`}</option>
              ) : (
                field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 pointer-events-none" />
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className={cn("flex-1", field.className)}>
            <input
              type="date"
              placeholder={field.placeholder}
              value={filters[field.key] || ""}
              onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900",
              )}
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className={cn("flex-1", field.className)}>
            <input
              type="number"
              placeholder={field.placeholder}
              value={filters[field.key] || ""}
              onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900 placeholder:text-primary-600",
              )}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", config.className)}>
      {/* Campos de búsqueda */}
      {config.searchFields.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {config.searchFields.map(renderField)}
          
          {/* Botón de búsqueda */}
          <button
            onClick={handleSearch}
            className={cn(
              "px-6 py-2.5 bg-primary-600 text-white rounded-lg",
              "hover:bg-primary-700 transition-colors font-medium text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
              "flex items-center gap-2"
            )}
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>
      )}

      {/* Filtros de selección */}
      {config.selectFields.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          {config.selectFields.map(renderField)}
        </div>
      )}
    </div>
  )
}
