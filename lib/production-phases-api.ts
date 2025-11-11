import { api } from './fetcher'
import type { 
  ProductionPhaseResponse, 
  ProductionPhaseUnderReviewRequest,
  ProductionPhaseQualityResponse,
  ProductionPhaseQualityCreateRequest,
  ProductionPhaseQualityUpdateRequest
} from '@/types'

// ============================================
// PRODUCTION PHASES
// ============================================

/**
 * Obtener fase de producción por ID
 */
export async function getProductionPhaseById(id: string) {
  const response = await api.get<ProductionPhaseResponse>(`/api/production-phases/${id}`)
  return response
}

/**
 * Listar fases por lote
 */
export async function getProductionPhasesByBatch(batchId: string) {
  const response = await api.get<ProductionPhaseResponse[]>(`/api/production-phases/by-batch/${batchId}`)
  return response
}

/**
 * Marcar fase bajo revisión (enviar métricas de entrada y salida)
 */
export async function setPhaseUnderReview(id: string, data: ProductionPhaseUnderReviewRequest) {
  const response = await api.patch<ProductionPhaseResponse>(`/api/production-phases/set-under-review/${id}`, data)
  return response
}

/**
 * Revisar fase (calidad) - solo supervisor de calidad
 */
export async function reviewPhase(id: string) {
  const response = await api.patch<ProductionPhaseResponse>(`/api/production-phases/review/${id}`)
  return response
}

// ============================================
// PRODUCTION PHASE QUALITY
// ============================================

/**
 * Crear medición de calidad
 */
export async function createPhaseQuality(data: ProductionPhaseQualityCreateRequest) {
  const response = await api.post<ProductionPhaseQualityResponse>('/api/production-phases-qualities', data)
  return response
}

/**
 * Modificar medición de calidad
 */
export async function updatePhaseQuality(id: string, data: ProductionPhaseQualityUpdateRequest) {
  const response = await api.patch<ProductionPhaseQualityResponse>(`/api/production-phases-qualities/${id}`, data)
  return response
}

/**
 * Obtener medición de calidad por ID
 */
export async function getPhaseQualityById(id: string) {
  const response = await api.get<ProductionPhaseQualityResponse>(`/api/production-phases-qualities/${id}`)
  return response
}

/**
 * Listar mediciones por fase
 */
export async function getPhaseQualitiesByPhase(phaseId: string) {
  const response = await api.get<ProductionPhaseQualityResponse[]>(`/api/production-phases-qualities/by-phase/${phaseId}`)
  return response
}

/**
 * Listar mediciones por lote
 */
export async function getPhaseQualitiesByBatch(batchId: string) {
  const response = await api.get<ProductionPhaseQualityResponse[]>(`/api/production-phases-qualities/by-batch/${batchId}`)
  return response
}