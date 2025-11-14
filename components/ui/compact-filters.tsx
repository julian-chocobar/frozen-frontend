"use client"

/**
 * Componente de filtros compactos y responsive
 * Se adapta automáticamente a diferentes tamaños de pantalla
 */

import { useState } from "react"
import { Search, X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CompactFilterField {
  key: string
  type: 'text' | 'select' | 'date' | 'custom'
  label: string
  placeholder?: string
  options?: { value: string; label: string }[]
  className?: string
  customComponent?: React.ReactNode
}

export interface CompactFiltersProps {
  fields: CompactFilterField[]
  values: Record<string, any>
  onChange: (key: string, value: any) => void
  onSearch: () => void
  onClear: () => void
  className?: string
  align?: 'left' | 'right'
}

export function CompactFilters({ 
  fields, 
  values, 
  onChange, 
  onSearch, 
  onClear, 
  className,
  align = 'left'
}: CompactFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveFilters = Object.values(values).some(value => 
    value && value !== "" && !["Todas", "Todos"].includes(value)
  )

  const renderField = (field: CompactFilterField) => {
    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className={cn("relative shrink-0", field.className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
            <input
              type="text"
              placeholder={field.placeholder || `Buscar por ${field.label.toLowerCase()}...`}
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900 placeholder:text-primary-600"
              )}
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className={cn("relative shrink-0", field.className)}>
            <select
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={cn(
                "appearance-none w-full pl-4 pr-8 py-2 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-600 cursor-pointer"
              )}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600 pointer-events-none" />
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className={cn("relative shrink-0", field.className)}>
            <input
              type="date"
              placeholder={field.placeholder}
              value={values[field.key] || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={cn(
                "w-full px-3 py-2 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-600"
              )}
            />
          </div>
        )

      case 'custom':
        return (
          <div key={field.key} className={cn("relative shrink-0 overflow-visible", field.className)}>
            {field.customComponent}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(className)}>
      {/* Vista Desktop - Filtros en línea horizontal (sin wrap) */}
      <div className="hidden xl:block">
        <div className={cn(
          "flex items-end gap-2 overflow-visible",
          align === 'right' ? 'justify-end' : 'justify-start'
        )}>
          {/* Campos de filtro */}
          {fields.map(renderField)}
          
          {/* Botones de acción */}
          <button
            onClick={onSearch}
            className={cn(
              "px-3 py-2 bg-primary-600 text-white rounded-lg shrink-0",
              "hover:bg-primary-700 transition-colors font-medium text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
              "flex items-center gap-2 whitespace-nowrap"
            )}
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className={cn(
                "px-3 py-2 bg-gray-500 text-white rounded-lg shrink-0",
                "hover:bg-gray-600 transition-colors font-medium text-sm",
                "focus:outline-none focus:ring-2 focus:ring-gray-300",
                "flex items-center gap-2 whitespace-nowrap"
              )}
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Vista Mobile/Tablet - Filtros colapsables */}
      <div className="xl:hidden">
        {/* Botón para expandir/colapsar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between p-3 border border-stroke rounded-lg",
            "bg-background hover:bg-gray-50 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary-300"
          )}
        >
          <div className="bg-background flex items-center gap-2">
            <Search className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-600">
              Filtros
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {Object.values(values).filter(v => v && v !== "" && !["Todas", "Todos"].includes(v)).length}
                </span>
              )}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-primary-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-primary-600" />
          )}
        </button>

        {/* Contenido colapsable */}
        {isExpanded && (
          <div className="mt-3 space-y-3 overflow-visible">
            {/* Campos de filtro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-visible">
              {fields.map(renderField)}
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2">
              <button
                onClick={onSearch}
                className={cn(
                  "flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg",
                  "hover:bg-primary-700 transition-colors font-medium text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-primary-300",
                  "flex items-center justify-center gap-2"
                )}
              >
                <Search className="w-4 h-4" />
                Buscar
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={onClear}
                  className={cn(
                    "px-4 py-2 bg-gray-500 text-white rounded-lg",
                    "hover:bg-gray-600 transition-colors font-medium text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-gray-300",
                    "flex items-center gap-2"
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
