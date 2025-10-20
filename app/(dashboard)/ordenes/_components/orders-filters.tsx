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
  status: ProductionOrderStatus | "Todos"
  productId: string
}

const statusOptions: (ProductionOrderStatus | "Todos")[] = ["Todos", "Pendiente", "Aprobado", "Rechazado", "Cancelada"]

export function OrdersFilters({ onFilterChange }: OrdersFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status') as ProductionOrderStatus | "Todos") || "Todos",
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

    const filterState: FilterState = {
      status: filters.status as ProductionOrderStatus | "Todos",
      productId: filters.productId
    }
    onFilterChange?.(filterState)
  }

  const handleClear = () => {
    const clearedFilters: FilterState = {
      status: "Todos",
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
      options: statusOptions.map(status => ({
        value: status,
        label: status === "Todos" ? "Todos los estados" : status
      }))
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
