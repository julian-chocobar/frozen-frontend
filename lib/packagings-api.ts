/**
 * API específica para packaging
 * Funciones para interactuar con el backend de packaging
 */

import { api } from './fetcher'
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
 */
export async function getPackagingById(id: string) {
    const response = await api.get<PackagingResponse>(`/api/packagings/${id}`)
    return response
}

/**
 * Crea un nuevo packaging
 */
export async function createPackaging(data: PackagingCreateRequest) {
    const response = await api.post<PackagingResponse>('/api/packagings', data)
    return response
}

/**
 * Actualiza un packaging
 */
export async function updatePackaging(id: string, data: PackagingUpdateRequest) {
    const response = await api.patch<PackagingResponse>(`/api/packagings/${id}`, data)
    return response
}

/**
 * Activa/desactiva un packaging
 */
export async function togglePackagingActive(id: string) {
    const response = await api.patch<PackagingResponse>(`/api/packagings/${id}/toggle-active`)
    return response
}

/**
 * Obtiene las opciones de unidades de medida
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
 */
export function getUnitLabel(unit: UnitMeasurement): string {
    return UNIT_LABELS[unit]
}

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
