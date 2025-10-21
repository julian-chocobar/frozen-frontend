import { api } from './fetcher'
import type { 
    ProductionOrderCreateRequest, 
    ProductionOrderFilters, 
    ProductionOrderPageResponse, 
    ProductionOrderResponse, 
    ProductionOrderStatus } from '@/types'



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

export async function getProductionOrderById(id: string): Promise<ProductionOrderResponse> {
    const response = await api.get<ProductionOrderResponse>(`/api/production-orders/${id}`)
    return response
}


export async function createProductionOrder(data: ProductionOrderCreateRequest) {
    const response = await api.post<ProductionOrderResponse>('/api/production-orders', data)
    return response
}

export async function rejectProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/reject`)
    return response
}

export async function approveProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/approve`)
    return response
}

export async function cancelProductionOrder(id: string) {
    const response = await api.patch<ProductionOrderResponse>(`/api/production-orders/${id}/cancel`)
    return response
}
