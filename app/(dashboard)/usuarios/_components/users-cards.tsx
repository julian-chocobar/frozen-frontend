/**
 * Componente UsersCards - Wrapper específico para usuarios usando DataCards genérico
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { UserResponse, Role } from "@/types"
import { getRoleLabel } from "@/lib/users-api"

interface UsersCardsProps {
  users: UserResponse[]
  onEdit?: (user: UserResponse) => void
  onToggleActive?: (user: UserResponse) => void
  onViewDetails?: (user: UserResponse) => void
}

export function UsersCards({ 
  users, 
  onEdit, 
  onToggleActive, 
  onViewDetails 
}: UsersCardsProps) {
  const layout: CardLayout<UserResponse> = {
    header: [
      {
        key: 'id',
        label: '',
        showLabel: false,
        render: (value) => (
          <p className="text-xs font-mono text-primary-600 mb-1">{value}</p>
        )
      },
      {
        key: 'username',
        label: '',
        showLabel: false,
        render: (value) => (
          <h3 className="text-base font-semibold text-primary-900">{value}</h3>
        )
      }
    ],
    content: [
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
                className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-primary-100 text-primary-700"
              >
                {getRoleLabel(role)}
              </span>
            ))}
          </div>
        )
      }
    ],
    footer: [
      {
        key: 'isActive',
        label: '',
        showLabel: false,
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
  }

  const actions: TableActions<UserResponse> = {
    onView: onViewDetails,
    onEdit,
    onToggleStatus: onToggleActive,
    toggleStatusIcon: (user) => (
      user.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />
    )
  }

  return (
    <div className="md:hidden">
      <DataCards
        data={users}
        layout={layout}
        actions={actions}
        emptyMessage="No hay usuarios disponibles"
      />
    </div>
  )
}

