"use client"

/**
 * Formulario para crear usuarios
 */

import { useState } from "react"
import { getRoles } from "@/lib/users"
import type { UserCreateRequest, Role } from "@/types"

interface UserFormProps {
  onSubmit: (data: UserCreateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function UserForm({ onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    phoneNumber: "",
    roles: [] as Role[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const roles = getRoles()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre completo es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    }

    if (formData.roles.length === 0) {
      newErrors.roles = "Debe seleccionar al menos un rol"
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const createData: UserCreateRequest = {
        username: formData.username,
        name: formData.name,
        password: formData.password,
        roles: formData.roles,
      }
      
      if (formData.email.trim()) createData.email = formData.email
      if (formData.phoneNumber.trim()) createData.phoneNumber = formData.phoneNumber
      
      onSubmit(createData)
    }
  }

  const handleChange = (field: string, value: string | Role[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleRoleToggle = (role: Role) => {
    setFormData(prev => {
      const isSelected = prev.roles.includes(role)
      return {
        ...prev,
        roles: isSelected 
          ? prev.roles.filter(r => r !== role)
          : [...prev.roles, role]
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Nombre de Usuario *
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.username ? "border-red-500" : "border-stroke"
            }`}
            placeholder="Ej: juan.perez"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.name ? "border-red-500" : "border-stroke"
            }`}
            placeholder="Ej: Juan Pérez"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.email ? "border-red-500" : "border-stroke"
            }`}
            placeholder="usuario@frozen.com (opcional)"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Teléfono
          </label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="+54 9 1234 5678 (opcional)"
          />
        </div>

        {/* Contraseña */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Contraseña Inicial *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.password ? "border-red-500" : "border-stroke"
            }`}
            placeholder="**********"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <p className="text-xs text-primary-500 mt-1">
            La contraseña debe tener al menos 8 caracteres y al menos una letra mayúscula, una letra minúscula y un número.
          </p>
        </div>
      </div>

      {/* Roles */}
      <div>
        <label className="block text-sm font-medium text-primary-900 mb-3">
          Roles *
        </label>
        <div className="border border-stroke rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
          {roles.map((role) => (
            <label
              key={role.value}
              className="flex items-center cursor-pointer hover:bg-primary-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={formData.roles.includes(role.value)}
                onChange={() => handleRoleToggle(role.value)}
                className="mr-2"
              />
              <span className="text-sm text-primary-900">{role.label}</span>
            </label>
          ))}
        </div>
        {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
        {formData.roles.length > 0 && (
          <p className="text-sm text-primary-600 mt-2">
            Roles seleccionados: {formData.roles.map(r => getRoles().find(role => role.value === r)?.label).join(", ")}
          </p>
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
          {isLoading ? "Creando..." : "Crear Usuario"}
        </button>
      </div>
    </form>
  )
}

