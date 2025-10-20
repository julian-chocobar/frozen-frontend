"use client"

/**
 * Filtros para órdenes de producción
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CompactFilters } from "@/components/ui/compact-filters"
import { Calendar, Filter, X } from "lucide-react"
import type { ProductionOrderStatus } from "@/types"

interface OrdersFiltersProps {
  onFiltersChange: (filters: {
    status?: ProductionOrderStatus
    productId?: string
    startDate?: string
    endDate?: string
  }) => void
  onClearFilters: () => void
  isLoading?: boolean
}

export function OrdersFilters({ onFiltersChange, onClearFilters, isLoading = false }: OrdersFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: "" as ProductionOrderStatus | "",
    productId: "",
    startDate: "",
    endDate: ""
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
      productId: newFilters.productId || undefined,
      startDate: newFilters.startDate || undefined,
      endDate: newFilters.endDate || undefined
    }
    
    onFiltersChange(cleanFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      status: "",
      productId: "",
      startDate: "",
      endDate: ""
    })
    onClearFilters()
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== "")

  const filterFields = [
    {
      key: 'status',
      label: 'Estado',
      type: 'select' as const,
      options: statusOptions
    },
    {
      key: 'productId',
      label: 'ID de Producto',
      type: 'text' as const,
      placeholder: 'Buscar por ID de producto'
    },
    {
      key: 'startDate',
      label: 'Fecha Desde',
      type: 'date' as const
    },
    {
      key: 'endDate',
      label: 'Fecha Hasta',
      type: 'date' as const
    }
  ]

  return (
    <div className="space-y-4">
      {/* Botón para mostrar/ocultar filtros */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
              {Object.values(filters).filter(v => v !== "").length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-red-600 hover:text-red-700"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      {/* Filtros compactos */}
      {showFilters && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <CompactFilters
            fields={filterFields}
            values={filters}
            onChange={handleFilterChange}
            onSearch={() => {}}
            onClear={handleClearFilters}
          />
        </div>
      )}

      {/* Resumen de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.status && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              Estado: {statusOptions.find(opt => opt.value === filters.status)?.label}
            </span>
          )}
          {filters.productId && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              Producto: {filters.productId}
            </span>
          )}
          {filters.startDate && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              Desde: {new Date(filters.startDate).toLocaleDateString('es-ES')}
            </span>
          )}
          {filters.endDate && (
            <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
              Hasta: {new Date(filters.endDate).toLocaleDateString('es-ES')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
