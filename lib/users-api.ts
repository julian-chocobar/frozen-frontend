/**
 * API específica para usuarios
 * Funciones para interactuar con el backend de usuarios
 */

import { api } from './fetcher'
import type { 
  UserResponse,
  UserDetail,
  UserCreateRequest,
  UserUpdateRequest,
  UpdateRoleRequest,
  UpdatePasswordRequest,
  UserPageResponse,
  Role
} from '@/types'

/**
 * Obtiene lista paginada de usuarios
 */
export async function getUsers(params: {
  page?: number
  size?: number
} = {}) {
  const urlParams: Record<string, string> = {}
  
  if (params.page !== undefined) urlParams.page = params.page.toString()
  if (params.size !== undefined) urlParams.size = params.size.toString()
  
  const response = await api.get<UserPageResponse>('/api/users', urlParams)
  
  return {
    users: response.content,
    pagination: {
      currentPage: response.currentPage,
      totalPages: response.totalPages,
      totalElements: response.totalItems,
      size: response.size,
      first: response.isFirst,
      last: response.isLast
    }
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(id: number): Promise<UserDetail> {
  const user = await api.get<UserDetail>(`/api/users/${id}`)
  return user
}

/**
 * Crea un nuevo usuario
 */
export async function createUser(data: UserCreateRequest): Promise<UserResponse> {
  const user = await api.post<UserResponse>('/api/users', data)
  return user
}

/**
 * Actualiza un usuario existente
 */
export async function updateUser(id: number, data: UserUpdateRequest): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}`, data)
  return user
}

/**
 * Actualiza los roles de un usuario
 */
export async function updateUserRoles(id: number, data: UpdateRoleRequest): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}/roles`, data)
  return user
}

/**
 * Actualiza la contraseña de un usuario
 */
export async function updateUserPassword(id: number, data: UpdatePasswordRequest): Promise<UserResponse> {
  // Note: passwordConfirmacion is for frontend validation only
  const payload = {
    password: data.password,
    passwordConfirmacion: data.password,
    passwordMatching: true
  }
  const user = await api.patch<UserResponse>(`/api/users/${id}/password`, payload)
  return user
}

/**
 * Activa/desactiva un usuario
 */
export async function toggleUserActive(id: number): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}/toggle-active`)
  return user
}

/**
 * Obtiene las opciones de roles
 */
export function getRoles(): Array<{ value: Role; label: string }> {
  return [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE_GENERAL', label: 'Gerente General' },
    { value: 'GERENTE_DE_PLANTA', label: 'Gerente de Planta' },
    { value: 'SUPERVISOR_DE_CALIDAD', label: 'Supervisor de Calidad' },
    { value: 'SUPERVISOR_DE_PRODUCCION', label: 'Supervisor de Producción' },
    { value: 'SUPERVISOR_DE_ALMACEN', label: 'Supervisor de Almacén' },
    { value: 'OPERARIO_DE_PLANTA', label: 'Operario de Planta' },
    { value: 'OPERARIO_DE_ALMACEN', label: 'Operario de Almacén' },
    { value: 'OPERARIO_DE_CALIDAD', label: 'Operario de Calidad' },
    { value: 'OPERARIO_DE_PRODUCCION', label: 'Operario de Producción' }
  ]
}

/**
 * Obtiene el label en español para un rol
 */
export function getRoleLabel(role: Role): string {
  const roles = getRoles()
  return roles.find(r => r.value === role)?.label || role
}

