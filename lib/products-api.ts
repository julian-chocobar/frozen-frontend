import { api } from './fetcher'
import type { 
    ProductResponse, 
    ProductCreateRequest, 
    ProductUpdateRequest, 
    ProductPageResponse, 
    ProductsFilters } from '@/types'


function mapFiltersToAPI(filters: {
    page?: number
    size?: number
    name?: string
    estado?: string
    alcoholic?: string
    ready?: string
}): ProductsFilters {
    const apiFilters: ProductsFilters = {
        page: filters.page || 0,
        size: filters.size || 10
    }
    if (filters.estado && filters.estado !== 'Todos') {
        apiFilters.isActive = filters.estado === 'Activo'
    }
    if (filters.alcoholic && filters.alcoholic !== 'Todos') {
        apiFilters.isAlcoholic = filters.alcoholic === 'Alcoholico'
    }
    if (filters.ready && filters.ready !== 'Todos') {
        apiFilters.isReady = filters.ready === 'Listo'
    }
    if (filters.name) {
        apiFilters.name = filters.name
    }
    return apiFilters
}

export async function getProducts(filters: {
    page?: number
    size?: number
    name?: string
    estado?: string
    alcoholic?: string
    ready?: string
} = {}) {
    const apiFilters = mapFiltersToAPI(filters)
    const urlParams: Record<string, string> = {}
    if (apiFilters.page !== undefined) urlParams.page = apiFilters.page.toString()
    if (apiFilters.size !== undefined) urlParams.size = apiFilters.size.toString()
    if (apiFilters.name) urlParams.name = apiFilters.name
    if (apiFilters.isActive !== undefined) urlParams.isActive = apiFilters.isActive.toString()
    if (apiFilters.isAlcoholic !== undefined) urlParams.isAlcoholic = apiFilters.isAlcoholic.toString()
    if (apiFilters.isReady !== undefined) urlParams.isReady = apiFilters.isReady.toString()
    const response = await api.get<ProductPageResponse>('/api/products', urlParams)
    return {
        products: response.content,
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

export async function getProductById(id: string) {
    const product = await api.get<ProductResponse>(`/api/products/${id}`)
    return product
}

export async function createProduct(data: ProductCreateRequest) {
    const product = await api.post<ProductResponse>('/api/products', data)
    return product
}

export async function updateProduct(id: string, data: ProductUpdateRequest) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}`, data)
    return product
}

export async function toggleProductActive(id: string) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}/toggle-active`)
    return product
}

export async function toogleReady(id: string) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}/toogle-ready`)
    return product
}

export async function getProductsIdNameList( params?: {
    name?: string
    active?: boolean
    ready?: boolean
}) {
    const urlParams: Record<string, string> = {}
    if (params?.name) urlParams.name = params.name
    if (params?.active !== undefined) urlParams.active = params.active.toString()
    if (params?.ready !== undefined) urlParams.ready = params.ready.toString()
    const products = await api.get<{ id: string; name: string }[]>('/api/products/id-name-list', urlParams)
    return products
}