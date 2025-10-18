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
} from '@/types'

const TYPE_LABELS: Record<MovementType, string> = {
  'INGRESO': 'Ingreso',
  'EGRESO': 'Egreso'
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
  if (apiFilters.materialId) urlParams.materialId = apiFilters.materialId
  // El backend espera startDate y endDate para las fechas
  if (apiFilters.dateFrom) urlParams.startDate = apiFilters.dateFrom
  if (apiFilters.dateTo) urlParams.endDate = apiFilters.dateTo
  
  console.log('Parámetros enviados al backend:', urlParams)
  const response = await api.get<MovementsPageResponse>('/api/movements', urlParams)
  console.log('Respuesta del backend:', response.content.map(m => ({
    id: m.id,
    date: m.realizationDate,
    type: m.type
  })))

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
 * Obtiene el label en español para un tipo de movimiento
 */
export function getTypeLabel(type: MovementType): string {
  return TYPE_LABELS[type]
}

