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
                    <span className="text-sm text-primary-600"> {value ? "Alcoholico" : "No alcoholico"}</span>
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
            }
        ],
        footer: [
            {
                key: 'isReady',
                label: '',
                showLabel: false,
                render: (value, product) => (
                    <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                        product.isReady 
                            ? "bg-blue-50 text-blue-700 border-blue-300" 
                            : "bg-yellow-50 text-yellow-700 border-yellow-300"
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
                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                        product.isActive 
                            ? "bg-green-50 text-green-700 border-green-300" 
                            : "bg-red-50 text-red-700 border-red-300"
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
        customActions: (product) => [
            {
                label: product.isReady ? 'Marcar como no listo' : 'Marcar como listo',
                icon: product.isReady ? CircleX : Check,
                onClick: () => onMarkAsReady!(product),
                className: product.isReady ? 'text-yellow-600' : 'text-blue-600',
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