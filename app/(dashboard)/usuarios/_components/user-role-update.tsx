"use client"

/**
 * Formulario para actualizar roles de usuario
 */

import { useState } from "react"
import { getRoles } from "@/lib/users-api"
import type { Role, UpdateRoleRequest } from "@/types"

interface UserRoleUpdateProps {
  userRoles: Role[]
  onSubmit: (data: UpdateRoleRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function UserRoleUpdate({ 
  userRoles, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: UserRoleUpdateProps) {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(userRoles)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = getRoles()

  const validateForm = () => {
    if (selectedRoles.length === 0) {
      setErrors({ roles: "Debe seleccionar al menos un rol" })
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit({ roles: selectedRoles })
    }
  }

  const handleRoleToggle = (role: Role) => {
    setSelectedRoles(prev => {
      const isSelected = prev.includes(role)
      return isSelected 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    })
    if (errors.roles) {
      setErrors({})
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-primary-900">
          Selecciona los roles para este usuario *
        </label>
        <div className="border border-stroke rounded-lg p-4 space-y-2 max-h-64 overflow-y-auto">
          {roles.map((role) => {
            const isSelected = selectedRoles.includes(role.value)
            return (
              <label
                key={role.value}
                className={`flex items-center cursor-pointer hover:bg-primary-50 p-3 rounded border transition-colors ${
                  isSelected 
                    ? "border-primary-500 bg-primary-50" 
                    : "border-transparent"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleRoleToggle(role.value)}
                  className="mr-3 w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-primary-900 font-medium">{role.label}</span>
              </label>
            )
          })}
        </div>
        {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
        
        {selectedRoles.length > 0 && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-xs font-medium text-primary-700 mb-2">
              Roles seleccionados ({selectedRoles.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map(role => {
                const roleInfo = roles.find(r => r.value === role)
                return (
                  <span
                    key={role}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-primary-600 text-white"
                  >
                    {roleInfo?.label || role}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Actualizando..." : "Actualizar Roles"}
        </button>
      </div>
    </form>
  )
}

