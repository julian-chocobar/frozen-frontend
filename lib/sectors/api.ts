/**
 * API específica para sectores
 * Funciones para interactuar con el backend de sectores
 */

import { api } from '../fetcher'
import type { 
  SectorResponse,
  SectorCreateRequest,
  SectorUpdateRequest,
  SectorsPageResponse
} from '@/types'

/**
 * Obtiene lista paginada de sectores
 */
export async function getAllSectors(page: number = 0, size: number = 100) {
  const urlParams: Record<string, string> = {
    page: page.toString(),
    size: size.toString()
  }
  
  const response = await api.get<SectorsPageResponse>('/api/sectors', urlParams)
  
  return {
    sectors: response.content,
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
 * Obtiene un sector por ID
 */
export async function getSectorById(id: number): Promise<SectorResponse> {
  const sector = await api.get<SectorResponse>(`/api/sectors/${id}`)
  return sector
}

/**
 * Crea un nuevo sector
 */
export async function createSector(data: SectorCreateRequest): Promise<SectorResponse> {
  const sector = await api.post<SectorResponse>('/api/sectors', data)
  return sector
}

/**
 * Actualiza un sector existente
 */
export async function updateSector(id: number, data: SectorUpdateRequest): Promise<SectorResponse> {
  const sector = await api.patch<SectorResponse>(`/api/sectors/${id}`, data)
  return sector
}

