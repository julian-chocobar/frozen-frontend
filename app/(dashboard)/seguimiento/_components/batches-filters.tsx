"use client"

/**
 * Filtros para lotes de producción
 */

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CompactFilterField, CompactFilters } from "@/components/ui/compact-filters"
import { ProductSearchFilter } from "@/app/(dashboard)/ordenes/_components/product-search-filter"
import type { BatchStatus } from "@/types"

interface BatchesFiltersProps {
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  status: string
  productId: string
}

// Valores para mostrar en la UI
const statusOptions = [
  { value: "", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PRODUCCION", label: "En Producción" },
  { value: "EN_ESPERA", label: "En Espera" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CANCELADO", label: "Cancelado" }
]

export function BatchesFilters({ onFilterChange }: BatchesFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    status: searchParams.get('status') || "",
    productId: searchParams.get('productId') || ""
  })

  // Limpiar sessionStorage del filtro de producto si no hay productId en la URL
  // Esto evita que se restaure automáticamente un filtro cuando se abre la página sin filtros
  useEffect(() => {
    const productIdFromURL = searchParams.get('productId')
    if (!productIdFromURL && typeof window !== 'undefined') {
      // Limpiar el sessionStorage relacionado con el filtro de producto
      try {
        sessionStorage.removeItem('product-search-filter-selected')
        sessionStorage.removeItem('inventory-chart-productId')
      } catch (e) {
        console.warn('Error al limpiar sessionStorage:', e)
      }
    }
  }, [searchParams])

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    // Reset page when filters change
    params.delete('page')
    router.push(`?${params.toString()}`)
  }

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    updateURL(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleProductChange = (productId: string) => {
    const newFilters = { ...filters, productId }
    setFilters(newFilters)
    updateURL(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSearch = () => {
    updateURL(filters)
    onFilterChange?.(filters)
  }

  const handleClear = () => {
    const clearedFilters: FilterState = {
      status: "",
      productId: ""
    }
    setFilters(clearedFilters)
    router.push(window.location.pathname)
  }

  const fields: CompactFilterField[] = [
    {
      key: 'productId',
      label: 'Producto',
      type: 'custom' as const,
      className: 'w-56 shrink-0',
      customComponent: (
        <ProductSearchFilter
          value={filters.productId}
          onChange={handleProductChange}
          placeholder="Buscar producto..."
        />
      )
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select' as const,
      className: 'w-44 shrink-0',
      options: statusOptions
    },
  ]

  return (
    <CompactFilters
      fields={fields}
      values={{
        status: filters.status,
        productId: filters.productId
      }}
      onChange={handleFilterChange}
      onSearch={handleSearch}
      onClear={handleClear}
      align="right"
    />
  )
}
