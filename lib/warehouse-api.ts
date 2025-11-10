import { ApiError } from "./fetcher"
import { config, logger } from "./config"
import { api } from "./fetcher"
import type {
  MaterialWarehouseLocation,
  MaterialWarehouseLocationUpdateRequest,
  WarehouseConfigResponse,
  WarehouseInfoResponse,
  WarehouseLocationValidationRequest,
  WarehouseLocationValidationResponse,
  WarehouseZoneConfigUpdateRequest,
  WarehouseZoneConfigUpdateResponse,
  WarehouseZoneSections,
} from "@/types"

type LayoutParams = {
  includeMaterials?: boolean
  zone?: string
  mode?: string
}

const LAYOUT_CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const layoutCache = new Map<string, { svg: string; timestamp: number }>()

const buildQueryString = (params?: Record<string, string | number | boolean | undefined>) => {
  if (!params) return ""
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  const query = searchParams.toString()
  return query ? `?${query}` : ""
}

const resolveUrl = (endpoint: string, params?: Record<string, string | number | boolean | undefined>) => {
  const query = buildQueryString(params)
  if (typeof window === "undefined") {
    return `${config.backend.url}${endpoint}${query}`
  }
  return `${endpoint}${query}`
}

async function fetchSvg(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = resolveUrl(endpoint, params)
  logger.api("GET SVG:", url)

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "image/svg+xml,text/plain,*/*",
    },
    credentials: "include",
  })

  const svg = await response.text()

  if (!response.ok) {
    throw new ApiError(
      response.statusText || "Error al obtener layout del almacén",
      response.status,
      response.statusText,
      svg
    )
  }

  return svg
}

export async function getWarehouseLayout(params?: LayoutParams): Promise<string> {
  const cacheKey = JSON.stringify(params ?? {})
  const cached = layoutCache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.timestamp < LAYOUT_CACHE_TTL) {
    return cached.svg
  }

  const svg = await fetchSvg("/api/warehouse/layout", params)
  layoutCache.set(cacheKey, { svg, timestamp: now })
  return svg
}

export const regenerateWarehouseLayout = async (): Promise<string> => {
  const svg = await fetchSvg("/api/warehouse/layout/regenerate")
  layoutCache.clear()
  return svg
}

export const getWarehouseConfig = () => {
  return api.get<WarehouseConfigResponse>("/api/warehouse/config")
}

export const validateWarehouseLocation = (payload: WarehouseLocationValidationRequest) => {
  return api.post<WarehouseLocationValidationResponse>("/api/warehouse/validate-location", payload)
}

export const getWarehouseZoneSections = (zone?: string) => {
  if (zone) {
    return api.get<WarehouseZoneSections>(`/api/warehouse/zones/${zone}/sections`)
  }
  return api.get<WarehouseZoneSections[]>("/api/warehouse/zones/sections")
}

export const updateWarehouseZoneConfig = (zone: string, payload: WarehouseZoneConfigUpdateRequest) => {
  return api.put<WarehouseZoneConfigUpdateResponse>(`/api/warehouse/zones/${zone}/config`, payload)
}

export const getMaterialsWarehouseMap = (params?: { zone?: string; activeOnly?: boolean }) => {
  const query: Record<string, string> = {}
  if (params?.zone) {
    query.zone = params.zone
  }
  if (params?.activeOnly !== undefined) {
    query.activeOnly = String(params.activeOnly)
  }
  return api.get<MaterialWarehouseLocation[]>("/api/materials/warehouse-map", Object.keys(query).length ? query : undefined)
}

export const updateMaterialWarehouseLocation = (id: number | string, payload: MaterialWarehouseLocationUpdateRequest) => {
  return api.patch(`/api/materials/${id}/location`, payload)
}

export const getWarehouseInfo = (params?: { materialType?: string }) => {
  const query: Record<string, string> = {}
  if (params?.materialType) {
    query.materialType = params.materialType
  }
  return api.get<WarehouseInfoResponse>("/api/materials/warehouse-info", Object.keys(query).length ? query : undefined)
}

