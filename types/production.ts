/**
 * Tipos relacionados con fases de producción activas
 */

import type { Phase } from './phases'

// ============================================
// PRODUCTION PHASES
// ============================================

export type ProductionPhaseStatus = 
  | "PENDIENTE" 
  | "EN_PROCESO" 
  | "BAJO_REVISION" 
  | "SIENDO_AJUSTADA" 
  | "RECHAZADA" 
  | "SUSPENDIDA" 
  | "COMPLETADA"

export interface ProductionPhaseResponse {
  id: number
  sectorId: number
  batchId: number
  batchCode: string
  status: ProductionPhaseStatus
  phase: Phase
  input: number | null
  standardInput: number
  output: number | null
  standardOutput: number
  outputUnit: string
  startDate: string | null
  endDate: string | null
}

export interface ProductionPhaseUnderReviewRequest {
  input: number
  output: number
}
