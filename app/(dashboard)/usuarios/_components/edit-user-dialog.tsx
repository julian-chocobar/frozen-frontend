"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import type { User } from "./users-table"

interface EditUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: (user: User) => void
}

const ROLES = [
  "Administrador",
  "Maestro Cervecero",
  "Supervisor",
  "Operario",
]

export function EditUserDialog({ user, open, onOpenChange, onUserUpdated }: EditUserDialogProps) {
  const [rol, setRol] = useState(user.rol)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)

    // Simular guardado
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        rol
      }
      onUserUpdated(updatedUser)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-800">
            Editar Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información no editable */}
          <div className="bg-surface-secondary rounded-lg p-4 space-y-3">
            <div>
              <p className="text-xs text-muted font-medium">ID</p>
              <p className="text-sm text-foreground font-semibold">{user.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-medium">Nombre</p>
              <p className="text-sm text-foreground font-semibold">{user.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-medium">Email</p>
              <p className="text-sm text-foreground">{user.email}</p>
            </div>
          </div>

          {/* Campo editable: Rol */}
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-sm font-semibold text-foreground">
              Rol del Usuario
            </Label>
            <Select value={rol} onValueChange={setRol}>
              <SelectTrigger id="rol" className="h-11 bg-white">
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
            <p className="text-xs text-muted">
              Solo puedes modificar el rol del usuario
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || rol === user.rol}
            className="flex-1 sm:flex-initial bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

