/**
 * API específica para packaging
 * Funciones para interactuar con el backend de packaging
 */

import { api } from '../fetcher'
import type { PackagingResponse, 
    PackagingCreateRequest, 
    PackagingUpdateRequest, 
    PackagingPageResponse,
    UnitMeasurement } from '@/types'


const UNIT_LABELS: Record<UnitMeasurement, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidad'
}

/**
 * Obtiene lista paginada de packagings
 * 
 * @param {Object} filters - Filtros de búsqueda y paginación
 * @param {number} [filters.page=0] - Número de página (base 0)
 * @param {number} [filters.size=10] - Cantidad de elementos por página
 * @param {string} [filters.name] - Filtro por nombre de packaging
 * @param {UnitMeasurement} [filters.unitMeasurement] - Filtro por unidad de medida
 * @param {boolean} [filters.isActive] - Filtro por estado activo
 * 
 * @returns {Promise<Object>} Objeto con packagings y paginación
 * @returns {PackagingResponse[]} .packagings - Lista de packagings
 * @returns {Object} .pagination - Información de paginación
 * 
 * @throws {ApiError} Si la petición falla
 * 
 * @example
 * // Obtener primera página
 * const { packagings, pagination } = await getPackagings({ page: 0, size: 10 })
 * 
 * @example
 * // Filtrar por nombre
 * const result = await getPackagings({ name: 'Lata', isActive: true })
 */
export async function getPackagings(filters: {
    page?: number
    size?: number
    name?: string
    unitMeasurement?: UnitMeasurement
    isActive?: boolean
} = {}) {
    const urlParams: Record<string, string> = {}
    if (filters.page !== undefined) urlParams.page = filters.page.toString()
    if (filters.size !== undefined) urlParams.size = filters.size.toString()
    const response = await api.get<PackagingPageResponse>('/api/packagings', urlParams)
    return {
        packagings: response.content,
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
 * Obtiene packaging por ID
 * 
 * @param {string} id - ID del packaging
 * @returns {Promise<PackagingResponse>} Datos del packaging
 * 
 * @throws {ApiError} Si el packaging no existe o la petición falla
 * 
 * @example
 * const packaging = await getPackagingById('123')
 * console.log(packaging.name, packaging.unitMeasurement)
 */
export async function getPackagingById(id: string) {
    const response = await api.get<PackagingResponse>(`/api/packagings/${id}`)
    return response
}

/**
 * Crea un nuevo packaging
 * 
 * @param {PackagingCreateRequest} data - Datos del packaging a crear
 * @param {string} data.name - Nombre del packaging
 * @param {UnitMeasurement} data.unitMeasurement - Unidad de medida (KG, LT, UNIDAD)
 * @param {number} data.quantity - Cantidad/capacidad del packaging
 * @param {boolean} [data.isActive=true] - Estado activo del packaging
 * 
 * @returns {Promise<PackagingResponse>} Packaging creado
 * 
 * @throws {ApiError} Si la validación falla o la petición falla
 * 
 * @example
 * const newPackaging = await createPackaging({
 *   name: 'Lata 500ml',
 *   unitMeasurement: 'LT',
 *   quantity: 0.5,
 *   isActive: true
 * })
 */
export async function createPackaging(data: PackagingCreateRequest) {
    const response = await api.post<PackagingResponse>('/api/packagings', data)
    return response
}

/**
 * Actualiza un packaging existente
 * 
 * @param {string} id - ID del packaging a actualizar
 * @param {PackagingUpdateRequest} data - Datos a actualizar
 * @param {string} [data.name] - Nuevo nombre
 * @param {UnitMeasurement} [data.unitMeasurement] - Nueva unidad de medida
 * @param {number} [data.quantity] - Nueva cantidad
 * 
 * @returns {Promise<PackagingResponse>} Packaging actualizado
 * 
 * @throws {ApiError} Si el packaging no existe o la validación falla
 * 
 * @example
 * const updated = await updatePackaging('123', {
 *   name: 'Lata 500ml Premium',
 *   quantity: 0.5
 * })
 */
export async function updatePackaging(id: string, data: PackagingUpdateRequest) {
    const response = await api.patch<PackagingResponse>(`/api/packagings/${id}`, data)
    return response
}

/**
 * Activa o desactiva un packaging
 * 
 * @param {string} id - ID del packaging
 * @returns {Promise<PackagingResponse>} Packaging con estado actualizado
 * 
 * @throws {ApiError} Si el packaging no existe o la petición falla
 * 
 * @example
 * // Cambiar estado activo/inactivo
 * const toggled = await togglePackagingActive('123')
 * console.log('Nuevo estado:', toggled.isActive ? 'Activo' : 'Inactivo')
 */
export async function togglePackagingActive(id: string) {
    const response = await api.patch<PackagingResponse>(`/api/packagings/${id}/toggle-active`)
    return response
}

/**
 * Obtiene las opciones de unidades de medida disponibles
 * 
 * @returns {Array<Object>} Lista de unidades de medida con valor y etiqueta
 * @returns {UnitMeasurement} [].value - Valor de la unidad (KG, LT, UNIDAD)
 * @returns {string} [].label - Etiqueta en español
 * 
 * @example
 * const units = getUnitMeasurements()
 * // [{ value: 'KG', label: 'Kilogramos' }, ...]
 */
export function getUnitMeasurements() {
    return [
      { value: 'KG', label: 'Kilogramos' },
      { value: 'LT', label: 'Litros' },
      { value: 'UNIDAD', label: 'Unidad' }
    ]
  }

/**
 * Obtiene el label en español para una unidad de medida
 * 
 * @param {UnitMeasurement} unit - Unidad de medida (KG, LT, UNIDAD)
 * @returns {string} Etiqueta en español de la unidad
 * 
 * @example
 * const label = getUnitLabel('KG') // 'kg'
 * const label2 = getUnitLabel('LT') // 'L'
 */
export function getUnitLabel(unit: UnitMeasurement): string {
    return UNIT_LABELS[unit]
}

/**
 * Obtiene lista simplificada de packagings (ID y nombre)
 * Útil para listas desplegables y autocompletado
 * 
 * @param {Object} [params] - Parámetros de filtrado
 * @param {string} [params.name] - Filtro por nombre
 * @param {boolean} [params.active] - Filtro por estado activo
 * @param {string} [params.productId] - Filtro por producto asociado
 * 
 * @returns {Promise<Array<Object>>} Lista simplificada de packagings
 * @returns {number} [].id - ID del packaging
 * @returns {string} [].name - Nombre del packaging
 * @returns {string} [].productId - ID del producto asociado
 * 
 * @throws {ApiError} Si la petición falla
 * 
 * @example
 * // Obtener todos los packagings activos
 * const list = await getPackagingsIdNameList({ active: true })
 * 
 * @example
 * // Buscar packagings por nombre
 * const filtered = await getPackagingsIdNameList({ name: 'Lata' })
 */
export async function getPackagingsIdNameList(params?: {
    name?: string
    active?: boolean
    productId?: string
}) {
    const urlParams: Record<string, string> = {}
    if (params?.name) urlParams.name = params.name
    if (params?.active !== undefined) urlParams.active = params.active.toString()
    if (params?.productId) urlParams.productId = params.productId
    const packagings = await api.get<{ id: number; name: string; productId: string }[]>('/api/packagings/id-name-list', urlParams)
    return packagings
}
