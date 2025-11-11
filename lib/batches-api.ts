import { api } from './fetcher'
import type { BatchFilters, BatchPageResponse, BatchResponse, BatchStatus } from '@/types'


function mapStatusToAPI(status: BatchStatus): string {
    switch (status) {
        case 'Pendiente':
            return 'PENDIENTE'
        case 'En Producción':
            return 'EN_PRODUCCION'
        case 'En Espera':
            return 'EN_ESPERA'
        case 'Completado':
            return 'COMPLETO'  
        case 'Cancelado':
            return 'CANCELADO'
    }
}
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

export async function getBatchById(id: string) {
    const response = await api.get<BatchResponse>(`/api/batches/${id}`)
    return response
}

/**
 * Forzar el inicio de producción de lotes programados para hoy
 * Solo para GERENTE_DE_PLANTA
 */
export async function processBatchesToday() {
    await api.post('/api/batches/process-today')
}