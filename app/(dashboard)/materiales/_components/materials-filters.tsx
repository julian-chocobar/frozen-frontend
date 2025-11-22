/**
 * Componente MaterialsFilters - Filtros compactos y responsive para materiales
 * 
 * Proporciona controles de filtrado para la lista de materiales:
 * - Búsqueda por nombre
 * - Filtro por proveedor
 * - Filtro por categoría/tipo de material
 * - Filtro por estado (activo/inactivo)
 * 
 * Los filtros se sincronizan con la URL usando searchParams para mantener
 * el estado entre navegaciones y permitir compartir URLs con filtros.
 * 
 * @component
 * @example
 * ```tsx
 * <MaterialsFilters 
 *   onFilterChange={(filters) => console.log(filters)} 
 * />
 * ```
 */

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CompactFilters, type CompactFilterField } from "@/components/ui/compact-filters"
import { getTypeLabel } from "@/lib/materials/api"
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
  
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || "",
    supplier: searchParams.get('supplier') || "",
    type: searchParams.get('type') || "Todas",
    estado: searchParams.get('estado') || "Todos"
  })

  const fields: CompactFilterField[] = [
    {
      key: 'name',
      type: 'text',
      label: 'Nombre',
      placeholder: 'Nombre...',
      className: 'min-w-32'
    },
    {
      key: 'supplier',
      type: 'text',
      label: 'Proveedor',
      placeholder: 'Proveedor...',
      className: 'min-w-32'
    },
    {
      key: 'type',
      type: 'select',
      label: 'Categoría',
      options: categorias.map(cat => ({
        value: cat,
        label: cat === "Todas" ? "Todas las categorías" : getTypeLabel(cat as MaterialType)
      })),
      className: 'min-w-36'
    },
    {
      key: 'estado',
      type: 'select',
      label: 'Estado',
      options: estados.map(est => ({
        value: est,
        label: est === "Todos" ? "Todos los estados" : est
      })),
      className: 'min-w-32'
    }
  ]

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "" && !["Todas", "Todos"].includes(value)) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    router.push(`?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    updateURL(newFilters)
    
    // Notificar al componente padre
    const filterState: FilterState = {
      type: newFilters.type as MaterialType | "Todas",
      estado: newFilters.estado as MaterialStatus | "Todos",
      name: newFilters.name,
      supplier: newFilters.supplier
    }
    onFilterChange?.(filterState)
  }

  const handleSearch = () => {
    updateURL(filters)
    
    const filterState: FilterState = {
      type: filters.type as MaterialType | "Todas",
      estado: filters.estado as MaterialStatus | "Todos",
      name: filters.name,
      supplier: filters.supplier
    }
    onFilterChange?.(filterState)
  }

  const handleClear = () => {
    const clearedFilters = {
      name: "",
      supplier: "",
      type: "Todas",
      estado: "Todos"
    }
    setFilters(clearedFilters)
    
    // Limpiar URL
    router.push(window.location.pathname)
    
    // Notificar al componente padre
    const filterState: FilterState = {
      type: "Todas",
      estado: "Todos",
      name: "",
      supplier: ""
    }
    onFilterChange?.(filterState)
  }

  return (
    <CompactFilters
      fields={fields}
      values={filters}
      onChange={handleFilterChange}
      onSearch={handleSearch}
      onClear={handleClear}
    />
  )
}
