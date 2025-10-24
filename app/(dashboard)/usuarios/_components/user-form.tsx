"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Lock, Shield } from "lucide-react"

interface UserFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

const ROLES = [
  "Administrador",
  "Maestro Cervecero",
  "Supervisor",
  "Operario",
]

export function UserForm({ onSubmit, onCancel, isLoading }: UserFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const isFormValid = formData.nombre && formData.email && formData.password && formData.rol

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre completo */}
      <div className="space-y-2">
        <Label htmlFor="nombre" className="text-sm font-semibold text-foreground">
          Nombre Completo
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            id="nombre"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="pl-10 h-11"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Correo Electrónico
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            id="email"
            type="email"
            placeholder="usuario@frozen.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 h-11"
            required
          />
        </div>
      </div>

      {/* Contraseña */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">
          Contraseña Inicial
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 h-11"
            required
            minLength={8}
          />
        </div>
        <p className="text-xs text-muted">
          El usuario podrá cambiar su contraseña después del primer inicio de sesión
        </p>
      </div>

      {/* Rol */}
      <div className="space-y-2">
        <Label htmlFor="rol-form" className="text-sm font-semibold text-foreground">
          Rol del Usuario
        </Label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted z-10 pointer-events-none" />
          <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
            <SelectTrigger id="rol-form" className="h-11 pl-10 bg-white">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
        >
          {isLoading ? "Creando..." : "Crear Usuario"}
        </Button>
      </div>
    </form>
  )
}

