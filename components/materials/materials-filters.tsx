"use client"

/**
 * Componente MaterialsFilters - Filtros y búsqueda de materiales
 * Permite filtrar por categoría, estado y buscar por texto
 */

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MaterialCategory, MaterialStatus } from "@/types"

interface MaterialsFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  categoria: MaterialCategory | "Todas"
  estado: MaterialStatus | "Todos"
  busqueda: string
}

const categorias: (MaterialCategory | "Todas")[] = ["Todas", "Maltas", "Lúpulos", "Levaduras", "Otros"]
const estados: (MaterialStatus | "Todos")[] = ["Todos", "Bueno", "Bajo", "Exceso", "Agotado"]

export function MaterialsFilters({ onFilterChange }: MaterialsFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categoria: "Todas",
    estado: "Todos",
    busqueda: "",
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Búsqueda */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-600" />
        <input
          type="text"
          placeholder="Buscar materiales..."
          value={filters.busqueda}
          onChange={(e) => handleFilterChange("busqueda", e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 placeholder:text-primary-600",
          )}
        />
      </div>

      {/* Filtro de Categoría */}
      <div className="relative">
        <select
          value={filters.categoria}
          onChange={(e) => handleFilterChange("categoria", e.target.value)}
          className={cn(
            "appearance-none w-full sm:w-48 pl-4 pr-10 py-2.5 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 bg-white cursor-pointer",
          )}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "Todas" ? "Todas las categorías" : cat}
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
  )
}
