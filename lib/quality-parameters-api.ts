import { api } from "./fetcher"
import type { Phase, QualityParameterSimple } from "@/types"

export async function getActiveQualityParameters(phase?: Phase) {
  const params: Record<string, string> = {}
  if (phase) {
    params.phase = phase
  }
  const response = await api.get<QualityParameterSimple[]>("/api/quality-parameters/active-simple", params)
  return response
}

