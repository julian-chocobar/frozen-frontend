import { Check, CircleX, Power, PowerOff, X, Wine } from "lucide-react"
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
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    value 
                        ? "bg-purple-50 text-purple-700 border-purple-300" 
                        : "bg-primary-50 text-primary-700 border-primary-200"
                )}>
                    <Wine className="w-3 h-3" />
                    {value ? "Sí" : "No"}
                </span>
            )
        },
        {
            key: 'standardQuantity',
            label: 'Cantidad Estándar',
            render: (value, product) => (
                <span className="text-sm font-medium text-primary-900">
                    {value} {product.unitMeasurement === 'LT' ? 'L' : product.unitMeasurement}
                </span>
            )
        },
        {
            key: 'isActive',
            label: 'Estado',
            render: (value, product) => (
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    value 
                        ? "bg-green-50 text-green-700 border-green-300" 
                        : "bg-red-50 text-red-700 border-red-300"
                )}>
                    {value ? (
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
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                    value 
                        ? "bg-primary-100 text-primary-700 border-primary-300" 
                        : "bg-primary-50 text-primary-700 border-primary-200"
                )}>
                    {value ? (
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
        customActions: (product) => [
            {
                label: product.isReady ? 'Marcar como no listo' : 'Marcar como listo',
                icon: product.isReady ? CircleX : Check,
                onClick: () => onMarkAsReady!(product),
                className: 'text-primary-600',
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