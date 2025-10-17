"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CompactFilters, type CompactFilterField } from "@/components/ui/compact-filters"
import { ProductAlcoholic, ProductReady, ProductStatus } from "@/types"

interface ProductsFiltersProps {
    onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
    name: string
    estado: ProductStatus | "Todos"
    alcoholic: ProductAlcoholic | "Todos"
    ready: ProductReady | "Todos"
}

const estados: (ProductStatus | "Todos")[] = ["Todos", "Activo", "Inactivo"]
const alcoholicos: (ProductAlcoholic | "Todos")[] = ["Todos", "Alcoholico", "No Alcoholico"]
const listos: (ProductReady | "Todos")[] = ["Todos", "Listo", "No Listo"]

export function ProductsFilters({ onFilterChange }: ProductsFiltersProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [filters, setFilters] = useState<FilterState>({
        name: searchParams.get('name') || "",
        estado: searchParams.get('estado') as ProductStatus | "Todos" || "Todos",
        alcoholic: searchParams.get('alcoholic') as ProductAlcoholic | "Todos" || "Todos",
        ready: searchParams.get('ready') as ProductReady | "Todos" || "Todos"
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
            key: 'estado',
            type: 'select',
            label: 'Estado',
            options: estados.map(est => ({
                value: est,
                label: est === "Todos" ? "Todos los estados" : est
            })),
        },
        {
            key: 'alcoholic',
            type: 'select',
            label: 'Alcoholico',
            options: alcoholicos.map(al => ({
                value: al,
                label: al === "Todos" ? "Con y sin alcohol" : al
            })),
        },
        {
            key: 'ready',
            type: 'select',
            label: 'Listo',
            options: listos.map(li => ({
                value: li,
                label: li === "Todos" ? "Listos y no listos" : li
            })),
        }
    ]

    const updateURL = (newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== "" && !["Todos", "Todos"].includes(value)) {
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
    }
    
    const handleSearch = () => {
        updateURL(filters)
        const filterState: FilterState = {
            name: filters.name,
            estado: filters.estado as ProductStatus | "Todos",
            alcoholic: filters.alcoholic as ProductAlcoholic | "Todos",
            ready: filters.ready as ProductReady | "Todos"
        }
        onFilterChange?.(filterState)
    }
    
    const handleClear = () => {
        const clearedFilters: FilterState = {
            name: "",
            estado: "Todos",
            alcoholic: "Todos",
            ready: "Todos"
        }
        setFilters(clearedFilters)
        updateURL(clearedFilters)
        const filterState: FilterState = {
            name: "",
            estado: "Todos",
            alcoholic: "Todos",
            ready: "Todos"
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