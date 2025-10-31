/**
 * API específica para movimientos
 * Funciones para interactuar con el backend de movimientos
 */
import { api } from './fetcher'
import type { 
  MovementResponse, 
  MovementCreateRequest,
  MovementsPageResponse, 
  MovementsFilters,
  MovementType,
  MovementStatus,
  MovementDetailResponse,
} from '@/types'

const TYPE_LABELS: Record<MovementType, string> = {
  'INGRESO': 'Ingreso',
  'EGRESO': 'Egreso'
}

const STATUS_LABELS: Record<MovementStatus, string> = {
  'PENDIENTE': 'Pendiente',
  'EN_PROCESO': 'En Proceso',
  'COMPLETADO': 'Completado'
}

/**
 * Convierte una fecha en formato YYYY-MM-DD a OffsetDateTime
 * El backend espera fechas en formato ISO 8601 con zona horaria
 */
function formatDateToOffsetDateTime(dateString: string): string {
  // Crear fecha en zona horaria local, no UTC
  const date = new Date(dateString + 'T00:00:00')
  return date.toISOString()
}

function mapFiltersToAPI(filters: {
  type?: string
  status?: string
  materialId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
}): MovementsFilters {
  const apiFilters: MovementsFilters = {
    page: filters.page || 0,
    size: filters.size || 10
  }
  if (filters.type) {
    apiFilters.type = filters.type as MovementType
  }
  if (filters.status) {
    apiFilters.status = filters.status as MovementStatus
  }
  if (filters.materialId) {
    apiFilters.materialId = filters.materialId
  }
  if (filters.dateFrom) {
    // Convertir fecha de inicio al formato OffsetDateTime
    apiFilters.dateFrom = formatDateToOffsetDateTime(filters.dateFrom)
  }
  if (filters.dateTo) {
    // Para fecha fin, agregar 23:59:59 para incluir todo el día
    const date = new Date(filters.dateTo + 'T23:59:59.999')
    apiFilters.dateTo = date.toISOString()
  }
  return apiFilters
}

/**
 * Obtiene lista paginada de movimientos
 */
export async function getMovements(filters: {
  type?: string
  status?: string
  materialId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  size?: number
} = {}) {
  const apiFilters = mapFiltersToAPI(filters)
  
  // Convertir filtros a parámetros de URL
  const urlParams: Record<string, string> = {}
  
  if (apiFilters.page !== undefined) urlParams.page = apiFilters.page.toString()
  if (apiFilters.size !== undefined) urlParams.size = apiFilters.size.toString()
  if (apiFilters.type) urlParams.type = apiFilters.type
  if (apiFilters.status) urlParams.status = apiFilters.status
  if (apiFilters.materialId) urlParams.materialId = apiFilters.materialId
  // El backend espera startDate y endDate para las fechas
  if (apiFilters.dateFrom) urlParams.startDate = apiFilters.dateFrom
  if (apiFilters.dateTo) urlParams.endDate = apiFilters.dateTo
  
  const response = await api.get<MovementsPageResponse>('/api/movements', urlParams)

  return {
    movements: response.content,
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
 * Obtiene un movimiento por ID
 */
export async function getMovementById(id: string) {
  const movement = await api.get<MovementResponse>(`/api/movements/${id}`)
  return movement
}

/**
 * Crea un nuevo movimiento
 */
export async function createMovement(data: MovementCreateRequest) {
  const movement = await api.post<MovementResponse>('/api/movements', data)
  return movement
}

/**
 * Obtiene un movimiento detallado por ID
 */
export async function getMovementDetailById(id: string) {
  const movement = await api.get<MovementDetailResponse>(`/api/movements/${id}`)
  return movement
}

/**
 * Marca un movimiento como "En proceso" o lo revierte a "Pendiente" (toggle)
 */
export async function toggleMovementInProgress(id: string) {
  const movement = await api.patch<MovementResponse>(`/api/movements/${id}/in-progress`)
  return movement
}

/**
 * Completa un movimiento pendiente o en proceso
 */
export async function completeMovement(id: string) {
  const movement = await api.patch<MovementResponse>(`/api/movements/${id}/complete`)
  return movement
}

/**
 * Obtiene el label en español para un tipo de movimiento
 */
export function getTypeLabel(type: MovementType): string {
  return TYPE_LABELS[type]
}

/**
 * Obtiene el label en español para un estado de movimiento
 */
export function getStatusLabel(status: MovementStatus): string {
  return STATUS_LABELS[status]
}

