import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardField, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { PackagingResponse } from "@/types"
import { getUnitLabel } from "@/lib/packagings-api"

interface PackagingsCardsProps {
    packagings: PackagingResponse[]
    onEdit?: (packaging: PackagingResponse) => void
    onToggleActive?: (packaging: PackagingResponse) => void
}

export function PackagingsCards({ 
    packagings, 
    onEdit, 
    onToggleActive 
}: PackagingsCardsProps) {
    const layout: CardLayout<PackagingResponse> = {
    header: [
      {
        key: 'id',
        label: '',
        showLabel: false,
        render: (value) => (
          <p className="text-xs font-mono text-primary-600 mb-1">#{value}</p>
        )
      },
      {
        key: 'name',
        label: '',
        showLabel: false,
        render: (value) => (
          <h3 className="text-base font-semibold text-primary-900">{value}</h3>
        )
      }
    ],
    content: [
      {
        key: 'unitMeasurement',
        label: 'Unidad de Medida',
        render: (value) => (
          <span className="text-sm text-primary-600">{getUnitLabel(value)}</span>
        )
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        render: (value) => (
          <span className="text-sm text-primary-900">${value}</span>
        )
      }
    ],
    footer: [
      {
        key: 'isActive',
        label: '',
        showLabel: false,
        render: (value, packaging) => (
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            packaging.isActive
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          )}>
            {packaging.isActive ? (
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

  const actions: TableActions<PackagingResponse> = {
    onEdit,
    onToggleStatus: onToggleActive,
    toggleStatusIcon: (packaging) => (
      packaging.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />
    )
  }
    return (
      <div className="md:hidden">
        <DataCards
            data={packagings}
            layout={layout}
            actions={actions}
            loading={false}
            emptyMessage="No hay packaging disponibles"
            className="space-y-4"
        />
      </div>
    )
}