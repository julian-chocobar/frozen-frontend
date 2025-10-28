'use client';

/**
 * Página de Gestión de Usuarios
 * - Lista de usuarios en tabla
 * - Paginación
 * - Acciones: Ver, Editar, Eliminar
 * - Crear nuevo usuario
 */

import { Header } from "@/components/layout/header"
import { UserCreateButton } from "./_components/create-button"
import { PaginationClient } from "./_components/pagination-client"
import { ErrorState } from "@/components/ui/error-state"
import { UsersClient } from "./_components/users-client"
import { getUsers } from "@/lib/users-api"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserResponse } from "@/types"

// Tipo para los datos de la página
interface UsersPageData {
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

export default function UsuariosPage() {
  const searchParams = useSearchParams()
  const [usersData, setUsersData] = useState<UsersPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await getUsers({
          page,
          size: 10
        })
        setUsersData(data)
      } catch (err) {
        console.error('Error al cargar usuarios:', err)
        
        // Detectar tipo de error para mostrar mensaje apropiado
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
            setError('No se pudo conectar con el backend')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudieron cargar los usuarios')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [page])

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
          
          {error ? (
            <ErrorState error={error} />
          ) : loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando usuarios...</p>
            </div>
          ) : usersData ? (
            <UsersClient 
              users={usersData.users} 
              pagination={usersData.pagination}
            />
          ) : null}
        </div>

        {/* Contador de resultados y paginación */}
        {usersData && (
          <div className="text-center space-y-4">
            <p className="text-sm text-primary-700">
              Mostrando {usersData.users.length} usuarios de {usersData.pagination.totalElements} totales
            </p>
            
            {/* Paginación funcional */}
            <PaginationClient 
              currentPage={usersData.pagination.currentPage}
              totalPages={usersData.pagination.totalPages}
            />
          </div>
        )}
      </div>
    </>
  )
}

