"use client"

/**
 * Vista de detalle del usuario
 * Muestra toda la información del usuario incluyendo roles, fechas, etc.
 */

import { X, Edit, Power, PowerOff, Shield, User as UserIcon, Mail, Phone, Calendar, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UserDetail, Role } from "@/types"
import { getRoleLabel } from "@/lib/users-api"

interface UserDetailViewProps {
  user: UserDetail
  onClose: () => void
  onEdit?: () => void
  onToggleActive?: () => void
  onEditRoles?: () => void
}

export function UserDetailView({ 
  user, 
  onClose, 
  onEdit,
  onToggleActive,
  onEditRoles
}: UserDetailViewProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stroke">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-900">{user.name}</h2>
            <p className="text-sm text-primary-600">{user.username} (#{user.id})</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-primary-50 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-primary-600" />
        </button>
      </div>

      {/* Estado */}
      <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg border border-stroke">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <div>
            <p className="text-sm font-medium text-primary-900">Estado</p>
            <p className="text-xs text-primary-600">Estado actual del usuario</p>
          </div>
        </div>
        <span className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold",
          user.isActive
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        )}>
          {user.isActive ? (
            <>
              <Power className="w-4 h-4" />
              Activo
            </>
          ) : (
            <>
              <PowerOff className="w-4 h-4" />
              Inactivo
            </>
          )}
        </span>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Email</span>
          </div>
          <p className="text-sm text-primary-900 pl-6">{user.email || 'No especificado'}</p>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Teléfono</span>
          </div>
          <p className="text-sm text-primary-900 pl-6">{user.phoneNumber || 'No especificado'}</p>
        </div>

        {/* Fecha de creación */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Fecha de Creación</span>
          </div>
          <p className="text-sm text-primary-900 pl-6">{formatDate(user.creationDate)}</p>
        </div>

        {/* Último acceso */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Último Acceso</span>
          </div>
          <p className="text-sm text-primary-900 pl-6">{formatDate(user.lastLoginDate)}</p>
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-900">Roles Asignados</span>
          </div>
          {onEditRoles && (
            <button
              onClick={onEditRoles}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Editar Roles
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role: Role) => (
            <span
              key={role}
              className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-300"
            >
              {getRoleLabel(role)}
            </span>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-6 border-t border-stroke">
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Editar Usuario
          </button>
        )}
        {onToggleActive && (
          <button
            onClick={onToggleActive}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              user.isActive
                ? "text-red-600 bg-white border border-red-300 hover:bg-red-50"
                : "text-green-600 bg-white border border-green-300 hover:bg-green-50"
            )}
          >
            {user.isActive ? (
              <>
                <PowerOff className="w-4 h-4" />
                Desactivar
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                Activar
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

