/**
 * Tipos relacionados con usuarios y autenticación
 */

// ============================================
// USUARIOS
// ============================================
export type Role = 
 | "ADMIN"
 | "GERENTE_GENERAL"
 | "GERENTE_DE_PLANTA"
 | "SUPERVISOR_DE_CALIDAD"
 | "SUPERVISOR_DE_PRODUCCION"
 | "SUPERVISOR_DE_ALMACEN"
 | "OPERARIO_DE_PLANTA"
 | "OPERARIO_DE_ALMACEN"
 | "OPERARIO_DE_CALIDAD"
 | "OPERARIO_DE_PRODUCCION" 

export interface UserCreateRequest {
  username: string
  password: string
  name: string
  roles: Role[]
  email?: string
  phoneNumber?: string
}

export interface UserResponse {
  id: number // Backend returns number
  username: string
  name: string
  roles: Role[]
  isActive: boolean
}

export interface UserDetail {
  id: number
  username: string
  name: string
  email?: string
  phoneNumber?: string
  roles: Role[]
  creationDate: string 
  lastLoginDate?: string
  isActive: boolean
}

export interface UpdateRoleRequest {
  roles: Role[]
}

export interface UpdatePasswordRequest {
  password: string
  passwordConfirmacion: string
  passwordMatching: boolean
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  phoneNumber?: string
}

export interface UserPageResponse {
  content: UserResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// ============================================
// USUARIO Y AUTENTICACIÓN
// ============================================

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "Admin" | "Maestro Cervecero" | "Operador" | "Supervisor"
  avatar?: string
}
