/**
 * Tipos relacionados con fases de producción
 */

import type { UnitMeasurement } from './common'

// ============================================
// PHASES
// ============================================
export type Phase = 
  | "MOLIENDA"
  | "MACERACION"
  | "FILTRACION"
  | "COCCION"
  | "FERMENTACION"
  | "MADURACION"
  | "GASIFICACION"
  | "ENVASADO"
  | "DESALCOHOLIZACION"

export interface ProductPhaseResponse {
  id: string
  phase: string
  input: number
  output: number
  outputUnit: UnitMeasurement
  estimatedHours: number
  creationDate: string
  isReady: boolean
}

export interface ProductPhaseUpdateRequest {
  input?: number
  output?: number
  outputUnit?: UnitMeasurement
  estimatedHours?: number
}

export type EtapaProduccion = "Preparación" | "Maceración" | "Cocción" | "Fermentación" | "Maduración" | "Envasado"
