"use client"

/**
 * Filtros para órdenes de producción
 */

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CompactFilterField, CompactFilters } from "@/components/ui/compact-filters"
import { ProductSearchFilter } from "./product-search-filter"
import type { ProductionOrderStatus } from "@/types"

interface OrdersFiltersProps {
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
  { value: "APROBADA", label: "Aprobada" },
  { value: "RECHAZADA", label: "Rechazada" },
  { value: "CANCELADA", label: "Cancelada" }
]

export function OrdersFilters({ onFilterChange }: OrdersFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    status: searchParams.get('status') || "",
    productId: searchParams.get('productId') || ""
  })

  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
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
      className: 'min-w-40',
      customComponent: (
        <ProductSearchFilter
          value={filters.productId}
          onChange={handleProductChange}
          placeholder="Buscar producto por nombre..."
        />
      )
    },
    {
      key: 'status',
      label: 'Estado',
      type: 'select' as const,
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
    />
  )
}
