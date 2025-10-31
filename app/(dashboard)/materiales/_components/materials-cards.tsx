/**
 * Componente MaterialsCards - Wrapper específico para materiales usando DataCards genérico
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardField, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { Material } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialsCardsProps {
  materiales: Material[]
  onEdit?: (material: Material) => void
  onToggleActive?: (material: Material) => void
  onViewDetails?: (material: Material) => void
}

export function MaterialsCards({ 
  materiales, 
  onEdit, 
  onToggleActive, 
  onViewDetails 
}: MaterialsCardsProps) {
  const layout: CardLayout<Material> = {
    header: [
      {
        key: 'code',
        label: '',
        showLabel: false,
        render: (value) => (
          <p className="text-xs font-mono text-primary-600 mb-1">{value}</p>
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
        key: 'type',
        label: 'Categoría',
        render: (value) => (
          <span className="text-sm text-primary-600">{getTypeLabel(value)}</span>
        )
      },
      {
        key: 'supplier',
        label: 'Proveedor',
        render: (value) => (
          <span className="text-sm text-primary-800">{value}</span>
        )
      },
      {
        key: 'availableStock',
        label: 'Stock Disponible',
        render: (value, material) => (
          <div>
            <p className="text-sm font-bold text-green-900">
              {value || 0} {getUnitLabel(material.unitMeasurement)}
            </p>
            <p className="text-xs text-primary-700">
              Mín: {material.threshold} {getUnitLabel(material.unitMeasurement)}
            </p>
          </div>
        )
      },
      {
        key: 'reservedStock',
        label: 'Stock Reservado',
        render: (value, material) => (
          <div>
            <p className="text-sm font-bold text-orange-900">
              {value || 0} {getUnitLabel(material.unitMeasurement)}
            </p>
          </div>
        )
      },
      {
        key: 'value',
        label: 'Costo',
        render: (value) => (
          <span className="text-sm font-medium text-primary-900">${value}</span>
        )
      }
    ],
    footer: [
      {
        key: 'isActive',
        label: '',
        showLabel: false,
        render: (value, material) => (
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            material.isActive
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
          )}>
            {material.isActive ? (
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

  const actions: TableActions<Material> = {
    onView: onViewDetails,
    onEdit,
    onToggleStatus: onToggleActive,
    toggleStatusIcon: (material) => (
      material.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />
    )
  }

  return (
    <div className="md:hidden">
      <DataCards
        data={materiales}
        layout={layout}
        actions={actions}
        emptyMessage="No hay materiales disponibles"
      />
    </div>
  )
}