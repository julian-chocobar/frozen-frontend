/**
 * Definiciones de tipos para el sistema de gestión cervecera
 * Estos tipos representan las entidades principales del dominio
 */

import { StringifyOptions } from "querystring"

// ============================================
// MATERIAS PRIMAS
// ============================================
export type MaterialType = "MALTA" | "LUPULO" | "AGUA" | "LEVADURA" | "ENVASE" | "OTROS"
export type UnitMeasurement = "KG" | "LT" | "UNIDAD"

export type MaterialStatus = "Activo" | "Inactivo"



// Tipo para la API del backend (coincide exactamente con lo que recibes)
export interface Material {
  id: string
  code: string
  name: string
  type: MaterialType
  supplier: string
  value: number
  totalStock: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
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
}

// Tipo para actualizar material (coincide con PATCH /api/materials/{id})
export interface MaterialUpdateRequest {
  name?: string
  type?: MaterialType
  supplier?: string
  value?: number // Debe ser > 0
  unitMeasurement?: UnitMeasurement
  threshold?: number // Debe ser > 0
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
  supplier: string
  value: number
  totalStock: number
  availableStock: number
  reservedStock: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
  creationDate: string
  lastUpdateDate: string
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
// MOVIMIENTOS
// ============================================
export type MovementType = "INGRESO" | "EGRESO"

export interface MovementResponse {
  id: string
  type: MovementType
  materialType: MaterialType
  stock: number
  materialName: string
  realizationDate: string
  unitMeasurement: UnitMeasurement
}

export interface MovementDetailResponse {
  id: string
  type: MovementType
  realizationDate: string // ISO date
  stock: number
  unitMeasurement: UnitMeasurement
  materialType: MaterialType
  materialCode: string
  materialName: string
  materialId: string
  reason: string
}

export interface MovementCreateRequest {
  type: MovementType
  materialId: string
  stock: number
  reason?: string
}

export interface MovementsFilters {
  page?: number
  size?: number
  type?: MovementType
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
  materialName: string 
  unitMeasurement: UnitMeasurement
  quantity: number
  isActive: boolean 
}

export interface PackagingCreateRequest {
  name: string
  materialId?: string
  unitMeasurement: UnitMeasurement
  quantity: number  
}

export interface PackagingUpdateRequest {
  name?: string
  materialID?: number
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
  productId: string
  packagingId: string
  quantity: number
  plannedDate: string
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

export interface Notificacion {
  id: string
  tipo: "Alerta" | "Info" | "Éxito" | "Advertencia"
  titulo: string
  mensaje: string
  fecha: string
  leida: boolean
  accionUrl?: string
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
