/**
 * Definiciones de tipos para el sistema de gestión cervecera
 * Estos tipos representan las entidades principales del dominio
 */

import { StringifyOptions } from "querystring"

// ============================================
// MATERIAS PRIMAS
// ============================================
export type MaterialType = "MALTA" | "LUPULO" | "AGUA" | "LEVADURA" | "ENVASE" | "ETIQUETADO" | "OTROS"
export type UnitMeasurement = "KG" | "LT" | "UNIDAD"

export type MaterialStatus = "Activo" | "Inactivo"



// Tipo para la API del backend (coincide exactamente con lo que recibes)
export interface Material {
  id: string
  code: string
  name: string
  type: MaterialType
  supplier?: string
  value?: number
  totalStock?: number
  reservedStock?: number
  availableStock?: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
  minimumStock?: number
  maximumStock?: number
  currentStock?: number
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
  warehouseX?: number
  warehouseY?: number
}

// Tipo para crear material (coincide con POST /api/materials)
export interface MaterialCreateRequest {
  name: string
  type: MaterialType
  unitMeasurement: UnitMeasurement  
  threshold: number
  supplier?: string // Opcional
  value?: number // Opcional, debe ser > 0
  stock?: number // Opcional, debe ser > 0
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
  warehouseX?: number
  warehouseY?: number
}

// Tipo para actualizar material (coincide con PATCH /api/materials/{id})
export interface MaterialUpdateRequest {
  name?: string
  type?: MaterialType
  supplier?: string
  value?: number // Debe ser > 0
  unitMeasurement?: UnitMeasurement
  threshold?: number // Debe ser > 0
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
  warehouseX?: number
  warehouseY?: number
}

// Respuesta paginada de la API (estructura real del backend)
export interface MaterialsPageResponse {
  content: Material[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

//Detalle para el detalle de materiales 
export interface MaterialDetailResponse {
  id: string
  code: string
  name: string
  type: MaterialType
  supplier?: string
  value?: number
  totalStock?: number
  availableStock?: number
  reservedStock?: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
  creationDate: string
  lastUpdateDate: string
  minimumStock?: number
  maximumStock?: number
  currentStock?: number
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
  warehouseX?: number
  warehouseY?: number
}

// Filtros para la API (coincide con los parámetros del backend)
export interface MaterialsFilters {
  page?: number
  size?: number
  name?: string
  supplier?: string
  type?: MaterialType
  isActive?: boolean
}

// ============================================
// WAREHOUSE
// ============================================

export interface WarehouseDimensions {
  width: number
  height: number
  unit: string
}

export interface WarehouseBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface WarehouseSectionDimensions {
  width: number
  height: number
}

export interface WarehouseSpacing {
  x: number
  y: number
}

export interface WarehouseZoneConfig {
  bounds: WarehouseBounds
  sectionSize: WarehouseSectionDimensions
  sectionSpacing: WarehouseSpacing
  maxSectionsPerRow: number
  maxRows: number
  priority: number
  description: string
}

export interface WarehouseConfigResponse {
  dimensions: WarehouseDimensions
  zones: Record<string, WarehouseZoneConfig>
  walkways: unknown[]
  doors: unknown[]
}

export interface WarehouseLocationValidationRequest {
  zone: string
  section: string
}

export interface WarehouseLocationValidationResponse {
  isValid: boolean
  coordinates?: {
    x: number
    y: number
  }
  message?: string
}

export interface WarehouseZoneSections {
  zone: string
  sections: string[]
  totalSections: number
  layout: string
}

export interface WarehouseZoneConfigUpdateRequest {
  maxSectionsPerRow: number
  maxRows: number
  sectionWidth: number
  sectionHeight: number
  spacingX: number
  spacingY: number
  description: string
}

export interface WarehouseZoneConfigUpdateResponse {
  bounds: WarehouseBounds
  sectionSize: WarehouseSectionDimensions
  sectionSpacing: WarehouseSpacing
  maxSectionsPerRow: number
  maxRows: number
  priority: number
  description: string
}

export interface MaterialWarehouseLocation {
  id?: number
  materialId?: number
  code?: string
  materialCode?: string
  name?: string
  materialName?: string
  type?: MaterialType
  materialType?: MaterialType
  stock?: number
  currentStock?: number
  reservedStock?: number
  threshold?: number
  minimumStock?: number
  isBelowThreshold?: boolean
  warehouseX?: number
  warehouseY?: number
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
}

export interface MaterialWarehouseLocationUpdateRequest {
  warehouseX: number
  warehouseY: number
  warehouseZone: string
  warehouseSection: string
  warehouseLevel: number
}

export interface WarehouseSuggestedLocation {
  zone: string
  section: string
  x: number
  y: number
  level: number
}

export type WarehouseAvailableZone =
  | string
  | {
      name: string
      totalSections?: number
      occupiedSections?: number
      recommendedForTypes?: string[]
    }

export type WarehouseSectionsByZone =
  | Record<string, string[]>
  | Array<{ zone: string; sections: string[] }>

export interface WarehouseInfoResponse {
  availableZones: WarehouseAvailableZone[]
  sectionsByZone: WarehouseSectionsByZone
  suggestedLocation?: WarehouseSuggestedLocation
  totalMaterials?: number
  materialsByZone?: Record<string, number>
}

// ============================================
// MOVIMIENTOS
// ============================================
export type MovementType = "INGRESO" | "EGRESO" | "RESERVA" | "DEVUELTO"
export type MovementStatus = "PENDIENTE" | "EN_PROCESO" | "COMPLETADO"

export interface MovementResponse {
  id: string
  type: MovementType
  status: MovementStatus
  materialType: MaterialType
  stock: number
  materialName: string
  creationDate: string
  realizationDate?: string
  unitMeasurement: UnitMeasurement
  reason?: string
  location?: string
}

export interface MovementDetailResponse {
  id: string
  type: MovementType
  status: MovementStatus
  creationDate: string
  realizationDate?: string
  createdByUserId?: string
  completedByUserId?: string
  inProgressByUserId?: string
  takenAt?: string
  stock: number
  unitMeasurement: UnitMeasurement
  materialType: MaterialType
  materialCode: string
  materialName: string
  materialId: string
  reason?: string
  location: string
}

export interface MovementCreateRequest {
  type: MovementType
  materialId: string
  stock: number
  reason?: string
  location: string
}

export interface MovementsFilters {
  page?: number
  size?: number
  type?: MovementType
  status?: MovementStatus
  materialId?: string
  dateFrom?: string
  dateTo?: string
}

export interface MovementsPageResponse {
  content: MovementResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// ============================================
// PACKAGINGS
// ============================================
export interface PackagingResponse {
  id: string
  name: string
  packagingMaterialName: string 
  labelingMaterialName: string
  unitMeasurement: UnitMeasurement
  quantity: number
  isActive: boolean 
}

export interface PackagingCreateRequest {
  name: string
  packagingMaterialId: string
  labelingMaterialId: string
  unitMeasurement: UnitMeasurement
  quantity: number  
}

export interface PackagingUpdateRequest {
  name?: string
  packagingMaterialId?: string
  labelingMaterialId?: string
  unitMeasurement?: UnitMeasurement
  quantity?: number
}

export interface PackagingPageResponse {
  content: PackagingResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// ============================================
// PRODUCTOS
// ============================================

export type ProductStatus = "Activo" | "Inactivo"
export type ProductReady = "Listo" | "No Listo"
export type ProductAlcoholic = "Alcoholico" | "No Alcoholico"

export interface ProductResponse {
  id: string
  name: string
  isAlcoholic: boolean
  isActive: boolean
  isReady: boolean
  creationDate: string
  standardQuantity: number  
  unitMeasurement: UnitMeasurement 
}

export interface ProductCreateRequest {
  name: string
  isAlcoholic: boolean
  standardQuantity: number
  unitMeasurement: UnitMeasurement
}

export interface ProductUpdateRequest {
  name?: string
  isAlcoholic?: boolean
  standardQuantity?: number
  unitMeasurement?: UnitMeasurement
}

export interface ProductPageResponse {
  content: ProductResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

export interface ProductsFilters {
  page?: number
  size?: number
  name?: string
  isAlcoholic?: boolean
  isActive?: boolean
  isReady?: boolean
  standardQuantity?: number
  unitMeasurement?: UnitMeasurement
}

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

// ============================================
// RECIPES
// ============================================

export interface RecipeCreateRequest {
  productPhaseId: string
  materialId: string
  quantity: number
}

export interface RecipeResponse {
  id: string
  productPhaseId: string
  materialName: string
  materialCode: string
  materialUnit: UnitMeasurement
  quantity: number
}

export interface RecipeUpdateRequest {
  materialId?: string
  quantity?: number
}

// ============================================
// ORDERS
// ============================================

export type ProductionOrderStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA"

export interface ProductionOrderResponse {
  id: string
  batchId: string
  batchCode: string
  packagingName: string
  productName: string
  status: ProductionOrderStatus
  validationDate: string
  quantity: number
  unitMeasurement: UnitMeasurement
  plannedDate: string
  startDate: string
  estimatedCompletedDate: string
  completedDate: string
}

export interface ProductionOrderCreateRequest {
  productId: number
  packagingId: number
  quantity: number
  plannedDate: string // ISO 8601 OffsetDateTime, ej: 2025-10-31T00:00:00-03:00
}

export interface ProductionOrderFilters {
  page?: number
  size?: number
  status?: ProductionOrderStatus
  productId?: string
}

export interface ProductionOrderPageResponse {
  content: ProductionOrderResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// ============================================
// BATCHES
// ============================================

export type BatchStatus = "Pendiente" | "En Producción" | "En Espera" | "Completado" | "Cancelado"

export interface BatchResponse {
  id: string
  code: string
  packagingName: string
  productName: string
  orderId: string
  status: BatchStatus
  quantity: number
  creationDate: string
  plannedDate: string
  startDate: string
  estimatedCompletedDate: string
  completedDate: string
}

export interface BatchFilters {
  page?: number
  size?: number
  status?: BatchStatus
  productId?: string
}

export interface BatchPageResponse {
  content: BatchResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

// ============================================
// USUARIOS
// ============================================
export type Role = 
 | "ADMIN"
 | "GERENTE_GENERAL"
 | "GERENTE_DE_PLANTA"
 | "SUPERVISOR_DE_CALIDAD"
 | "SUPERVISOR_DE_PRODUCCION"
 | "SUPERVISOR_DE_ALMACEN"
 | "OPERARIO_DE_PLANTA"
 | "OPERARIO_DE_ALMACEN"
 | "OPERARIO_DE_CALIDAD"
 | "OPERARIO_DE_PRODUCCION" 

export interface UserCreateRequest {
  username: string
  password: string
  name: string
  roles: Role[]
  email?: string
  phoneNumber?: string
}

export interface UserResponse {
  id: number // Backend returns number
  username: string
  name: string
  roles: Role[]
  isActive: boolean
}

export interface UserDetail {
  id: number
  username: string
  name: string
  email?: string
  phoneNumber?: string
  roles: Role[]
  creationDate: string 
  lastLoginDate?: string
  isActive: boolean
}

export interface UpdateRoleRequest {
  roles: Role[]
}

export interface UpdatePasswordRequest {
  password: string
  passwordConfirmacion: string
  passwordMatching: boolean
}

export interface UserUpdateRequest {
  name?: string
  email?: string
  phoneNumber?: string
}

export interface UserPageResponse {
  content: UserResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}






// ============================================
// PRODUCCIÓN
// ============================================

export type EstadoLote =
  | "Planificado"
  | "En Producción"
  | "Fermentación"
  | "Maduración"
  | "Envasado"
  | "Completado"
  | "Cancelado"

export type EtapaProduccion = "Preparación" | "Maceración" | "Cocción" | "Fermentación" | "Maduración" | "Envasado"

export interface LoteProduccion {
  id: string
  codigo: string // Ej: "LOTE-001"
  ordenProduccionId: string // Ej: "OP-2025-001"
  nombreProducto: string // Ej: "IPA Americana"
  tipoProducto: string // Ej: "IPA Americana - 485L"
  volumenObjetivo: number // En litros
  volumenReal?: number
  estado: EstadoLote
  etapaActual: EtapaProduccion
  progreso: number // 0-100
  fechaInicio: string // ISO date
  fechaFinEstimada: string // ISO date
  fechaFinReal?: string
  responsable: string
  temperatura?: number // Temperatura actual
  ph?: number // pH actual
  alertas?: string[] // Alertas activas
  materiales: MaterialAsignado[]
}

export interface MaterialAsignado {
  materialId: string
  nombreMaterial: string
  cantidadPlanificada: number
  cantidadUsada?: number
  unidad: string
}

export interface OrdenProduccion {
  id: string
  codigo: string // Ej: "OP-2025-001"
  nombreProducto: string
  volumen: number
  fechaCreacion: string
  fechaPlanificada: string
  estado: "Pendiente" | "En Proceso" | "Completada" | "Cancelada"
  lotes: string[] // IDs de lotes asociados
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
// TRAZABILIDAD
// ============================================

export interface TrazabilidadLote {
  lote: LoteProduccion
  materiales: Material[]
  movimientos: MovementResponse[]
  registrosCalidad: RegistroCalidad[]
  desperdicios: RegistroDesperdicio[]
}

// ============================================
// REPORTES Y ANALÍTICA
// ============================================

export interface EstadisticaProduccion {
  periodo: string
  lotesCompletados: number
  volumenTotal: number
  eficienciaPromedio: number
  desperdicioTotal: number
}

export interface TendenciaConsumo {
  materialId: string
  nombreMaterial: string
  categoria: MaterialType
  datos: {
    fecha: string
    cantidad: number
  }[]
}

// ============================================
// USUARIO Y AUTENTICACIÓN
// ============================================

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "Admin" | "Maestro Cervecero" | "Operador" | "Supervisor"
  avatar?: string
}

// ============================================
// NOTIFICACIONES
// ============================================

export type NotificationType = 
  | "PRODUCTION_ORDER_PENDING"   // Nueva orden de producción pendiente (→ GERENTE_DE_PLANTA)
  | "PRODUCTION_ORDER_APPROVED"  // Orden de producción aprobada
  | "PRODUCTION_ORDER_REJECTED"  // Orden de producción rechazada
  | "SYSTEM_REMINDER"            // Recordatorio del sistema
  | "PENDING_MOVEMENT"           // Movimiento pendiente (→ OPERARIO_DE_ALMACEN)
  | "LOW_STOCK_ALERT"            // Alerta de stock bajo (→ SUPERVISOR_DE_ALMACEN)

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  message: string
  relatedEntityId?: number
  isRead: boolean
  createdAt: string  // ISO date string
  readAt?: string    // ISO date string
}

export interface NotificationResponseDTO {
  id: number
  type: NotificationType
  message: string
  relatedEntityId?: number
  isRead: boolean
  createdAt: string
  readAt?: string
}

export interface NotificationStats {
  unreadCount: number
  totalCount: number
}

export interface NotificationsPageResponse {
  notifications: NotificationResponseDTO[]
  content: NotificationResponseDTO[]
  currentPage: number
  totalItems: number
  totalPages: number
  size: number
  isFirst: boolean
  isLast: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface NotificationFilters {
  page?: number
  size?: number
  unreadOnly?: boolean
}

export interface ConnectionsInfo {
  activeConnections: number
  totalSystemConnections: number
}

// ============================================
// CONFIGURACIÓN DEL SISTEMA
// ============================================

export type DayOfWeek =
  | "LUNES"
  | "MARTES"
  | "MIERCOLES"
  | "JUEVES"
  | "VIERNES"
  | "SABADO"
  | "DOMINGO"


export interface WorkingDay {
  dayOfWeek: DayOfWeek
  isWorkingDay: boolean
  openingHour: string 
  closingHour: string 
}

// DTO: SystemConfigurationResponseDTO
export interface SystemConfigurationResponse {
  workingDays: WorkingDay[]
  isActive: boolean
}

// DTO: WorkingDayUpdateDTO 
export interface WorkingDayUpdateRequest {
  dayOfWeek: DayOfWeek
  isWorkingDay: boolean
  openingHour: string 
    closingHour: string 
}
