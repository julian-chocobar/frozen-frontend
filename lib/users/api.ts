/**
 * API específica para usuarios
 * Funciones para interactuar con el backend de usuarios
 */

import { api } from '../fetcher'
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
 * 
 * @param {Object} [params] - Parámetros de paginación
 * @param {number} [params.page=0] - Número de página (base 0)
 * @param {number} [params.size=10] - Cantidad de elementos por página
 * 
 * @returns {Promise<Object>} Objeto con usuarios y paginación
 * @returns {UserResponse[]} .users - Lista de usuarios
 * @returns {Object} .pagination - Información de paginación
 * 
 * @throws {ApiError} Si la petición falla
 * 
 * @example
 * // Obtener primera página
 * const { users, pagination } = await getUsers({ page: 0, size: 10 })
 * 
 * @example
 * // Obtener segunda página
 * const result = await getUsers({ page: 1 })
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
 * Obtiene un usuario por ID con información detallada
 * 
 * @param {number} id - ID del usuario
 * @returns {Promise<UserDetail>} Datos detallados del usuario
 * 
 * @throws {ApiError} Si el usuario no existe o la petición falla
 * 
 * @example
 * const user = await getUserById(123)
 * console.log(user.username, user.email, user.roles)
 */
export async function getUserById(id: number): Promise<UserDetail> {
  const user = await api.get<UserDetail>(`/api/users/${id}`)
  return user
}

/**
 * Crea un nuevo usuario en el sistema
 * 
 * @param {UserCreateRequest} data - Datos del usuario a crear
 * @param {string} data.username - Nombre de usuario único (3-50 caracteres)
 * @param {string} data.email - Email del usuario
 * @param {string} data.password - Contraseña (mínimo 6 caracteres)
 * @param {string} data.firstName - Nombre
 * @param {string} data.lastName - Apellido
 * @param {Role[]} data.roles - Lista de roles asignados
 * @param {boolean} [data.isActive=true] - Estado activo del usuario
 * 
 * @returns {Promise<UserResponse>} Usuario creado
 * 
 * @throws {ApiError} Si la validación falla o la petición falla
 * 
 * @example
 * const newUser = await createUser({
 *   username: 'jperez',
 *   email: 'jperez@example.com',
 *   password: 'password123',
 *   firstName: 'Juan',
 *   lastName: 'Pérez',
 *   roles: ['VIEWER'],
 *   isActive: true
 * })
 */
export async function createUser(data: UserCreateRequest): Promise<UserResponse> {
  const user = await api.post<UserResponse>('/api/users', data)
  return user
}

/**
 * Actualiza un usuario existente
 * 
 * @param {number} id - ID del usuario a actualizar
 * @param {UserUpdateRequest} data - Datos a actualizar
 * @param {string} [data.email] - Nuevo email
 * @param {string} [data.firstName] - Nuevo nombre
 * @param {string} [data.lastName] - Nuevo apellido
 * 
 * @returns {Promise<UserResponse>} Usuario actualizado
 * 
 * @throws {ApiError} Si el usuario no existe o la validación falla
 * 
 * @example
 * const updated = await updateUser(123, {
 *   email: 'nuevo@example.com',
 *   firstName: 'Juan Carlos'
 * })
 */
export async function updateUser(id: number, data: UserUpdateRequest): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}`, data)
  return user
}

/**
 * Actualiza los roles de un usuario
 * 
 * @param {number} id - ID del usuario
 * @param {UpdateRoleRequest} data - Nuevos roles
 * @param {Role[]} data.roles - Lista de roles a asignar
 * 
 * @returns {Promise<UserResponse>} Usuario con roles actualizados
 * 
 * @throws {ApiError} Si el usuario no existe o los roles son inválidos
 * 
 * @example
 * const updated = await updateUserRoles(123, {
 *   roles: ['ADMIN', 'VIEWER']
 * })
 */
export async function updateUserRoles(id: number, data: UpdateRoleRequest): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}/roles`, data)
  return user
}

/**
 * Actualiza la contraseña de un usuario
 * 
 * @param {number} id - ID del usuario
 * @param {UpdatePasswordRequest} data - Nueva contraseña
 * @param {string} data.password - Nueva contraseña (mínimo 6 caracteres)
 * 
 * @returns {Promise<UserResponse>} Usuario actualizado
 * 
 * @throws {ApiError} Si el usuario no existe o la contraseña es inválida
 * 
 * @example
 * const updated = await updateUserPassword(123, {
 *   password: 'newSecurePassword123'
 * })
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
 * Activa o desactiva un usuario
 * 
 * @param {number} id - ID del usuario
 * @returns {Promise<UserResponse>} Usuario con estado actualizado
 * 
 * @throws {ApiError} Si el usuario no existe o la petición falla
 * 
 * @example
 * // Cambiar estado activo/inactivo
 * const toggled = await toggleUserActive(123)
 * console.log('Nuevo estado:', toggled.isActive ? 'Activo' : 'Inactivo')
 */
export async function toggleUserActive(id: number): Promise<UserResponse> {
  const user = await api.patch<UserResponse>(`/api/users/${id}/toggle-active`)
  return user
}

/**
 * Obtiene las opciones de roles disponibles en el sistema
 * 
 * @returns {Array<Object>} Lista de roles con valor y etiqueta
 * @returns {Role} [].value - Valor del rol
 * @returns {string} [].label - Etiqueta en español
 * 
 * @example
 * const roles = getRoles()
 * // [{ value: 'ADMIN', label: 'Administrador' }, ...]
 */
export function getRoles(): Array<{ value: Role; label: string }> {
  return [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'GERENTE_GENERAL', label: 'Gerente General' },
    { value: 'GERENTE_DE_PLANTA', label: 'Gerente de Planta' },
    { value: 'SUPERVISOR_DE_CALIDAD', label: 'Supervisor de Calidad' },
    { value: 'SUPERVISOR_DE_PRODUCCION', label: 'Supervisor de Producción' },
    { value: 'SUPERVISOR_DE_ALMACEN', label: 'Supervisor de Almacén' },
    { value: 'OPERARIO_DE_ALMACEN', label: 'Operario de Almacén' },
    { value: 'OPERARIO_DE_CALIDAD', label: 'Operario de Calidad' },
    { value: 'OPERARIO_DE_PRODUCCION', label: 'Operario de Producción' }
  ]
}

/**
 * Obtiene el label en español para un rol específico
 * 
 * @param {Role} role - Rol del usuario
 * @returns {string} Etiqueta en español del rol
 * 
 * @example
 * const label = getRoleLabel('ADMIN') // 'Administrador'
 * const label2 = getRoleLabel('VIEWER') // 'Visualizador'
 */
export function getRoleLabel(role: Role): string {
  const roles = getRoles()
  return roles.find(r => r.value === role)?.label || role
}

