/**
 * Utilidades para el módulo de usuarios
 * Funciones reutilizables para transformar, validar y formatear datos de usuarios
 */

import type { UserResponse, UserDetail, Role } from '@/types'
import { CheckCircle2, XCircle, Shield, User, Users, Briefcase } from 'lucide-react'

/**
 * Obtiene el texto de estado activo/inactivo
 * 
 * @param {boolean} isActive - Estado activo del usuario
 * @returns {string} 'Activo' o 'Inactivo'
 * 
 * @example
 * getActiveText(true) // 'Activo'
 * getActiveText(false) // 'Inactivo'
 */
export function getActiveText(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo'
}

/**
 * Obtiene el icono correspondiente al estado activo
 * 
 * @param {boolean} isActive - Estado activo del usuario
 * @returns {typeof CheckCircle2 | typeof XCircle} Icono de estado
 * 
 * @example
 * const Icon = getActiveIcon(true)
 * <Icon className="h-4 w-4" />
 */
export function getActiveIcon(isActive: boolean) {
  return isActive ? CheckCircle2 : XCircle
}

/**
 * Obtiene el icono correspondiente a un rol
 * 
 * @param {Role} role - Rol del usuario
 * @returns {typeof Shield | typeof User | typeof Users | typeof Briefcase} Icono del rol
 * 
 * @example
 * const Icon = getRoleIcon('ADMIN')
 * <Icon className="h-4 w-4" />
 */
export function getRoleIcon(role: Role) {
  const iconMap: Record<Role, typeof Shield | typeof User | typeof Users | typeof Briefcase> = {
    ADMIN: Shield,
    GERENTE_GENERAL: Briefcase,
    GERENTE_DE_PLANTA: Briefcase,
    SUPERVISOR_DE_CALIDAD: Users,
    SUPERVISOR_DE_PRODUCCION: Users,
    SUPERVISOR_DE_ALMACEN: Users,
    OPERARIO_DE_PLANTA: User,
    OPERARIO_DE_ALMACEN: User,
    OPERARIO_DE_CALIDAD: User,
    OPERARIO_DE_PRODUCCION: User,
  }
  
  return iconMap[role] || User
}

/**
 * Obtiene la configuración de badge para el estado activo
 * 
 * @param {boolean} isActive - Estado activo del usuario
 * @returns {Object} Configuración de badge (variant y className)
 * 
 * @example
 * const config = getActiveBadgeConfig(true)
 * <Badge variant={config.variant} className={config.className}>Activo</Badge>
 */
export function getActiveBadgeConfig(isActive: boolean) {
  return isActive
    ? { variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' }
    : { variant: 'secondary' as const, className: 'bg-gray-500 hover:bg-gray-600' }
}

/**
 * Obtiene la configuración de badge para un rol
 * 
 * @param {Role} role - Rol del usuario
 * @returns {Object} Configuración de badge (variant y className)
 * 
 * @example
 * const config = getRoleBadgeConfig('ADMIN')
 * <Badge variant={config.variant} className={config.className}>Admin</Badge>
 */
export function getRoleBadgeConfig(role: Role) {
  const configMap: Record<Role, { variant: 'default' | 'secondary'; className: string }> = {
    ADMIN: { variant: 'default', className: 'bg-purple-500 hover:bg-purple-600' },
    GERENTE_GENERAL: { variant: 'default', className: 'bg-red-500 hover:bg-red-600' },
    GERENTE_DE_PLANTA: { variant: 'default', className: 'bg-blue-500 hover:bg-blue-600' },
    SUPERVISOR_DE_CALIDAD: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
    SUPERVISOR_DE_PRODUCCION: { variant: 'default', className: 'bg-orange-500 hover:bg-orange-600' },
    SUPERVISOR_DE_ALMACEN: { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-600' },
    OPERARIO_DE_PLANTA: { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600' },
    OPERARIO_DE_ALMACEN: { variant: 'secondary', className: 'bg-gray-600 hover:bg-gray-700' },
    OPERARIO_DE_CALIDAD: { variant: 'secondary', className: 'bg-gray-400 hover:bg-gray-500' },
    OPERARIO_DE_PRODUCCION: { variant: 'secondary', className: 'bg-gray-500 hover:bg-gray-600' },
  }
  
  return configMap[role] || { variant: 'secondary' as const, className: '' }
}

/**
 * Formatea el nombre completo de un usuario
 * 
 * @param {UserResponse | UserDetail} user - Usuario
 * @returns {string} Nombre completo formateado
 * 
 * @example
 * formatUserFullName({ name: 'Juan Pérez' })
 * // 'Juan Pérez'
 */
export function formatUserFullName(user: UserResponse | UserDetail): string {
  return user.name.trim()
}

/**
 * Formatea la fecha de creación de un usuario
 * 
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada (dd/mm/yyyy)
 * 
 * @example
 * formatUserDate('2024-01-15T10:30:00')
 * // '15/01/2024'
 */
export function formatUserDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

/**
 * Valida los datos de un usuario
 * 
 * @param {Object} data - Datos del usuario a validar
 * @returns {Object} Resultado de validación
 * @returns {boolean} .valid - Si es válido
 * @returns {string[]} .errors - Lista de errores
 * 
 * @example
 * const validation = validateUserData({
 *   username: 'ju',
 *   email: 'invalid-email',
 *   firstName: 'Juan'
 * })
 * if (!validation.valid) {
 *   console.log(validation.errors)
 * }
 */
export function validateUserData(data: {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  password?: string
  roles?: Role[]
}): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.username !== undefined) {
    if (data.username.length < 3) {
      errors.push('El nombre de usuario debe tener al menos 3 caracteres')
    }
    if (data.username.length > 50) {
      errors.push('El nombre de usuario no puede tener más de 50 caracteres')
    }
  }

  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.push('El email no tiene un formato válido')
    }
  }

  if (data.firstName !== undefined && data.firstName.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (data.lastName !== undefined && data.lastName.length < 2) {
    errors.push('El apellido debe tener al menos 2 caracteres')
  }

  if (data.password !== undefined && data.password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres')
  }

  if (data.roles !== undefined && data.roles.length === 0) {
    errors.push('Debe seleccionar al menos un rol')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Filtra usuarios por estado activo
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @param {boolean} isActive - Estado a filtrar
 * @returns {UserResponse[]} Usuarios filtrados
 * 
 * @example
 * const activeUsers = filterUsersByActive(users, true)
 */
export function filterUsersByActive(users: UserResponse[], isActive: boolean): UserResponse[] {
  return users.filter(user => user.isActive === isActive)
}

/**
 * Filtra usuarios por rol
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @param {Role} role - Rol a filtrar
 * @returns {UserResponse[]} Usuarios filtrados
 * 
 * @example
 * const admins = filterUsersByRole(users, 'ADMIN')
 */
export function filterUsersByRole(users: UserResponse[], role: Role): UserResponse[] {
  return users.filter(user => user.roles.includes(role))
}

/**
 * Calcula estadísticas de usuarios
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @returns {Object} Estadísticas calculadas
 * 
 * @example
 * const stats = calculateUserStats(users)
 * console.log(`Total: ${stats.total}, Activos: ${stats.active}`)
 */
export function calculateUserStats(users: UserResponse[]) {
  const total = users.length
  const active = users.filter(u => u.isActive).length
  const inactive = total - active
  
  const roleCount = users.reduce((acc, user) => {
    user.roles.forEach(role => {
      acc[role] = (acc[role] || 0) + 1
    })
    return acc
  }, {} as Record<Role, number>)

  return {
    total,
    active,
    inactive,
    roleCount,
    activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
  }
}

/**
 * Ordena usuarios por nombre
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @param {'asc' | 'desc'} order - Orden de clasificación
 * @returns {UserResponse[]} Usuarios ordenados
 * 
 * @example
 * const sorted = sortUsersByName(users, 'asc')
 */
export function sortUsersByName(users: UserResponse[], order: 'asc' | 'desc' = 'asc'): UserResponse[] {
  return [...users].sort((a, b) => {
    const nameA = formatUserFullName(a).toLowerCase()
    const nameB = formatUserFullName(b).toLowerCase()
    return order === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA)
  })
}

/**
 * Ordena usuarios por username
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @param {'asc' | 'desc'} order - Orden de clasificación
 * @returns {UserResponse[]} Usuarios ordenados
 * 
 * @example
 * const sorted = sortUsersByUsername(users, 'desc')
 */
export function sortUsersByUsername(users: UserResponse[], order: 'asc' | 'desc' = 'asc'): UserResponse[] {
  return [...users].sort((a, b) => {
    return order === 'asc'
      ? a.username.localeCompare(b.username)
      : b.username.localeCompare(a.username)
  })
}

/**
 * Busca usuarios por texto en username o nombre
 * 
 * @param {UserResponse[]} users - Lista de usuarios
 * @param {string} searchText - Texto de búsqueda
 * @returns {UserResponse[]} Usuarios que coinciden
 * 
 * @example
 * const results = searchUsers(users, 'juan')
 */
export function searchUsers(users: UserResponse[], searchText: string): UserResponse[] {
  const search = searchText.toLowerCase().trim()
  
  if (!search) return users

  return users.filter(user => 
    user.username.toLowerCase().includes(search) ||
    user.name.toLowerCase().includes(search)
  )
}

/**
 * Genera un resumen de información de un usuario
 * 
 * @param {UserResponse | UserDetail} user - Usuario
 * @returns {string} Resumen del usuario
 * 
 * @example
 * const summary = getUserSummary(user)
 * // 'Juan Pérez (@juanp) - ADMIN - Activo'
 */
export function getUserSummary(user: UserResponse | UserDetail): string {
  const fullName = formatUserFullName(user)
  const roles = user.roles.join(', ')
  const status = getActiveText(user.isActive)
  
  return `${fullName} (@${user.username}) - ${roles} - ${status}`
}

/**
 * Verifica si un usuario tiene un rol específico
 * 
 * @param {UserResponse | UserDetail} user - Usuario
 * @param {Role} role - Rol a verificar
 * @returns {boolean} true si el usuario tiene el rol
 * 
 * @example
 * if (hasRole(user, 'ADMIN')) {
 *   console.log('El usuario es admin')
 * }
 */
export function hasRole(user: UserResponse | UserDetail, role: Role): boolean {
  return user.roles.includes(role)
}

/**
 * Verifica si un usuario tiene cualquiera de los roles especificados
 * 
 * @param {UserResponse | UserDetail} user - Usuario
 * @param {Role[]} roles - Lista de roles a verificar
 * @returns {boolean} true si el usuario tiene al menos uno de los roles
 * 
 * @example
 * if (hasAnyRole(user, ['ADMIN', 'PRODUCTION_MANAGER'])) {
 *   console.log('Usuario con permisos de gestión')
 * }
 */
export function hasAnyRole(user: UserResponse | UserDetail, roles: Role[]): boolean {
  return roles.some(role => user.roles.includes(role))
}

/**
 * Verifica si un usuario tiene todos los roles especificados
 * 
 * @param {UserResponse | UserDetail} user - Usuario
 * @param {Role[]} roles - Lista de roles a verificar
 * @returns {boolean} true si el usuario tiene todos los roles
 * 
 * @example
 * if (hasAllRoles(user, ['ADMIN', 'VIEWER'])) {
 *   console.log('Usuario con múltiples roles')
 * }
 */
export function hasAllRoles(user: UserResponse | UserDetail, roles: Role[]): boolean {
  return roles.every(role => user.roles.includes(role))
}
