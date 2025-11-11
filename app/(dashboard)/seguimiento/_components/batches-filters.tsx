"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type { BatchStatus } from "@/types"

const BATCH_STATUSES: { value: BatchStatus; label: string }[] = [
  { value: "Pendiente", label: "Pendiente" },
  { value: "En Producción", label: "En Producción" },
  { value: "En Espera", label: "En Espera" },
  { value: "Completado", label: "Completado" },
  { value: "Cancelado", label: "Cancelado" }
]

export function BatchesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [showFilters, setShowFilters] = useState(false)
  
  const currentStatus = searchParams.get('status') as BatchStatus | null
  const currentProductId = searchParams.get('productId')

  const hasActiveFilters = currentStatus || currentProductId

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset page when filters change
    params.delete('page')
    
    router.push(`?${params.toString()}`)
  }

  const clearAllFilters = () => {
    const params = new URLSearchParams()
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      {/* Botón para mostrar/ocultar filtros */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50 disabled:opacity-50 disabled:text-primary-300 disabled:border-primary-200"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">
              {[currentStatus, currentProductId].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-2 text-primary-600 hover:text-primary-800"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-stroke rounded-lg bg-primary-50">
          
          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Estado
            </label>
            <Select
              value={currentStatus || ""}
              onValueChange={(value) => updateFilters('status', value || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                {BATCH_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product ID - por ahora simple input, se puede mejorar con selector */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              ID de Producto
            </label>
            <input
              type="text"
              value={currentProductId || ""}
              onChange={(e) => updateFilters('productId', e.target.value || null)}
              placeholder="Filtrar por producto..."
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
          </div>
        </div>
      )}
    </div>
  )
}