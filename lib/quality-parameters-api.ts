import { api } from "./fetcher"
import type { Phase, QualityParameterResponse } from "@/types"

export async function getActiveQualityParameters(phase?: Phase) {
  const params: Record<string, string> = {}
  if (phase) {
    params.phase = phase
  }
  const response = await api.get<QualityParameterResponse[]>("/api/quality-parameters/active", params)
  return response
}

