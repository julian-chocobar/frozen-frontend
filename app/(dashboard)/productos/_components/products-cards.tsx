import { Check, CircleX, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardField, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { ProductResponse } from "@/types"

interface ProductsCardsProps {
    productos: ProductResponse[]
    onEdit?: (producto: ProductResponse) => void
    onToggleActive?: (producto: ProductResponse) => void
    onMarkAsReady?: (producto: ProductResponse) => void
    onViewDetails?: (producto: ProductResponse) => void
}

export function ProductsCards({ 
    productos, 
    onEdit, 
    onToggleActive, 
    onMarkAsReady,
    onViewDetails 
}: ProductsCardsProps) {
    const layout: CardLayout<ProductResponse> = {
        header: [
            {
                key: 'name',
                label: '',
                showLabel: false,
                render: (value) => (
                    <span className="text-sm font-medium text-primary-900">{value}</span>
                )
            },
        ],
        content: [
            {
                key: 'isAlcoholic',
                label: '',
                showLabel: false,
                render: (value) => (
                    <span className="text-sm text-primary-600">{value ? "Si" : "No"}</span>
                )
            },
            {
                key: 'isActive',
                label: '',
                showLabel: false,
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
        ],
        footer: [
            {
                key: 'isReady',
                label: '',
                showLabel: false,
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
            },
            {
                key: 'isActive',
                label: '',
                showLabel: false,
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
            }
        ]
    }
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
        <div className="md:hidden">
            <DataCards
                data={productos}
                layout={layout}
                actions={actions}
                emptyMessage="No hay productos disponibles"
            />
        </div>
    )
}