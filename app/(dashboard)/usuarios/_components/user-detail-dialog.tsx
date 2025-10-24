"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User as UserIcon, Mail, Shield, Calendar, Activity } from "lucide-react"
import type { User } from "./users-table"

interface UserDetailDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary-800">
            Detalle del Usuario
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar y nombre */}
          <div className="flex items-center gap-4 pb-4 border-b border-stroke">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{user.nombre}</h3>
              <p className="text-sm text-muted">{user.id}</p>
            </div>
          </div>

          {/* Información detallada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Correo Electrónico</span>
              </div>
              <p className="text-sm text-foreground pl-6">{user.email}</p>
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Rol</span>
              </div>
              <div className="pl-6">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-primary-100 text-primary-700 border border-primary-300">
                  {user.rol}
                </span>
              </div>
            </div>

            {/* Fecha de creación */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Fecha de Creación</span>
              </div>
              <p className="text-sm text-foreground pl-6">
                {new Date(user.fechaCreacion).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Estado</span>
              </div>
              <div className="pl-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold border ${
                    user.estado === "Activo"
                      ? "bg-success-100 text-success-700 border-success-300"
                      : "bg-alert-100 text-alert-700 border-alert-300"
                  }`}
                >
                  {user.estado}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

