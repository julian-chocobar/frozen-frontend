/**
 * API específica para parámetros de calidad
 * Funciones para interactuar con el backend de quality parameters
 */

import { api } from '../fetcher'
import type { 
  QualityParameterResponse,
  QualityParameterCreateRequest,
  QualityParameterUpdateRequest,
  Phase
} from '@/types'

/**
 * Obtiene todos los parámetros de calidad
 */
export async function getQualityParameters(): Promise<QualityParameterResponse[]> {
  const parameters = await api.get<QualityParameterResponse[]>('/api/quality-parameters')
  return parameters
}

/**
 * Obtiene parámetros de calidad activos
 * Opcionalmente filtrados por fase
 */
export async function getActiveQualityParameters(phase?: Phase): Promise<QualityParameterResponse[]> {
  const params: Record<string, string> = {}
  if (phase) {
    params.phase = phase
  }
  const parameters = await api.get<QualityParameterResponse[]>('/api/quality-parameters/active', params)
  return parameters
}

/**
 * Obtiene un parámetro de calidad por ID
 */
export async function getQualityParameterById(id: number): Promise<QualityParameterResponse> {
  const parameter = await api.get<QualityParameterResponse>(`/api/quality-parameters/${id}`)
  return parameter
}

/**
 * Crea un nuevo parámetro de calidad
 */
export async function createQualityParameter(data: QualityParameterCreateRequest): Promise<QualityParameterResponse> {
  const parameter = await api.post<QualityParameterResponse>('/api/quality-parameters', data)
  return parameter
}

/**
 * Actualiza un parámetro de calidad existente
 */
export async function updateQualityParameter(id: number, data: QualityParameterUpdateRequest): Promise<QualityParameterResponse> {
  const parameter = await api.patch<QualityParameterResponse>(`/api/quality-parameters/${id}`, data)
  return parameter
}

/**
 * Cambia el estado activo de un parámetro de calidad
 */
export async function toggleQualityParameterActive(id: number): Promise<QualityParameterResponse> {
  const parameter = await api.patch<QualityParameterResponse>(`/api/quality-parameters/${id}/toggle-active`)
  return parameter
}
