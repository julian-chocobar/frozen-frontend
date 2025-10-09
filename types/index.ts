/**
 * Definiciones de tipos para el sistema de gestión cervecera
 * Estos tipos representan las entidades principales del dominio
 */

// ============================================
// MATERIAS PRIMAS
// ============================================

export type MaterialCategory = "Maltas" | "Lúpulos" | "Levaduras" | "Otros"

export type MaterialStatus = "Bueno" | "Bajo" | "Exceso" | "Agotado"

export interface Material {
  id: string
  codigo: string // Ej: "MAL-PIL-001"
  nombre: string // Ej: "Malta Pilsen"
  categoria: MaterialCategory
  stock: number // Cantidad actual
  unidad: string // Ej: "kg", "sobres", "L"
  stockMinimo: number // Umbral para alertas
  proveedor: string
  estado: MaterialStatus
  costoUnitario?: number
  ultimaActualizacion: string // ISO date
}

export interface MovimientoMaterial {
  id: string
  materialId: string
  tipo: "Ingreso" | "Egreso"
  cantidad: number
  fecha: string // ISO date
  motivo: string
  loteProduccionId?: string // Si es egreso por producción
  usuario: string
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
  movimientos: MovimientoMaterial[]
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
  categoria: MaterialCategory
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
