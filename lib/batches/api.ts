/**
 * API de lotes (batches)
 * Funciones para interactuar con el backend de lotes de producción
 */

import { api } from '../fetcher'
import type { BatchFilters, BatchPageResponse, BatchResponse, BatchStatus } from '@/types'

/**
 * Mapea estado de UI a formato de API
 * @param status - Estado desde la interfaz de usuario
 * @returns Estado formateado para la API
 * @internal
 */
function mapStatusToAPI(status: BatchStatus): string {
    switch (status) {
        case 'PENDIENTE':
            return 'PENDIENTE'
        case 'EN_PRODUCCION':
            return 'EN_PRODUCCION'
        case 'EN_ESPERA':
            return 'EN_ESPERA'
        case 'COMPLETADO':
            return 'COMPLETADO'  
        case 'CANCELADO':
            return 'CANCELADO'  
    }
}

/**
 * Mapea filtros de UI a formato esperado por la API
 * @param filters - Filtros desde la interfaz de usuario
 * @returns Filtros formateados para la API
 * @internal
 */
function mapFiltersToAPI(filters: {
    page?: number
    size?: number
    status?: BatchStatus
    productId?: string
}): BatchFilters {
    const apiFilters: BatchFilters = {
        page: filters.page || 0,
        size: filters.size || 10
    }
    if (filters.status) {
        apiFilters.status = filters.status
    }
    if (filters.productId) {
        apiFilters.productId = filters.productId
    }
    return apiFilters
}

/**
 * Obtiene lista paginada de lotes con filtros opcionales
 * @param filters - Objeto con filtros de búsqueda
 * @param filters.page - Número de página (0-indexed)
 * @param filters.size - Cantidad de elementos por página
 * @param filters.status - Filtro por estado del lote
 * @param filters.productId - Filtro por ID de producto
 * @returns Objeto con lotes y datos de paginación
 * @throws {Error} Si falla la petición al backend
 * @example
 * const data = await getBatches({ page: 0, size: 12, status: 'EN_PRODUCCION' })
 * console.log(data.batches) // Array de lotes
 * console.log(data.pagination.totalPages) // 5
 */

export async function getBatches(filters: {
    page?: number
    size?: number
    status?: BatchStatus
    productId?: string
} = {}) {
    const apiFilters = mapFiltersToAPI(filters)
    const urlParams: Record<string, string> = {}
    if (apiFilters.page !== undefined) urlParams.page = apiFilters.page.toString()
    if (apiFilters.size !== undefined) urlParams.size = apiFilters.size.toString()
    if (apiFilters.status) urlParams.status = apiFilters.status
    if (apiFilters.productId) urlParams.productId = apiFilters.productId
    const response = await api.get<BatchPageResponse>(`/api/batches`, urlParams)
    return {
        batches: response.content,
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
 * Obtiene un lote por su ID
 * @param id - ID del lote
 * @returns Datos completos del lote con sus fases
 * @throws {Error} Si el lote no existe o falla la petición
 * @example
 * const batch = await getBatchById('123')
 * console.log(batch.batchCode) // 'LOTE-001'
 * console.log(batch.phases.length) // 5
 */
export async function getBatchById(id: string) {
    const response = await api.get<BatchResponse>(`/api/batches/${id}`)
    return response
}

/**
 * Forzar el inicio de producción de lotes programados para hoy
 * Solo para usuarios con rol GERENTE_DE_PLANTA
 * @throws {Error} Si falla la petición o no tiene permisos
 * @example
 * await processBatchesToday()
 * console.log('Lotes de hoy procesados')
 */
export async function processBatchesToday() {
    await api.post('/api/batches/process-today')
}

/**
 * Obtener reporte PDF de trazabilidad del lote
 * Genera un documento con toda la información de trazabilidad
 * @param id - ID del lote
 * @returns Blob del archivo PDF
 * @throws {Error} Si el lote no existe o falla la generación
 * @example
 * const blob = await getBatchTraceabilityPdf('123')
 * const url = window.URL.createObjectURL(blob)
 * // Descargar o mostrar el PDF
 */
export async function getBatchTraceabilityPdf(id: string): Promise<Blob> {
    const response = await fetch(`/api/batches/${id}/traceability-pdf`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error(`Error al obtener el PDF: ${response.statusText}`)
    }

    return await response.blob()
}

/**
 * Cancelar un lote
 * Solo se pueden cancelar lotes que no estén completados o ya cancelados
 * @param id - ID del lote a cancelar
 * @returns Lote actualizado con estado CANCELADO
 * @throws {Error} Si el lote no se puede cancelar o falla la petición
 * @example
 * const cancelledBatch = await cancelBatch('123')
 * console.log(cancelledBatch.status) // 'CANCELADO'
 */
export async function cancelBatch(id: string) {
    const response = await api.patch<BatchResponse>(`/api/batches/cancel-batch/${id}`)
    return response
}