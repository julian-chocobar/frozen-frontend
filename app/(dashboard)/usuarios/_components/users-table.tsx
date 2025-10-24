"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { UserDetailDialog } from "./user-detail-dialog"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteUserDialog } from "./delete-user-dialog"

/**
 * Tabla de Usuarios
 * - Muestra lista de usuarios
 * - Paginación
 * - Acciones por usuario
 */

export interface User {
  id: string
  nombre: string
  email: string
  rol: string
  fechaCreacion: string
  estado: "Activo" | "Inactivo"
}

// Datos simulados
const MOCK_USERS: User[] = [
  {
    id: "USR001",
    nombre: "Juan Pérez",
    email: "juan.perez@frozen.com",
    rol: "Administrador",
    fechaCreacion: "2024-01-15",
    estado: "Activo"
  },
  {
    id: "USR002",
    nombre: "María García",
    email: "maria.garcia@frozen.com",
    rol: "Maestro Cervecero",
    fechaCreacion: "2024-02-20",
    estado: "Activo"
  },
  {
    id: "USR003",
    nombre: "Carlos López",
    email: "carlos.lopez@frozen.com",
    rol: "Operario",
    fechaCreacion: "2024-03-10",
    estado: "Activo"
  },
  {
    id: "USR004",
    nombre: "Ana Martínez",
    email: "ana.martinez@frozen.com",
    rol: "Supervisor",
    fechaCreacion: "2024-01-25",
    estado: "Activo"
  },
  {
    id: "USR005",
    nombre: "Pedro Sánchez",
    email: "pedro.sanchez@frozen.com",
    rol: "Operario",
    fechaCreacion: "2024-04-05",
    estado: "Inactivo"
  },
  {
    id: "USR006",
    nombre: "Laura Fernández",
    email: "laura.fernandez@frozen.com",
    rol: "Administrador",
    fechaCreacion: "2024-02-15",
    estado: "Activo"
  },
  {
    id: "USR007",
    nombre: "Roberto Díaz",
    email: "roberto.diaz@frozen.com",
    rol: "Maestro Cervecero",
    fechaCreacion: "2024-03-20",
    estado: "Activo"
  },
  {
    id: "USR008",
    nombre: "Carmen Ruiz",
    email: "carmen.ruiz@frozen.com",
    rol: "Supervisor",
    fechaCreacion: "2024-04-10",
    estado: "Activo"
  },
  {
    id: "USR009",
    nombre: "José Torres",
    email: "jose.torres@frozen.com",
    rol: "Operario",
    fechaCreacion: "2024-01-30",
    estado: "Activo"
  },
  {
    id: "USR010",
    nombre: "Isabel Moreno",
    email: "isabel.moreno@frozen.com",
    rol: "Operario",
    fechaCreacion: "2024-05-01",
    estado: "Activo"
  },
]

const ITEMS_PER_PAGE = 8

export function UsersTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = users.slice(startIndex, endIndex)

  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteOpen(true)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u))
    setIsEditOpen(false)
  }

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId))
    setIsDeleteOpen(false)
    // Ajustar página si es necesario
    const newTotalPages = Math.ceil((users.length - 1) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  return (
    <>
      {/* Tabla - Desktop */}
      <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b-2 border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rol</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke">
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-secondary transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{user.nombre}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-primary-100 text-primary-700 border border-primary-300">
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetail(user)}
                        className="border-primary-300 text-primary-600 hover:bg-primary-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="border-primary-300 text-primary-600 hover:bg-primary-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile */}
        <div className="md:hidden divide-y divide-stroke">
          {currentUsers.map((user) => (
            <div key={user.id} className="p-4 hover:bg-surface-secondary transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.nombre}</p>
                    <p className="text-xs text-muted mt-1">{user.id}</p>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-300">
                    {user.rol}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(user)}
                    className="flex-1 border-primary-300 text-primary-600 hover:bg-primary-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="flex-1 border-primary-300 text-primary-600 hover:bg-primary-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(user)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Paginación */}
      <div className="border-t-2 border-border bg-surface-secondary px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted">
            Mostrando <span className="font-medium text-foreground">{startIndex + 1}</span> a{" "}
            <span className="font-medium text-foreground">{Math.min(endIndex, users.length)}</span> de{" "}
            <span className="font-medium text-foreground">{users.length}</span> usuarios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {selectedUser && (
        <>
          <UserDetailDialog
            user={selectedUser}
            open={isDetailOpen}
            onOpenChange={setIsDetailOpen}
          />
          <EditUserDialog
            user={selectedUser}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onUserUpdated={handleUserUpdated}
          />
          <DeleteUserDialog
            user={selectedUser}
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onUserDeleted={handleUserDeleted}
          />
        </>
      )}
    </>
  )
}

