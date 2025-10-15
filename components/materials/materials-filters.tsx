"use client"

/**
 * Componente MaterialsFilters - Filtros y búsqueda de materiales
 * Permite filtrar por categoría, estado y buscar por texto
 */

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTypeLabel } from "@/lib/materials-api"
import type { MaterialType, MaterialStatus } from "@/types"

interface MaterialsFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  type: MaterialType | "Todas"
  estado: MaterialStatus | "Todos"
  name: string
  supplier: string
}

const categorias: (MaterialType | "Todas")[] = ["Todas", "MALTA", "LUPULO", "AGUA", "LEVADURA", "OTROS"]
const estados: (MaterialStatus | "Todos")[] = ["Todos", "Activo", "Inactivo"]

export function MaterialsFilters({ onFilterChange }: MaterialsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    type: (searchParams.get('type') as MaterialType) || "Todas",
    estado: (searchParams.get('estado') as MaterialStatus) || "Todos",
    name: searchParams.get('name') || "",
    supplier: searchParams.get('supplier') || ""
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
    
    // Actualizar URL con los filtros
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "Todas" && value !== "Todos") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Actualizar parámetros de búsqueda
    if (filters.name) {
      params.set('name', filters.name)
    } else {
      params.delete('name')
    }
    
    if (filters.supplier) {
      params.set('supplier', filters.supplier)
    } else {
      params.delete('supplier')
    }
    
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Campos de búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Búsqueda por nombre */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 placeholder:text-primary-600",
            )}
          />
        </div>

        {/* Búsqueda por proveedor */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
          <input
            type="text"
            placeholder="Buscar por proveedor..."
            value={filters.supplier}
            onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 placeholder:text-primary-600",
            )}
          />
        </div>

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

      {/* Filtros de selección */}
      <div className="flex flex-col sm:flex-row gap-3">

      {/* Filtro de Categoría */}
      <div className="relative">
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className={cn(
            "appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 bg-white cursor-pointer",
          )}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Todas" ? "Todas las categorías" : getTypeLabel(cat as MaterialType)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 pointer-events-none" />
      </div>

      {/* Filtro de Estado */}
      <div className="relative">
        <select
          value={filters.estado}
          onChange={(e) => handleFilterChange("estado", e.target.value)}
          className={cn(
            "appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 bg-white cursor-pointer",
          )}
        >
          {estados.map((est) => (
            <option key={est} value={est}>
              {est === "Todos" ? "Todos los estados" : est}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600 pointer-events-none" />
      </div>

      </div>
    </div>
  )
}
