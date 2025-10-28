/**
 * Componente UsersTable - Wrapper específico para usuarios usando DataTable genérico
 * Muestra todos los usuarios en formato tabla para desktop
 */

import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { UserResponse, Role } from "@/types"
import { getRoleLabel } from "@/lib/users-api"

interface UsersTableProps {
  users: UserResponse[]
  onEdit?: (user: UserResponse) => void
  onToggleActive?: (user: UserResponse) => void
  onViewDetails?: (user: UserResponse) => void
}

export function UsersTable({ 
  users, 
  onEdit, 
  onToggleActive, 
  onViewDetails 
}: UsersTableProps) {
  const columns: ColumnDef<UserResponse>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="text-sm font-mono text-primary-600">{value}</span>
      )
    },
    {
      key: 'username',
      label: 'Usuario',
      render: (value) => (
        <span className="text-sm font-medium text-primary-900">{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (value) => (
        <span className="text-sm text-primary-800">{value}</span>
      )
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (value, user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role: Role) => (
            <span
              key={role}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-300"
            >
              {getRoleLabel(role)}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value, user) => (
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          user.isActive
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-800"
        )}>
          {user.isActive ? (
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

  const actions: TableActions<UserResponse> = {
    onView: onViewDetails,
    onEdit,
    onToggleStatus: onToggleActive,
    toggleStatusIcon: (user) => (
      user.isActive ? <PowerOff className="w-4 h-4 text-red-500" /> : <Power className="w-4 h-4 text-green-500" />
    )
  }

  return (
    <div className="hidden md:block">
      <DataTable
        data={users}
        columns={columns}
        actions={actions}
        emptyMessage="No hay usuarios disponibles"
      />
    </div>
  )
}

