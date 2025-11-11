"use client"

/**
 * Componente cliente para manejar operaciones CRUD de usuarios
 * Incluye modales para ver detalles, editar roles y crear
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UsersTable } from "./users-table"
import { UsersCards } from "./users-cards"
import { 
  updateUser, 
  toggleUserActive,
  updateUserRoles,
  getUserById
} from "@/lib/users-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { UserResponse, UserUpdateRequest, UpdateRoleRequest, UserDetail } from "@/types"
import { UserDetailView } from "./user-detail-view"
import { UserRoleUpdate } from "./user-role-update"
import { PaginationClient } from "@/components/ui/pagination-client"

interface UsersClientProps {
  users: UserResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export function UsersClient({ users, pagination }: UsersClientProps) {
  const router = useRouter()
  const [localUsers, setLocalUsers] = useState<UserResponse[]>(users)
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null)
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [isEditingRoles, setIsEditingRoles] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  // Actualizar localUsers cuando cambien los props
  useEffect(() => {
    setLocalUsers(users)
  }, [users])

  const handleToggleActive = async (user: UserResponse) => {
    setIsLoading(true)
    try {
      await toggleUserActive(user.id)
      // Actualizar el estado local optimísticamente
      setLocalUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, isActive: !u.isActive }
            : u
        )
      )
      const action = user.isActive ? 'desactivado' : 'activado'
      showSuccess(`Usuario ${action} exitosamente`)
      // Refrescar la página después de un breve delay para sincronizar
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      // Revertir el cambio optimista en caso de error
      setLocalUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, isActive: user.isActive }
            : u
        )
      )
      handleError(error, {
        title: 'Error al cambiar estado del usuario'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRoles = async (data: UpdateRoleRequest) => {
    if (!selectedUser) return
    
    setIsLoading(true)
    try {
      await updateUserRoles(selectedUser.id, data)
      
      // Actualizar el estado local inmediatamente
      setLocalUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUser.id 
            ? { ...u, roles: data.roles }
            : u
        )
      )
      
      // Actualizar también el userDetail si está disponible
      if (userDetail) {
        setUserDetail(prev => prev ? { ...prev, roles: data.roles } : null)
      }
      
      setIsEditingRoles(false)
      setSelectedUser(null)
      showSuccess('Roles actualizados exitosamente')
      
      // Refrescar la página después de un breve delay para sincronizar con el backend
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error) {
      handleError(error, {
        title: 'Error al actualizar roles'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (user: UserResponse) => {
    setIsViewing(true)
    setIsLoadingDetail(true)
    
    try {
      const detail = await getUserById(user.id)
      setUserDetail(detail)
      setSelectedUser(user)
    } catch (error) {
      handleError(error, {
        title: 'Error al cargar detalles del usuario'
      })
      setIsViewing(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleEditRoles = async () => {
    if (!selectedUser) return
    
    setIsEditingRoles(true)
    setIsViewing(false)
  }

  const closeModals = () => {
    setIsViewing(false)
    setIsEditingRoles(false)
    setSelectedUser(null)
    setUserDetail(null)
  }

  return (
    <>
      <UsersTable
        users={localUsers}
        onToggleActive={handleToggleActive}
        onViewDetails={handleViewDetails}
      />
      <UsersCards
        users={localUsers}
        onToggleActive={handleToggleActive}
        onViewDetails={handleViewDetails}
      />

      {pagination && (
        <div className="mt-4 border-t border-stroke bg-primary-50/40 px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
            <p>
              Mostrando {localUsers.length} usuarios de {pagination.totalElements} totales
            </p>
            <PaginationClient 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {isViewing && selectedUser && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
            <div className="p-6">
              {isLoadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="ml-4 text-primary-600">Cargando detalles...</p>
                </div>
              ) : userDetail ? (
                <UserDetailView
                  user={userDetail}
                  onClose={closeModals}
                  onToggleActive={() => {
                    closeModals()
                    handleToggleActive(selectedUser)
                  }}
                  onEditRoles={handleEditRoles}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar roles */}
      {isEditingRoles && selectedUser && userDetail && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary-900">
                Editar Roles de {userDetail.name}
              </h2>
              <UserRoleUpdate
                userRoles={userDetail.roles}
                onSubmit={handleUpdateRoles}
                onCancel={() => {
                  setIsEditingRoles(false)
                  setIsViewing(true)
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

