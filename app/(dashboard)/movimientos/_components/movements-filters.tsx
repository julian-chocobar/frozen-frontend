/**
 * Componente MovementsFilters - Filtros compactos y responsive para movimientos
 * 
 * Proporciona controles de filtrado para la lista de movimientos:
 * - Búsqueda por material (con componente de búsqueda especializado)
 * - Filtro por tipo de movimiento (INGRESO, EGRESO, RESERVA, DEVUELTO)
 * - Filtro por estado (PENDIENTE, EN_PROCESO, COMPLETADO)
 * - Filtro por rango de fechas (desde/hasta)
 * 
 * Los filtros se sincronizan con la URL usando searchParams para mantener
 * el estado entre navegaciones y permitir compartir URLs con filtros.
 * 
 * @component
 * @example
 * ```tsx
 * <MovementsFilters 
 *   onFilterChange={(filters) => console.log(filters)} 
 * />
 * ```
 */
"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CompactFilters, type CompactFilterField } from "@/components/ui/compact-filters"
import { MaterialSearchFilter } from "./material-search-filter"
import { getTypeLabel } from "@/lib/movements"
import type { MovementType, MovementStatus } from "@/types"

interface MovementsFiltersProps {
    onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
    type: MovementType | "Todas"
    status: MovementStatus | "Todos"
    materialId: string
    dateFrom: string
    dateTo: string
}

const tipos: (MovementType | "Todas")[] = ["Todas", "INGRESO", "EGRESO", "RESERVA", "DEVUELTO"]
const estados: (MovementStatus | "Todos")[] = ["Todos", "PENDIENTE", "EN_PROCESO", "COMPLETADO"]

export function MovementsFilters({ onFilterChange }: MovementsFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [filters, setFilters] = useState<FilterState>({
        type: (searchParams.get('type') as MovementType | "Todas") || "Todas",
        status: (searchParams.get('status') as MovementStatus | "Todos") || "Todos",
        materialId: searchParams.get('materialId') || "",
        dateFrom: searchParams.get('dateFrom') || "",
        dateTo: searchParams.get('dateTo') || ""
    })

    const updateURL = (newFilters: FilterState) => {
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
        onFilterChange?.(newFilters)
    }

    const handleMaterialChange = (materialId: string) => {
        const newFilters = { ...filters, materialId }
        setFilters(newFilters)
        updateURL(newFilters)
        onFilterChange?.(newFilters)
    }

    const fields: CompactFilterField[] = [
        {
            key: 'materialId',
            type: 'custom',
            label: 'Material',
            className: 'min-w-40',
            customComponent: (
                <MaterialSearchFilter
                    value={filters.materialId}
                    onChange={handleMaterialChange}
                    placeholder="Buscar material..."
                />
            )
        },
        {
            key: 'type',
            type: 'select',
            label: 'Tipo',
            options: tipos.map(tipo => ({
                value: tipo,
                label: tipo === "Todas" ? "Todos los tipos" : getTypeLabel(tipo as MovementType)
            })),
            className: 'min-w-32'
        },
        {
            key: 'status',
            type: 'select',
            label: 'Estado',
            options: estados.map(estado => ({
                value: estado,
                label: estado === "Todos" ? "Todos los estados" : 
                       estado === "PENDIENTE" ? "Pendiente" :
                       estado === "EN_PROCESO" ? "En Proceso" : "Completado"
            })),
            className: 'min-w-32'
        },
        {
            key: 'dateFrom',
            type: 'date',
            label: 'Fecha desde',
            className: 'min-w-32'
        },
        {
            key: 'dateTo',
            type: 'date',
            label: 'Fecha hasta',
            className: 'min-w-32'
        }
    ]

    const handleSearch = () => {
        updateURL(filters)
        onFilterChange?.(filters)
    }

    const handleClear = () => {
        const clearedFilters: FilterState = {
            type: "Todas",
            status: "Todos",
            materialId: "",
            dateFrom: "",
            dateTo: ""
        }
        setFilters(clearedFilters)
        
        // Limpiar URL
        router.push(window.location.pathname)
        onFilterChange?.(clearedFilters)
    }

    return (
        <CompactFilters
            fields={fields}
            values={{
                type: filters.type,
                status: filters.status,
                materialId: filters.materialId,
                dateFrom: filters.dateFrom,
                dateTo: filters.dateTo
            }}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            onClear={handleClear}
        />
    )
}