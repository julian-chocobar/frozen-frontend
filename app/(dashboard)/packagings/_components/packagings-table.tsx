import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { PackagingResponse } from "@/types"
import { getUnitLabel } from "@/lib/packagings-api"

interface PackagingsTableProps {
    packagings: PackagingResponse[]
    onEdit?: (packaging: PackagingResponse) => void
    onToggleActive?: (packaging: PackagingResponse) => void
}

export function PackagingsTable({ 
    packagings, 
    onEdit, 
    onToggleActive
 }: PackagingsTableProps) {
    const columns: ColumnDef<PackagingResponse>[] = [
        {
            key: 'id',
            label: 'ID',
            render: (value) => (
                <span className="text-sm font-mono text-primary-600">#{value}</span>
            )
        },
        {
            key: 'name',
            label: 'Nombre',
            render: (value) => (
                <span className="text-sm font-medium text-primary-900">{value}</span>
            )
        },
        {
            key: 'materialName',
            label: 'Material',
            render: (value) => (
                <span className="text-sm text-primary-600">{value || 'Sin material'}</span>
            )
        },
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
                <span className="text-sm text-primary-900">{value}</span>
            )
        },
        {
            key: 'isActive',
            label: 'Estado',
            render: (value, packaging) => (
                <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    packaging.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
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
    const actions: TableActions<PackagingResponse> = {
        onEdit,
        onToggleStatus: onToggleActive,
        toggleStatusIcon: (packaging) => (
            packaging.isActive ? <PowerOff className="w-4 h-4 text-red-500" /> : <Power className="w-4 h-4 text-green-500" />
        )
    }
    return (
        <div className="hidden md:block">
            <DataTable
                data={packagings}
                columns={columns}
                actions={actions}
                emptyMessage="No hay packaging disponibles"
            />
        </div>
    )
}