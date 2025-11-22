/**
 * API de productos
 * Funciones para interactuar con el backend de productos
 */

import { api } from '../fetcher'
import type { 
    ProductResponse, 
    ProductCreateRequest, 
    ProductUpdateRequest, 
    ProductPageResponse, 
    ProductsFilters } from '@/types'

/**
 * Mapea filtros de UI a formato esperado por la API
 * @param filters - Filtros desde la interfaz de usuario
 * @returns Filtros formateados para la API
 * @internal
 */
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

/**
 * Obtiene lista paginada de productos con filtros opcionales
 * @param filters - Objeto con filtros de búsqueda
 * @param filters.page - Número de página (0-indexed)
 * @param filters.size - Cantidad de elementos por página
 * @param filters.name - Filtro por nombre (búsqueda parcial)
 * @param filters.estado - Filtro por estado ('Activo', 'Inactivo', 'Todos')
 * @param filters.alcoholic - Filtro por tipo alcohólico ('Alcoholico', 'No Alcoholico', 'Todos')
 * @param filters.ready - Filtro por estado listo ('Listo', 'No Listo', 'Todos')
 * @returns Objeto con productos y datos de paginación
 * @throws {Error} Si falla la petición al backend
 * @example
 * const data = await getProducts({ page: 0, size: 10, estado: 'Activo' })
 * console.log(data.products) // Array de productos
 * console.log(data.pagination.totalPages) // 5
 */
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

/**
 * Obtiene un producto por su ID
 * @param id - ID del producto
 * @returns Datos completos del producto
 * @throws {Error} Si el producto no existe o falla la petición
 * @example
 * const product = await getProductById('123')
 * console.log(product.name) // 'IPA Americana'
 */
export async function getProductById(id: string) {
    const product = await api.get<ProductResponse>(`/api/products/${id}`)
    return product
}

/**
 * Crea un nuevo producto
 * @param data - Datos del producto a crear
 * @returns Producto creado con ID asignado
 * @throws {Error} Si los datos son inválidos o falla la petición
 * @example
 * const newProduct = await createProduct({
 *   name: 'Cerveza IPA',
 *   standardQuantity: 500,
 *   unitMeasurement: 'LT',
 *   isAlcoholic: true
 * })
 */
export async function createProduct(data: ProductCreateRequest) {
    const product = await api.post<ProductResponse>('/api/products', data)
    return product
}

/**
 * Actualiza un producto existente
 * @param id - ID del producto a actualizar
 * @param data - Datos a actualizar (parcial)
 * @returns Producto actualizado
 * @throws {Error} Si el producto no existe o falla la petición
 * @example
 * const updated = await updateProduct('123', {
 *   name: 'Cerveza IPA Premium',
 *   standardQuantity: 750
 * })
 */
export async function updateProduct(id: string, data: ProductUpdateRequest) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}`, data)
    return product
}

/**
 * Alterna el estado activo/inactivo de un producto
 * @param id - ID del producto
 * @returns Producto con estado actualizado
 * @throws {Error} Si el producto no existe o falla la petición
 * @example
 * const product = await toggleProductActive('123')
 * console.log(product.isActive) // true o false
 */
export async function toggleProductActive(id: string) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}/toggle-active`)
    return product
}

/**
 * Alterna el estado listo/no listo de un producto
 * @param id - ID del producto
 * @returns Producto con estado actualizado
 * @throws {Error} Si el producto no existe o falla la petición
 * @example
 * const product = await toogleReady('123')
 * console.log(product.isReady) // true o false
 */
export async function toogleReady(id: string) {
    const product = await api.patch<ProductResponse>(`/api/products/${id}/toogle-ready`)
    return product
}

/**
 * Obtiene lista simplificada de productos (solo ID y nombre)
 * Útil para dropdowns y selects
 * @param params - Parámetros opcionales de filtrado
 * @param params.name - Filtro por nombre
 * @param params.active - Filtro por estado activo
 * @param params.ready - Filtro por estado listo
 * @returns Array de objetos con id y name
 * @throws {Error} Si falla la petición
 * @example
 * const list = await getProductsIdNameList({ active: true })
 * // [{ id: '1', name: 'IPA' }, { id: '2', name: 'Lager' }]
 */
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