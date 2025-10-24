"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"
import type { User } from "./users-table"

interface DeleteUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserDeleted: (userId: string) => void
}

export function DeleteUserDialog({ user, open, onOpenChange, onUserDeleted }: DeleteUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = () => {
    setIsLoading(true)

    // Simular eliminación
    setTimeout(() => {
      onUserDeleted(user.id)
      setIsLoading(false)
      alert("Usuario eliminado exitosamente")
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-foreground">
              Eliminar Usuario
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-3">
            ¿Estás seguro de que deseas eliminar al usuario{" "}
            <span className="font-semibold text-foreground">{user.nombre}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Información del usuario */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted font-medium">ID:</span>
            <span className="text-sm text-foreground font-semibold">{user.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted font-medium">Email:</span>
            <span className="text-sm text-foreground">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted font-medium">Rol:</span>
            <span className="text-sm text-foreground font-semibold">{user.rol}</span>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-900">
            <strong>Advertencia:</strong> Esta acción no se puede deshacer. Todos los datos asociados a este usuario serán eliminados permanentemente.
          </p>
        </div>

        <AlertDialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 sm:flex-initial"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Usuario
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

