import { Check, CircleX, Power, PowerOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { ProductResponse } from "@/types"
import { Button } from "@/components/ui/button"


interface ProductsTableProps {
    productos: ProductResponse[]
    onEdit?: (producto: ProductResponse) => void
    onToggleActive?: (producto: ProductResponse) => void
    onMarkAsReady?: (producto: ProductResponse) => void
    onViewDetails?: (producto: ProductResponse) => void
}

export function ProductsTable({ 
    productos, 
    onEdit, 
    onToggleActive, 
    onMarkAsReady,
    onViewDetails 
}: ProductsTableProps) {
    const columns: ColumnDef<ProductResponse>[] = [
        {
            key: 'name',
            label: 'Nombre',
            render: (value) => (
                <span className="text-sm font-medium text-primary-900">{value}</span>
            )
        },
        {
            key: 'isAlcoholic',
            label: 'Alcoholico',
            render: (value) => (
                <span className="text-sm text-primary-600">{value ? "Si" : "No"}</span>
            )
        },
        {
            key: 'isActive',
            label: 'Estado',
            render: (value, product) => (
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                    {product.isActive ? (
                        <>
                            <Power className="w-3 h-3" />
                            Activo
                        </>
                    ) : (
                        <>
                            <PowerOff className="w-3 h-3" />
                            Inactivo
                        </>
                    )}
                </span>
            )
        },
        {
            key: 'isReady',
            label: 'Listo',
            render: (value, product) => (
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    product.isReady ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                    {product.isReady ? (
                        <>
                            <Check className="w-3 h-3" />
                            Listo
                        </>
                    ) : (
                        <>
                            <CircleX className="w-3 h-3" />
                            No listo
                        </>
                    )}
                </span>
            )
        }
    ]
    const actions: TableActions<ProductResponse> = {
        onView: onViewDetails,
        onEdit,
        onToggleStatus: onToggleActive,
        toggleStatusIcon: (product) => (
            product.isActive ? <PowerOff className="w-4 h-4 text-red-500" /> : <Power className="w-4 h-4 text-green-500" />
        ),
        customActions: [
            {
                label: 'Marcar como listo',
                icon: CircleX,
                onClick: (product) => onMarkAsReady!(product),
                className: 'text-green-500',
            }
        ]
    }
    return (
        <div className="hidden md:block">
            <DataTable
                data={productos}
                columns={columns}
                actions={actions}
                emptyMessage="No hay productos disponibles"
            />
        </div>
    )
}