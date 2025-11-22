/**
 * API de órdenes de producción
 * Maneja todas las operaciones CRUD de órdenes de producción
 */

import { api } from '../fetcher'
import type { 
    ProductionOrderCreateRequest, 
    ProductionOrderFilters, 
    ProductionOrderPageResponse, 
    ProductionOrderResponse, 
    ProductionOrderStatus 
} from '@/types'

/**
 * Mapea filtros del cliente a formato de API
 * @param filters - Filtros de búsqueda
 * @returns Filtros formateados para la API
 * @internal
 */
function mapFiltersToAPI(filters: {
    page?: number
    size?: number
    status?: ProductionOrderStatus
    productId?: string
}): ProductionOrderFilters {
    const apiFilters: ProductionOrderFilters = {
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
 * Obtiene el listado paginado de órdenes de producción
 * 
 * @param filters - Filtros opcionales de búsqueda
 * @param filters.page - Número de página (base 0)
 * @param filters.size - Cantidad de elementos por página
 * @param filters.status - Filtrar por estado de orden
 * @param filters.productId - Filtrar por ID de producto
 * @returns Promise con array de órdenes y datos de paginación
 * @throws {Error} Si falla la petición al backend
 * 
 * @example
 * ```ts
 * const data = await getProductionOrders({ page: 0, status: 'PENDIENTE' })
 * console.log(data.productionOrders) // Array de órdenes
 * console.log(data.pagination) // Datos de paginación
 * ```
 */
export async function getProductionOrders(filters: {
    page?: number
    size?: number
    status?: ProductionOrderStatus
    productId?: string
} = {}) {
    const apiFilters = mapFiltersToAPI(filters)
    const urlParams: Record<string, string> = {}
    
    if (apiFilters.page !== undefined) urlParams.page = apiFilters.page.toString()
    if (apiFilters.size !== undefined) urlParams.size = apiFilters.size.toString()
    if (apiFilters.status) urlParams.status = apiFilters.status
    if (apiFilters.productId) urlParams.productId = apiFilters.productId
    
    const response = await api.get<ProductionOrderPageResponse>('/api/production-orders', urlParams)
    
    return {
        productionOrders: response.content,
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
 * Obtiene una orden de producción por su ID
 * 
 * @param id - ID de la orden de producción
 * @returns Promise con los datos de la orden
 * @throws {Error} Si la orden no existe o falla la petición
 * 
 * @example
 * ```ts
 * const order = await getProductionOrderById('123')
 * console.log(order.productName)
 * ```
 */
export async function getProductionOrderById(id: string): Promise<ProductionOrderResponse> {
    const response = await api.get<ProductionOrderResponse>(`/api/production-orders/${id}`)
    return response
}

/**
 * Crea una nueva orden de producción
 * 
 * @param data - Datos de la nueva orden
 * @param data.productId - ID del producto a producir
 * @param data.packagingId - ID del empaque a utilizar
 * @param data.quantity - Cantidad a producir
 * @param data.plannedDate - Fecha planificada en formato ISO
 * @returns Promise con la orden creada
 * @throws {Error} Si los datos son inválidos o falla la creación
 * 
 * @example
 * ```ts
 * const order = await createProductionOrder({
 *   productId: 1,
 *   packagingId: 2,
 *   quantity: 500,
 *   plannedDate: '2025-12-01T00:00:00-03:00'
 * })
 * ```
 */
export async function createProductionOrder(data: ProductionOrderCreateRequest) {
    const response = await api.post<ProductionOrderResponse>('/api/production-orders', data)
    return response
}

/**
 * Rechaza una orden de producción pendiente
 * 
 * @param id - ID de la orden a rechazar
 * @returns Promise con la orden actualizada
 * @throws {Error} Si la orden no puede ser rechazada
 * 
 * @example
 * ```ts
 * await rejectProductionOrder('123')
 * ```
 */
export async function rejectProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/reject`)
    return response
}

/**
 * Aprueba una orden de producción pendiente
 * 
 * @param id - ID de la orden a aprobar
 * @returns Promise con la orden actualizada
 * @throws {Error} Si la orden no puede ser aprobada
 * 
 * @example
 * ```ts
 * await approveProductionOrder('123')
 * ```
 */
export async function approveProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/approve`)
    return response
}

/**
 * Cancela una orden de producción
 * 
 * @param id - ID de la orden a cancelar
 * @returns Promise con la orden actualizada
 * @throws {Error} Si la orden no puede ser cancelada
 * 
 * @example
 * ```ts
 * await cancelProductionOrder('123')
 * ```
 */
export async function cancelProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/cancel`)
    return response
}
