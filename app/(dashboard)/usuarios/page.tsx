/**
 * Página de Gestión de Usuarios
 * - Lista de usuarios en tabla
 * - Paginación
 * - Acciones: Ver, Editar, Eliminar
 * - Crear nuevo usuario
 */

import { Header } from "@/components/layout/header"
import { UsersTable } from "./_components/users-table"
import { UserCreateButton } from "./_components/create-button"

export default function UsuariosPage() {
  return (
    <>
      <Header
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
        notificationCount={2}
        actionButton={<UserCreateButton />}
      />
      
      <div className="p-4 md:p-6 space-y-6">
        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <h2 className="text-xl font-semibold text-primary-900 mb-1">Usuarios del Sistema</h2>
            <p className="text-sm text-primary-600">Gestiona roles, permisos y accesos de usuarios</p>
          </div>
          
          {/* Tabla de usuarios */}
          <UsersTable />
        </div>
      </div>
    </>
  )
}

