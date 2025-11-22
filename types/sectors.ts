/**
 * Tipos relacionados con sectores
 */

import type { Phase } from './phases'

// ============================================
// SECTORS
// ============================================

export type SectorType = "PRODUCCION" | "CALIDAD" | "ALMACEN"

// SectorResponseDTO - coincide exactamente con el DTO del backend
export interface SectorResponse {
  id?: number
  name: string
  supervisorId: number
  type: SectorType
  phase: Phase | null
  productionCapacity: number | null
  isTimeActive: boolean | null
}

// Respuesta paginada de sectores
export interface SectorsPageResponse {
  content: SectorResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// SectorCreateDTO - coincide exactamente con el DTO del backend
export interface SectorCreateRequest {
  name: string
  supervisorId: number
  type: SectorType
  phase?: Phase | null
  productionCapacity?: number | null
  isTimeActive?: boolean | null
}

// SectorUpdateDTO - coincide exactamente con el DTO del backend
export interface SectorUpdateRequest {
  name?: string
  supervisorId?: number
  type?: SectorType
  phase?: Phase | null
  productionCapacity?: number | null
  isTimeActive?: boolean | null
}
