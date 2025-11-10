/**
 * API específica para materiales
 * Funciones para interactuar con el backend de materiales
 */

import { api } from './fetcher'
import type { 
  Material, 
  MaterialCreateRequest,
  MaterialUpdateRequest,
  MaterialsPageResponse, 
  MaterialsFilters,
  MaterialType,
  UnitMeasurement, 
  Phase,
  MaterialDetailResponse,
} from '@/types'

const TYPE_LABELS: Record<MaterialType, string> = {
  'MALTA': 'Maltas',
  'LUPULO': 'Lúpulos', 
  'AGUA': 'Agua',
  'LEVADURA': 'Levaduras',
  'ENVASE': 'Envases',
  'ETIQUETADO': 'Etiquetados',
  'OTROS': 'Otros'
}

// ============================================
// SISTEMA DE ALMACÉN SIMPLIFICADO
// ============================================

/**
 * Configuración fija de zonas y secciones del almacén
 */
export const WAREHOUSE_ZONES_SECTIONS = {
  MALTA: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'],
  LUPULO: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'],
  LEVADURA: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  AGUA: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  ENVASE: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  ETIQUETADO: ['A1', 'A2', 'B1', 'B2'],
  OTROS: ['A1', 'A2', 'B1', 'B2']
} as const

/**
 * Niveles disponibles en el almacén
 */
export const WAREHOUSE_LEVELS = [1, 2, 3] as const

/**
 * Labels para las zonas del almacén
 */
export const WAREHOUSE_ZONE_LABELS = {
  MALTA: 'Malta',
  LUPULO: 'Lúpulo',
  LEVADURA: 'Levadura',
  AGUA: 'Agua',
  ENVASE: 'Envase',
  ETIQUETADO: 'Etiquetado',
  OTROS: 'Otros'
} as const

const UNIT_LABELS: Record<UnitMeasurement, string> = {
  'KG': 'kg',
  'LT': 'L',
  'UNIDAD': 'unidad'
}

/**
 * Mapea filtros de UI a filtros de API
 */
function mapFiltersToAPI(filters: {
  type?: string
  estado?: string
  name?: string
  supplier?: string
  page?: number
  size?: number
}): MaterialsFilters {
  const apiFilters: MaterialsFilters = {
    page: filters.page || 0,
    size: filters.size || 10
  }

  // Mapear búsqueda a name (búsqueda por nombre)
  if (filters.name) {
    apiFilters.name = filters.name
  }

  // Mapear proveedor
  if (filters.supplier) {
    apiFilters.supplier = filters.supplier
  }

  // Mapear tipo directamente (ya viene en inglés)
  if (filters.type && filters.type !== 'Todas') {
    apiFilters.type = filters.type as MaterialType
  }

  // Mapear estado a isActive
  if (filters.estado && filters.estado !== 'Todos') {
    apiFilters.isActive = filters.estado === 'Activo'
  }

  return apiFilters
}

/**
 * Obtiene lista paginada de materiales
 */
export async function getMaterials(filters: {
  type?: string
  estado?: string
  name?: string
  supplier?: string
  page?: number
  size?: number
} = {}) {
  const apiFilters = mapFiltersToAPI(filters)
  
  // Convertir filtros a parámetros de URL en inglés
  const urlParams: Record<string, string> = {}
  
  if (apiFilters.page !== undefined) urlParams.page = apiFilters.page.toString()
  if (apiFilters.size !== undefined) urlParams.size = apiFilters.size.toString()
  if (apiFilters.name) urlParams.name = apiFilters.name
  if (apiFilters.supplier) urlParams.supplier = apiFilters.supplier
  if (apiFilters.type) urlParams.type = apiFilters.type
  if (apiFilters.isActive !== undefined) urlParams.isActive = apiFilters.isActive.toString()
  
  const response = await api.get<MaterialsPageResponse>('/api/materials', urlParams)
  
  return {
    materials: response.content,
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
 * Obtiene un material por ID
 */
export async function getMaterialDetail(id: string) {
  const material = await api.get<MaterialDetailResponse>(`/api/materials/${id}`)
  return material
}

/**
 * Crea un nuevo material
 */
export async function createMaterial(data: MaterialCreateRequest) {
  const material = await api.post<Material>('/api/materials', data)
  return material
}

/**
 * Actualiza un material existente
 */
export async function updateMaterial(id: string, data: MaterialUpdateRequest) {
  const material = await api.patch<Material>(`/api/materials/${id}`, data)
  return material
}


/**
 * Activa/desactiva un material
 */
export async function toggleMaterialActive(id: string) {
  const material = await api.patch<Material>(`/api/materials/${id}/toggle-active`)
  return material
}

/**
 * Obtiene las opciones de tipos de material
 */
export function getMaterialTypes() {
  return [
    { value: 'MALTA', label: 'Malta' },
    { value: 'LUPULO', label: 'Lúpulo' },
    { value: 'AGUA', label: 'Agua' },
    { value: 'LEVADURA', label: 'Levadura' },
    { value: 'ENVASE', label: 'Envase' },
    { value: 'ETIQUETADO', label: 'Etiquetado' },
    { value: 'OTROS', label: 'Otros' }
  ]
}

/**
 * Obtiene las opciones de unidades de medida
 */
export function getUnitMeasurements() {
  return [
    { value: 'KG', label: 'Kilogramos' },
    { value: 'LT', label: 'Litros' },
    { value: 'UNIDAD', label: 'Unidad' }
  ]
}

/**
 * Obtiene el label en español para un tipo de material
 */
export function getTypeLabel(type: MaterialType): string {
  return TYPE_LABELS[type]
}

/**
 * Obtiene el label en español para una unidad de medida
 */
export function getUnitLabel(unit: UnitMeasurement): string {
  return UNIT_LABELS[unit]
}

/**
 * Interfaz para la respuesta del endpoint id-name-list
 */
export interface MaterialIdName {
  id: number
  code: string
  name: string
}

/**
 * Obtiene lista simplificada de materiales (ID, código y nombre)
 * Para usar en dropdowns y selecciones
 */
export async function getMaterialsIdNameList(params?: {
  name?: string
  active?: boolean
  phase?: Phase
  type?: MaterialType
}): Promise<MaterialIdName[]> {
  const urlParams: Record<string, string> = {}
  
  if (params?.name) {
    urlParams.name = params.name
  }
  
  if (params?.active !== undefined) {
    urlParams.active = params.active.toString()
  }

  if (params?.phase) {
    urlParams.phase = params.phase
  }

  if (params?.type) {
    urlParams.type = params.type
  }
  const materials = await api.get<MaterialIdName[]>('/api/materials/id-name-list', urlParams)
  return materials
}

// ============================================
// FUNCIONES DEL SISTEMA DE ALMACÉN
// ============================================

/**
 * Obtiene las secciones disponibles para una zona específica
 */
export function getSectionsForZone(zone: MaterialType): readonly string[] {
  return WAREHOUSE_ZONES_SECTIONS[zone] || []
}

/**
 * Obtiene todas las zonas disponibles con sus secciones
 */
export function getWarehouseZones() {
  return Object.keys(WAREHOUSE_ZONES_SECTIONS).map(zone => ({
    value: zone as MaterialType,
    label: WAREHOUSE_ZONE_LABELS[zone as MaterialType],
    sections: WAREHOUSE_ZONES_SECTIONS[zone as MaterialType]
  }))
}

/**
 * Obtiene los niveles disponibles
 */
export function getWarehouseLevels() {
  return WAREHOUSE_LEVELS.map(level => ({
    value: level,
    label: `Nivel ${level}`
  }))
}

/**
 * Valida si una ubicación es válida
 */
export function validateWarehouseLocation(zone: MaterialType, section: string, level: number): boolean {
  const validSections = getSectionsForZone(zone)
  const validLevels = WAREHOUSE_LEVELS
  
  return validSections.includes(section) && validLevels.includes(level as any)
}

/**
 * Obtiene el label de una zona
 */
export function getWarehouseZoneLabel(zone: MaterialType): string {
  return WAREHOUSE_ZONE_LABELS[zone] || zone
}