/**
 * Tipos relacionados con control de calidad
 */

import type { Phase, EtapaProduccion } from './phases'

// ============================================
// PRODUCTION PHASE QUALITY
// ============================================

export interface ProductionPhaseQualityResponse {
  id: number
  qualityParameterName: string
  productionPhaseId: number
  productionPhase: Phase
  value: string
  unit: string
  isApproved: boolean
  realizationDate: string
  version: number
  isActive: boolean
}

export interface QualityParameterSimple {
  id: number
  name: string
  phase: Phase
  unit?: string | null
  description?: string
  isCritical?: boolean
  information?: string | null
}

export interface ProductionPhaseQualityCreateRequest {
  qualityParameterId: number
  productionPhaseId: number
  value: string
  isApproved?: boolean
}

export interface ProductionPhaseQualityUpdateRequest {
  value?: string
  isApproved?: boolean
}

// ============================================
// CONTROL DE CALIDAD
// ============================================

export interface RegistroCalidad {
  id: string
  loteId: string
  fecha: string
  etapa: EtapaProduccion
  temperatura?: number
  ph?: number
  densidad?: number
  observaciones: string
  aprobado: boolean
  inspector: string
}

export interface RegistroDesperdicio {
  id: string
  loteId: string
  fecha: string
  etapa: EtapaProduccion
  cantidad: number
  unidad: string
  motivo: string
  registradoPor: string
}

// ============================================
// QUALITY PARAMETERS
// ============================================

// QualityParameterResponseDTO - coincide exactamente con el DTO del backend
export interface QualityParameterResponse {
  id: number
  phase: Phase
  isCritical: boolean
  name: string
  description: string | null
  unit: string | null
  information: string | null
  isActive: boolean
}

// QualityParameterCreateDTO - coincide exactamente con el DTO del backend
export interface QualityParameterCreateRequest {
  phase: Phase
  isCritical: boolean
  name: string
  description?: string | null
  unit?: string | null
  information?: string | null
}

// QualityParameterUpdateDTO - coincide exactamente con el DTO del backend
export interface QualityParameterUpdateRequest {
  description?: string | null
  unit?: string | null
  information?: string | null
}
