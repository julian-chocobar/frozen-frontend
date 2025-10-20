"use client"

/**
 * Filtros para órdenes de producción
 */

import { useState } from "react"
import { CompactFilters } from "@/components/ui/compact-filters"
import { ProductSearchFilter } from "./product-search-filter"
import type { ProductionOrderStatus } from "@/types"

interface OrdersFiltersProps {
  onFiltersChange: (filters: {
    status?: ProductionOrderStatus
    productId?: string
  }) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export function OrdersFilters({ onFiltersChange, onClearFilters, isLoading = false }: OrdersFiltersProps) {
  const [filters, setFilters] = useState({
    status: "" as ProductionOrderStatus | "",
    productId: ""
  })

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "Pendiente", label: "Pendiente" },
    { value: "Aprobado", label: "Aprobado" },
    { value: "Rechazado", label: "Rechazado" },
    { value: "Cancelada", label: "Cancelada" }
  ]

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    
    // Aplicar filtros automáticamente
    const cleanFilters = {
      status: newFilters.status || undefined,
      productId: newFilters.productId || undefined
    }
    
    onFiltersChange(cleanFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      status: "",
      productId: ""
    })
    onClearFilters()
  }

  const handleSearch = () => {
    // Los filtros se aplican automáticamente en handleFilterChange
  }

  const filterFields = [
    {
      key: 'status',
      label: 'Estado',
      type: 'select' as const,
      options: statusOptions
    },
    {
      key: 'productId',
      label: 'Producto',
      type: 'custom' as const,
      customComponent: (
        <ProductSearchFilter
          value={filters.productId}
          onChange={(productId) => handleFilterChange('productId', productId)}
          placeholder="Buscar producto por nombre..."
        />
      )
    }
  ]

  return (
    <CompactFilters
      fields={filterFields}
      values={filters}
      onChange={handleFilterChange}
      onSearch={handleSearch}
      onClear={handleClearFilters}
    />
  )
}
