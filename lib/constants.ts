/**
 * Constantes compartidas del proyecto
 * Centraliza valores mágicos y configuraciones
 */

/**
 * Nombres de meses en español (abreviados)
 */
export const MONTH_NAMES_ES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
] as const

/**
 * Nombres de meses en español (completos)
 */
export const MONTH_NAMES_FULL_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
] as const

/**
 * Configuración de colores para gráficos por categoría
 */
export const CHART_COLORS = {
  blue: {
    primary: '#3b82f6',
    light: '#bfdbfe',
    dark: '#1e40af',
    border: '#3b82f650',
  },
  orange: {
    primary: '#f97316',
    light: '#fed7aa',
    dark: '#c2410c',
    border: '#f9731650',
  },
  red: {
    primary: '#ef4444',
    light: '#fecaca',
    dark: '#b91c1c',
    border: '#ef444450',
  },
} as const

/**
 * Colores para gráfico de pastel (desperdicios)
 * Tonos rojos degradados
 */
export const PIE_CHART_COLORS = [
  'rgba(239, 68, 68, 0.9)',
  'rgba(239, 68, 68, 0.8)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(239, 68, 68, 0.6)',
  'rgba(220, 38, 38, 0.9)',
  'rgba(220, 38, 38, 0.8)',
  'rgba(220, 38, 38, 0.7)',
  'rgba(220, 38, 38, 0.6)',
  'rgba(185, 28, 28, 0.9)',
  'rgba(185, 28, 28, 0.8)',
] as const

/**
 * Tipos de gráficos disponibles
 */
export type ChartType = 'line' | 'bar' | 'pie'

/**
 * Colores disponibles para gráficos
 */
export type ChartColor = keyof typeof CHART_COLORS

/**
 * Unidades de medida para gráficos
 */
export const CHART_UNITS = {
  LITERS: 'L',
  KILOGRAMS: 'kg',
} as const

/**
 * Configuración por defecto para gráficos
 */
export const DEFAULT_CHART_CONFIG = {
  height: 400,
  margin: { top: 5, right: 20, left: 0, bottom: 5 },
  gridStroke: 'rgba(0, 0, 0, 0.05)',
  gridDashArray: '3 3',
  axisColor: 'rgba(0, 0, 0, 0.6)',
  axisFontSize: 11,
  xAxisAngle: -45,
  xAxisHeight: 80,
  tooltipBorderOpacity: 0.5,
} as const

/**
 * Estados de carga para componentes
 */
export const LOADING_STATES = {
  SPINNER_SIZE: 12, // w-12 h-12
  SPINNER_BORDER_WIDTH: 4,
} as const

/**
 * Mensajes de error predeterminados
 */
export const ERROR_MESSAGES = {
  CHART_DATA_LOAD: 'No se pudieron cargar los datos',
  DASHBOARD_STATS: 'No se pudieron cargar las estadísticas del dashboard',
  PRODUCTION_MONTHLY: 'No se pudo cargar la producción mensual',
  CONSUMPTION_MONTHLY: 'No se pudo cargar el consumo de materiales',
  WASTE_MONTHLY: 'No se pudo cargar los desperdicios mensuales',
  EMPTY_DATA: 'No hay datos disponibles',
  RENDER_ERROR: 'Ocurrió un error inesperado',
  CONNECTION_ERROR: 'No se pudo conectar con el servidor',
} as const

/**
 * Configuración de tiempo (milisegundos)
 */
export const TIME_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  TOAST_SUCCESS_DURATION: 3000,
  TOAST_WARNING_DURATION: 4000,
  SSE_RECONNECT_DELAY: 3000,
  SSE_MAX_RECONNECT_ATTEMPTS: 5,
} as const

// ============================================
// CONSTANTES DEL MÓDULO DE MATERIALES
// ============================================

/**
 * Tipos de materiales disponibles
 */
export const MATERIAL_TYPES = {
  MALTA: 'MALTA',
  LUPULO: 'LUPULO',
  AGUA: 'AGUA',
  LEVADURA: 'LEVADURA',
  ENVASE: 'ENVASE',
  ETIQUETADO: 'ETIQUETADO',
  OTROS: 'OTROS',
} as const

/**
 * Labels en español para tipos de materiales
 */
export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  MALTA: 'Maltas',
  LUPULO: 'Lúpulos',
  AGUA: 'Agua',
  LEVADURA: 'Levaduras',
  ENVASE: 'Envases',
  ETIQUETADO: 'Etiquetados',
  OTROS: 'Otros',
} as const

/**
 * Unidades de medida para materiales
 */
export const MATERIAL_UNITS = {
  KG: 'KG',
  LT: 'LT',
  UNIDAD: 'UNIDAD',
} as const

/**
 * Labels en español para unidades de medida
 */
export const MATERIAL_UNIT_LABELS: Record<string, string> = {
  KG: 'kg',
  LT: 'L',
  UNIDAD: 'unidad',
} as const

/**
 * Estados de materiales
 */
export const MATERIAL_STATUSES = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
} as const

/**
 * Configuración de validación para materiales
 */
export const MATERIAL_VALIDATION = {
  CODE_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  MIN_STOCK_VALUE: 0,
  MAX_STOCK_VALUE: 999999,
  MIN_THRESHOLD: 0,
  MAX_THRESHOLD: 10000,
  MIN_VALUE: 0,
  MAX_VALUE: 1000000,
  CRITICAL_THRESHOLD_PERCENTAGE: 0.5, // 50% del umbral
} as const

/**
 * Configuración de paginación por defecto para materiales
 */
export const MATERIAL_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  AVAILABLE_SIZES: [10, 20, 50, 100],
} as const

/**
 * Mensajes de error específicos para materiales
 */
export const MATERIAL_ERROR_MESSAGES = {
  LOAD_FAILED: 'No se pudieron cargar los materiales',
  LOAD_DETAIL_FAILED: 'No se pudo cargar el detalle del material',
  CREATE_FAILED: 'No se pudo crear el material',
  UPDATE_FAILED: 'No se pudo actualizar el material',
  DELETE_FAILED: 'No se pudo eliminar el material',
  TOGGLE_ACTIVE_FAILED: 'No se pudo cambiar el estado del material',
  VALIDATION_FAILED: 'Los datos del material no son válidos',
  EMPTY_LIST: 'No se encontraron materiales',
  STOCK_BELOW_THRESHOLD: 'Stock por debajo del umbral mínimo',
} as const

/**
 * Mensajes de éxito para operaciones con materiales
 */
export const MATERIAL_SUCCESS_MESSAGES = {
  CREATED: 'Material creado exitosamente',
  UPDATED: 'Material actualizado exitosamente',
  DELETED: 'Material eliminado exitosamente',
  ACTIVATED: 'Material activado exitosamente',
  DEACTIVATED: 'Material desactivado exitosamente',
} as const

/**
 * Zonas del almacén por tipo de material
 */
export const MATERIAL_WAREHOUSE_ZONES = {
  MALTA: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'],
  LUPULO: ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'C1', 'C2', 'C3', 'C4', 'C5'],
  LEVADURA: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  AGUA: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  ENVASE: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  ETIQUETADO: ['A1', 'A2', 'B1', 'B2'],
  OTROS: ['A1', 'A2', 'B1', 'B2'],
} as const

/**
 * Niveles disponibles en el almacén
 */
export const MATERIAL_WAREHOUSE_LEVELS = [1, 2, 3] as const

/**
 * Colores para indicadores de estado de stock
 */
export const MATERIAL_STOCK_COLORS = {
  CRITICAL: {
    text: 'text-red-700',
    bg: 'bg-red-100',
    border: 'border-red-300',
  },
  LOW: {
    text: 'text-orange-700',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
  },
  NORMAL: {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-300',
  },
} as const

// ============================================
// CONSTANTES DEL MÓDULO DE MOVIMIENTOS
// ============================================

/**
 * Tipos de movimientos disponibles
 */
export const MOVEMENT_TYPES = {
  INGRESO: 'INGRESO',
  EGRESO: 'EGRESO',
  RESERVA: 'RESERVA',
  DEVUELTO: 'DEVUELTO',
} as const

/**
 * Labels en español para tipos de movimientos
 */
export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  INGRESO: 'Ingreso',
  EGRESO: 'Egreso',
  RESERVA: 'Reserva',
  DEVUELTO: 'Devuelto',
} as const

/**
 * Estados de movimientos
 */
export const MOVEMENT_STATUSES = {
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  COMPLETADO: 'COMPLETADO',
} as const

/**
 * Labels en español para estados de movimientos
 */
export const MOVEMENT_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En Proceso',
  COMPLETADO: 'Completado',
} as const

/**
 * Colores para tipos de movimientos (iconos y texto)
 */
export const MOVEMENT_TYPE_COLORS = {
  INGRESO: {
    icon: 'text-green-600',
    text: 'text-green-800',
    bg: 'bg-green-100',
    border: 'border-green-300',
  },
  EGRESO: {
    icon: 'text-red-600',
    text: 'text-red-800',
    bg: 'bg-red-100',
    border: 'border-red-300',
  },
  RESERVA: {
    icon: 'text-orange-600',
    text: 'text-orange-800',
    bg: 'bg-orange-100',
    border: 'border-orange-300',
  },
  DEVUELTO: {
    icon: 'text-purple-600',
    text: 'text-purple-800',
    bg: 'bg-purple-100',
    border: 'border-purple-300',
  },
} as const

/**
 * Colores para estados de movimientos (badges)
 */
export const MOVEMENT_STATUS_COLORS = {
  PENDIENTE: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
  EN_PROCESO: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
  COMPLETADO: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
} as const

/**
 * Configuración de validación para movimientos
 */
export const MOVEMENT_VALIDATION = {
  MIN_QUANTITY: 0.01,
  MAX_QUANTITY: 999999,
  REASON_MAX_LENGTH: 500,
} as const

/**
 * Configuración de paginación por defecto para movimientos
 */
export const MOVEMENT_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  AVAILABLE_SIZES: [10, 20, 50, 100],
} as const

/**
 * Mensajes de error específicos para movimientos
 */
export const MOVEMENT_ERROR_MESSAGES = {
  LOAD_FAILED: 'No se pudieron cargar los movimientos',
  LOAD_DETAIL_FAILED: 'No se pudo cargar el detalle del movimiento',
  CREATE_FAILED: 'No se pudo crear el movimiento',
  TOGGLE_PROGRESS_FAILED: 'No se pudo cambiar el estado del movimiento',
  COMPLETE_FAILED: 'No se pudo completar el movimiento',
  VALIDATION_FAILED: 'Los datos del movimiento no son válidos',
  EMPTY_LIST: 'No se encontraron movimientos',
  INVALID_STATUS_TRANSITION: 'Transición de estado no permitida',
} as const

/**
 * Mensajes de éxito para operaciones con movimientos
 */
export const MOVEMENT_SUCCESS_MESSAGES = {
  CREATED: 'Movimiento creado exitosamente',
  TOGGLED_IN_PROGRESS: 'Estado del movimiento actualizado',
  COMPLETED: 'Movimiento completado exitosamente',
  REVERTED: 'Movimiento revertido a pendiente',
} as const

/**
 * Textos de acciones según estado
 */
export const MOVEMENT_ACTION_TEXTS = {
  PENDIENTE: 'Iniciar Proceso',
  EN_PROCESO: 'Revertir a Pendiente',
  COMPLETADO: 'Completado',
} as const

// ============================================
// CONSTANTES DE NOTIFICACIONES
// ============================================

/**
 * Tipos de notificaciones disponibles en el sistema
 */
export const NOTIFICATION_TYPES = {
  PRODUCTION_ORDER_PENDING: 'PRODUCTION_ORDER_PENDING',
  PRODUCTION_ORDER_APPROVED: 'PRODUCTION_ORDER_APPROVED',
  PRODUCTION_ORDER_REJECTED: 'PRODUCTION_ORDER_REJECTED',
  SYSTEM_REMINDER: 'SYSTEM_REMINDER',
  PENDING_MOVEMENT: 'PENDING_MOVEMENT',
  LOW_STOCK_ALERT: 'LOW_STOCK_ALERT',
} as const

/**
 * Etiquetas legibles para cada tipo de notificación
 */
export const NOTIFICATION_TYPE_LABELS = {
  PRODUCTION_ORDER_PENDING: 'Orden Pendiente',
  PRODUCTION_ORDER_APPROVED: 'Orden Aprobada',
  PRODUCTION_ORDER_REJECTED: 'Orden Rechazada',
  PENDING_MOVEMENT: 'Movimiento Pendiente',
  LOW_STOCK_ALERT: 'Alerta de Stock Bajo',
  SYSTEM_REMINDER: 'Recordatorio del Sistema',
} as const

/**
 * Configuración de colores para cada tipo de notificación
 * Incluye clases de Tailwind para background, border y text
 */
export const NOTIFICATION_COLORS = {
  PRODUCTION_ORDER_PENDING: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    full: 'bg-primary-50 border-primary-200 text-primary-700',
  },
  PRODUCTION_ORDER_APPROVED: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-600',
    full: 'bg-green-50 border-green-200 text-green-600',
  },
  PRODUCTION_ORDER_REJECTED: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-600',
    full: 'bg-red-50 border-red-200 text-red-600',
  },
  PENDING_MOVEMENT: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    full: 'bg-blue-50 border-blue-200 text-blue-600',
  },
  LOW_STOCK_ALERT: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    full: 'bg-amber-50 border-amber-200 text-amber-600',
  },
  SYSTEM_REMINDER: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-600',
    full: 'bg-gray-50 border-gray-200 text-gray-600',
  },
} as const

/**
 * Prioridades de notificaciones
 */
export const NOTIFICATION_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const

/**
 * Mapeo de tipos de notificación a prioridades
 */
export const NOTIFICATION_PRIORITY_MAP = {
  PRODUCTION_ORDER_REJECTED: 'high',
  LOW_STOCK_ALERT: 'high',
  PRODUCTION_ORDER_PENDING: 'medium',
  PRODUCTION_ORDER_APPROVED: 'medium',
  PENDING_MOVEMENT: 'medium',
  SYSTEM_REMINDER: 'low',
} as const

/**
 * Tipos de notificaciones que se consideran urgentes
 */
export const NOTIFICATION_URGENT_TYPES = ['LOW_STOCK_ALERT', 'PRODUCTION_ORDER_REJECTED'] as const

/**
 * Filtros de notificaciones disponibles
 */
export const NOTIFICATION_FILTERS = {
  ALL: 'all',
  UNREAD: 'unread',
  READ: 'read',
} as const

/**
 * Etiquetas para los filtros de notificaciones
 */
export const NOTIFICATION_FILTER_LABELS = {
  all: 'Todas',
  unread: 'No leídas',
  read: 'Leídas',
} as const

/**
 * Configuración de paginación para notificaciones
 */
export const NOTIFICATION_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  AVAILABLE_SIZES: [10, 20, 50, 100],
} as const

/**
 * Mensajes de error específicos para notificaciones
 */
export const NOTIFICATION_ERROR_MESSAGES = {
  LOAD_FAILED: 'No se pudieron cargar las notificaciones',
  MARK_READ_FAILED: 'No se pudo marcar la notificación como leída',
  MARK_ALL_READ_FAILED: 'No se pudieron marcar todas las notificaciones como leídas',
  STATS_FAILED: 'No se pudieron cargar las estadísticas',
  VALIDATION_FAILED: 'Los datos de la notificación no son válidos',
  EMPTY_LIST: 'No se encontraron notificaciones',
  CONNECTION_FAILED: 'Error de conexión con el servidor',
} as const

/**
 * Mensajes de éxito para operaciones con notificaciones
 */
export const NOTIFICATION_SUCCESS_MESSAGES = {
  MARKED_READ: 'Notificación marcada como leída',
  MARKED_ALL_READ: 'Todas las notificaciones fueron marcadas como leídas',
  REFRESHED: 'Notificaciones actualizadas',
} as const

/**
 * Configuración de actualización automática
 */
export const NOTIFICATION_AUTO_REFRESH = {
  ENABLED: true,
  INTERVAL_MS: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 2000,
} as const

/**
 * Textos por defecto para estados vacíos de notificaciones
 */
export const NOTIFICATION_EMPTY_STATES = {
  ALL: {
    title: 'No hay notificaciones',
    description: 'Las notificaciones aparecerán aquí',
  },
  UNREAD: {
    title: 'No hay notificaciones sin leer',
    description: 'Todas tus notificaciones están al día',
  },
  READ: {
    title: 'No hay notificaciones leídas',
    description: 'Las notificaciones leídas aparecerán aquí',
  },
} as const

/**
 * Configuración de agrupación por fecha
 */
export const NOTIFICATION_DATE_GROUPS = {
  TODAY: 'Hoy',
  YESTERDAY: 'Ayer',
  THIS_WEEK: 'Esta semana',
  OLDER: 'Más antiguas',
} as const

// ============================================
// CONSTANTES DE ÓRDENES DE PRODUCCIÓN
// ============================================

/**
 * Estados disponibles para órdenes de producción
 */
export const ORDER_STATUS = {
  PENDING: 'PENDIENTE',
  APPROVED: 'APROBADA',
  REJECTED: 'RECHAZADA',
  CANCELLED: 'CANCELADA',
} as const

/**
 * Etiquetas legibles para estados de órdenes
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
  CANCELADA: 'Cancelada',
} as const

/**
 * Colores para estados de órdenes (clases de Tailwind)
 */
export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APROBADA: 'bg-green-100 text-green-800 border-green-300',
  RECHAZADA: 'bg-red-100 text-red-800 border-red-300',
  CANCELADA: 'bg-gray-100 text-gray-800 border-gray-300',
} as const

/**
 * Configuración de paginación para órdenes
 */
export const ORDER_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [10, 20, 50],
} as const

/**
 * Mensajes de error para órdenes
 */
export const ORDER_ERROR_MESSAGES = {
  LOAD_FAILED: 'No se pudieron cargar las órdenes de producción',
  CREATE_FAILED: 'No se pudo crear la orden de producción',
  APPROVE_FAILED: 'No se pudo aprobar la orden',
  REJECT_FAILED: 'No se pudo rechazar la orden',
  CANCEL_FAILED: 'No se pudo cancelar la orden',
  INVALID_DATA: 'Los datos de la orden son inválidos',
  CONNECTION_ERROR: 'No se pudo conectar con el backend',
} as const

/**
 * Mensajes de éxito para órdenes
 */
export const ORDER_SUCCESS_MESSAGES = {
  CREATED: 'Orden de producción creada exitosamente',
  APPROVED: 'Orden aprobada exitosamente',
  REJECTED: 'Orden rechazada exitosamente',
  CANCELLED: 'Orden cancelada exitosamente',
} as const

/**
 * Estados vacíos para órdenes
 */
export const ORDER_EMPTY_STATES = {
  NO_ORDERS: {
    title: 'No hay órdenes de producción',
    description: 'Comienza creando tu primera orden de producción para planificar la fabricación de cerveza.',
  },
  NO_PENDING: {
    title: 'No hay órdenes pendientes',
    description: 'Todas las órdenes han sido procesadas.',
  },
  NO_APPROVED: {
    title: 'No hay órdenes aprobadas',
    description: 'No hay órdenes listas para producción en este momento.',
  },
  NO_RESULTS: {
    title: 'No se encontraron resultados',
    description: 'Intenta ajustar los filtros de búsqueda.',
  },
} as const

/**
 * Umbrales de prioridad basados en días hasta fecha planificada
 */
export const ORDER_PRIORITY_THRESHOLDS = {
  OVERDUE: 0, // Vencida
  HIGH: 3,    // Alta prioridad (3 días o menos)
  MEDIUM: 7,  // Media prioridad (7 días o menos)
  LOW: 14,    // Baja prioridad (14 días o menos)
} as const

/**
 * Colores de prioridad para órdenes
 */
export const ORDER_PRIORITY_COLORS = {
  OVERDUE: 'text-red-600',
  HIGH: 'text-orange-600',
  MEDIUM: 'text-yellow-600',
  LOW: 'text-green-600',
} as const

// ============================================================
// CONSTANTES DE PRODUCTOS
// ============================================================

/**
 * Etiquetas para tipos de producto por alcohol
 */
export const PRODUCT_ALCOHOLIC_LABELS = {
  ALCOHOLIC: 'Alcohólico',
  NON_ALCOHOLIC: 'No Alcohólico',
} as const

/**
 * Etiquetas para estados de producto
 */
export const PRODUCT_STATUS_LABELS = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
} as const

/**
 * Etiquetas para estado listo de producto
 */
export const PRODUCT_READY_LABELS = {
  READY: 'Listo para Producción',
  NOT_READY: 'No Listo',
} as const

/**
 * Configuración de colores para tipo alcohólico
 */
export const PRODUCT_ALCOHOLIC_COLORS = {
  ALCOHOLIC: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  NON_ALCOHOLIC: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
  },
} as const

/**
 * Configuración de colores para estado activo
 */
export const PRODUCT_STATUS_COLORS = {
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  INACTIVE: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
  },
} as const

/**
 * Configuración de colores para estado listo
 */
export const PRODUCT_READY_COLORS = {
  READY: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
  },
  NOT_READY: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
  },
} as const

/**
 * Unidades de medida con etiquetas legibles
 */
export const PRODUCT_UNIT_LABELS = {
  KG: 'kg',
  LT: 'L',
  UNIDAD: 'unidades',
} as const

/**
 * Configuración de paginación para productos
 */
export const PRODUCT_PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

/**
 * Mensajes de error para productos
 */
export const PRODUCT_ERROR_MESSAGES = {
  FETCH_FAILED: 'No se pudieron cargar los productos',
  FETCH_BY_ID_FAILED: 'No se pudo cargar el producto',
  CREATE_FAILED: 'No se pudo crear el producto',
  UPDATE_FAILED: 'No se pudo actualizar el producto',
  DELETE_FAILED: 'No se pudo eliminar el producto',
  INVALID_DATA: 'Los datos del producto son inválidos',
  NOT_FOUND: 'Producto no encontrado',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
} as const

/**
 * Mensajes de éxito para productos
 */
export const PRODUCT_SUCCESS_MESSAGES = {
  CREATED: 'Producto creado exitosamente',
  UPDATED: 'Producto actualizado exitosamente',
  DELETED: 'Producto eliminado exitosamente',
  STATUS_CHANGED: 'Estado del producto cambiado exitosamente',
} as const

/**
 * Mensajes para estados vacíos de productos
 */
export const PRODUCT_EMPTY_STATES = {
  NO_PRODUCTS: {
    title: 'No hay productos registrados',
    description: 'Comienza creando tu primer producto para gestionar tu catálogo',
  },
  NO_RESULTS: {
    title: 'No se encontraron productos',
    description: 'Intenta ajustar los filtros de búsqueda',
  },
  NO_ACTIVE: {
    title: 'No hay productos activos',
    description: 'Todos los productos están inactivos',
  },
  NO_READY: {
    title: 'No hay productos listos',
    description: 'Ningún producto está listo para producción',
  },
} as const

/**
 * Opciones de filtro para tipo alcohólico
 */
export const PRODUCT_ALCOHOLIC_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'true', label: 'Alcohólicos' },
  { value: 'false', label: 'No Alcohólicos' },
] as const

/**
 * Opciones de filtro para estado activo
 */
export const PRODUCT_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'true', label: 'Activos' },
  { value: 'false', label: 'Inactivos' },
] as const

/**
 * Opciones de filtro para estado listo
 */
export const PRODUCT_READY_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'true', label: 'Listos' },
  { value: 'false', label: 'No Listos' },
] as const

/**
 * Límites de validación para productos
 */
export const PRODUCT_VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MIN_QUANTITY: 0.01,
  MAX_QUANTITY: 999999,
} as const

// ============================================================
// CONSTANTES DE LOTES (BATCHES)
// ============================================================

/**
 * Mapeo de estados de lotes desde API a UI
 */
export const BATCH_STATUS_API_TO_UI: Record<string, string> = {
  'PENDIENTE': 'Pendiente',
  'EN_PRODUCCION': 'En Producción',
  'EN_ESPERA': 'En Espera',
  'COMPLETADO': 'Completado',
  'COMPLETO': 'Completado',
  'CANCELADO': 'Cancelado'
} as const

/**
 * Mapeo de estados de lotes desde UI a API
 */
export const BATCH_STATUS_UI_TO_API: Record<string, string> = {
  'Pendiente': 'PENDIENTE',
  'En Producción': 'EN_PRODUCCION',
  'En Espera': 'EN_ESPERA',
  'Completado': 'COMPLETADO',
  'Cancelado': 'CANCELADO'
} as const

/**
 * Etiquetas para estados de lotes
 */
export const BATCH_STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  EN_PRODUCCION: 'En Producción',
  EN_ESPERA: 'En Espera',
  COMPLETADO: 'Completado',
  COMPLETO: 'Completado',
  CANCELADO: 'Cancelado',
} as const

/**
 * Configuración de colores para estados de lotes
 */
export const BATCH_STATUS_COLORS = {
  PENDIENTE: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
  },
  EN_PRODUCCION: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
  },
  EN_ESPERA: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
  },
  COMPLETADO: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
  },
  COMPLETO: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    border: 'border-green-300',
  },
  CANCELADO: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300',
  },
} as const

/**
 * Configuración de paginación para lotes
 */
export const BATCH_PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_PAGE_SIZE: 12, // Grid 3x4
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
} as const

/**
 * Mensajes de error para lotes
 */
export const BATCH_ERROR_MESSAGES = {
  FETCH_FAILED: 'No se pudieron cargar los lotes',
  FETCH_BY_ID_FAILED: 'No se pudo cargar el lote',
  CREATE_FAILED: 'No se pudo crear el lote',
  UPDATE_FAILED: 'No se pudo actualizar el lote',
  CANCEL_FAILED: 'No se pudo cancelar el lote',
  PROCESS_TODAY_FAILED: 'No se pudieron procesar los lotes de hoy',
  PDF_FAILED: 'No se pudo descargar el reporte PDF',
  INVALID_DATA: 'Los datos del lote son inválidos',
  NOT_FOUND: 'Lote no encontrado',
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
  CANNOT_CANCEL: 'No se puede cancelar un lote completado o ya cancelado',
} as const

/**
 * Mensajes de éxito para lotes
 */
export const BATCH_SUCCESS_MESSAGES = {
  CREATED: 'Lote creado exitosamente',
  UPDATED: 'Lote actualizado exitosamente',
  CANCELLED: 'Lote cancelado exitosamente',
  PROCESS_TODAY_SUCCESS: 'Lotes de hoy procesados exitosamente',
  PDF_DOWNLOADED: 'Reporte PDF descargado exitosamente',
  PHASE_COMPLETED: 'Fase completada exitosamente',
} as const

/**
 * Mensajes para estados vacíos de lotes
 */
export const BATCH_EMPTY_STATES = {
  NO_BATCHES: {
    title: 'No hay lotes registrados',
    description: 'Inicia la producción de lotes programados para hoy',
  },
  NO_RESULTS: {
    title: 'No se encontraron lotes',
    description: 'Intenta ajustar los filtros de búsqueda',
  },
  NO_ACTIVE: {
    title: 'No hay lotes activos',
    description: 'Todos los lotes están completados o cancelados',
  },
  NO_PENDING: {
    title: 'No hay lotes pendientes',
    description: 'No hay lotes esperando para iniciar producción',
  },
} as const

/**
 * Opciones de filtro para estado de lotes
 */
export const BATCH_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los Estados' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'EN_PRODUCCION', label: 'En Producción' },
  { value: 'EN_ESPERA', label: 'En Espera' },
  { value: 'COMPLETADO', label: 'Completados' },
  { value: 'CANCELADO', label: 'Cancelados' },
] as const

/**
 * Límites de validación para lotes
 */
export const BATCH_VALIDATION_LIMITS = {
  CODE_MIN_LENGTH: 3,
  CODE_MAX_LENGTH: 50,
  MIN_QUANTITY: 0.01,
  MAX_QUANTITY: 999999,
  MIN_PHASES: 1,
} as const

/**
 * Configuración de progreso de lotes
 */
export const BATCH_PROGRESS = {
  COLORS: {
    LOW: 'bg-red-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-green-500',
  },
  THRESHOLDS: {
    LOW: 33,
    MEDIUM: 66,
  },
} as const

/**
 * Intervalos de actualización automática (en milisegundos)
 */
export const BATCH_REFRESH_INTERVALS = {
  ACTIVE_BATCHES: 30000, // 30 segundos para lotes activos
  ALL_BATCHES: 60000, // 1 minuto para vista general
  BATCH_DETAIL: 15000, // 15 segundos para detalle de lote
} as const

// ================================================================================
// PACKAGINGS - Configuraciones para gestión de packagings
// ================================================================================

/**
 * Etiquetas de unidades de medida
 */
export const PACKAGING_UNIT_LABELS: Record<string, string> = {
  kg: 'Kilogramo',
  g: 'Gramo',
  l: 'Litro',
  ml: 'Mililitro',
  u: 'Unidad',
  m: 'Metro',
  cm: 'Centímetro',
  caja: 'Caja',
  paquete: 'Paquete',
  rollo: 'Rollo',
  bolsa: 'Bolsa',
}

/**
 * Etiquetas de estado activo/inactivo
 */
export const PACKAGING_ACTIVE_LABELS = {
  true: 'Activo',
  false: 'Inactivo',
}

/**
 * Configuraciones de color para badges de estado
 */
export const PACKAGING_BADGE_COLORS = {
  active: {
    variant: 'default' as const,
    className: 'bg-green-500 hover:bg-green-600',
  },
  inactive: {
    variant: 'secondary' as const,
    className: 'bg-gray-500 hover:bg-gray-600',
  },
}

/**
 * Configuración de paginación para packagings
 */
export const PACKAGING_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_PAGE: 1,
}

/**
 * Mensajes de error para operaciones con packagings
 */
export const PACKAGING_ERROR_MESSAGES = {
  LOAD_FAILED: 'Error al cargar los packagings',
  CREATE_FAILED: 'Error al crear el packaging',
  UPDATE_FAILED: 'Error al actualizar el packaging',
  DELETE_FAILED: 'Error al eliminar el packaging',
  TOGGLE_FAILED: 'Error al cambiar el estado del packaging',
  NOT_FOUND: 'Packaging no encontrado',
  VALIDATION_FAILED: 'Error en la validación de datos',
  NETWORK_ERROR: 'Error de conexión al servidor',
}

/**
 * Mensajes de éxito para operaciones con packagings
 */
export const PACKAGING_SUCCESS_MESSAGES = {
  CREATED: 'Packaging creado exitosamente',
  UPDATED: 'Packaging actualizado exitosamente',
  DELETED: 'Packaging eliminado exitosamente',
  ACTIVATED: 'Packaging activado exitosamente',
  DEACTIVATED: 'Packaging desactivado exitosamente',
}

/**
 * Mensajes de estado vacío
 */
export const PACKAGING_EMPTY_MESSAGES = {
  NO_PACKAGINGS: 'No hay packagings registrados',
  NO_RESULTS: 'No se encontraron packagings que coincidan con los filtros',
  CREATE_FIRST: 'Comienza creando tu primer packaging',
  TRY_DIFFERENT_FILTERS: 'Intenta con diferentes filtros de búsqueda',
}

/**
 * Opciones de filtro por unidad de medida
 */
export const PACKAGING_UNIT_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas las unidades' },
  { value: 'kg', label: 'Kilogramo' },
  { value: 'g', label: 'Gramo' },
  { value: 'l', label: 'Litro' },
  { value: 'ml', label: 'Mililitro' },
  { value: 'u', label: 'Unidad' },
  { value: 'm', label: 'Metro' },
  { value: 'cm', label: 'Centímetro' },
  { value: 'caja', label: 'Caja' },
  { value: 'paquete', label: 'Paquete' },
  { value: 'rollo', label: 'Rollo' },
  { value: 'bolsa', label: 'Bolsa' },
]

/**
 * Opciones de filtro por estado
 */
export const PACKAGING_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

/**
 * Límites de validación para packagings
 */
export const PACKAGING_VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  QUANTITY_MIN: 0,
  QUANTITY_MAX: 1000000,
  UNIT_MIN_LENGTH: 1,
  UNIT_MAX_LENGTH: 20,
}

/**
 * Formato por defecto para cantidades
 */
export const PACKAGING_QUANTITY_FORMAT = {
  DECIMALS: 2,
  SEPARATOR: ',',
  THOUSAND_SEPARATOR: '.',
}

// ================================================================================
// USERS - Configuraciones para gestión de usuarios
// ================================================================================

/**
 * Etiquetas de roles de usuario
 */
export const USER_ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  PRODUCTION_MANAGER: 'Gerente de Producción',
  WAREHOUSE_OPERATOR: 'Operador de Almacén',
  VIEWER: 'Visualizador',
}

/**
 * Etiquetas de estado activo/inactivo para usuarios
 */
export const USER_ACTIVE_LABELS = {
  true: 'Activo',
  false: 'Inactivo',
}

/**
 * Configuraciones de color para badges de roles
 */
export const USER_ROLE_BADGE_COLORS = {
  ADMIN: {
    variant: 'default' as const,
    className: 'bg-purple-500 hover:bg-purple-600',
  },
  PRODUCTION_MANAGER: {
    variant: 'default' as const,
    className: 'bg-blue-500 hover:bg-blue-600',
  },
  WAREHOUSE_OPERATOR: {
    variant: 'default' as const,
    className: 'bg-orange-500 hover:bg-orange-600',
  },
  VIEWER: {
    variant: 'secondary' as const,
    className: 'bg-gray-500 hover:bg-gray-600',
  },
}

/**
 * Configuraciones de color para badges de estado
 */
export const USER_ACTIVE_BADGE_COLORS = {
  active: {
    variant: 'default' as const,
    className: 'bg-green-500 hover:bg-green-600',
  },
  inactive: {
    variant: 'secondary' as const,
    className: 'bg-gray-500 hover:bg-gray-600',
  },
}

/**
 * Configuración de paginación para usuarios
 */
export const USER_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_PAGE: 1,
}

/**
 * Mensajes de error para operaciones con usuarios
 */
export const USER_ERROR_MESSAGES = {
  LOAD_FAILED: 'Error al cargar los usuarios',
  CREATE_FAILED: 'Error al crear el usuario',
  UPDATE_FAILED: 'Error al actualizar el usuario',
  DELETE_FAILED: 'Error al eliminar el usuario',
  TOGGLE_FAILED: 'Error al cambiar el estado del usuario',
  NOT_FOUND: 'Usuario no encontrado',
  VALIDATION_FAILED: 'Error en la validación de datos',
  NETWORK_ERROR: 'Error de conexión al servidor',
  PASSWORD_UPDATE_FAILED: 'Error al actualizar la contraseña',
  ROLES_UPDATE_FAILED: 'Error al actualizar los roles',
}

/**
 * Mensajes de éxito para operaciones con usuarios
 */
export const USER_SUCCESS_MESSAGES = {
  CREATED: 'Usuario creado exitosamente',
  UPDATED: 'Usuario actualizado exitosamente',
  DELETED: 'Usuario eliminado exitosamente',
  ACTIVATED: 'Usuario activado exitosamente',
  DEACTIVATED: 'Usuario desactivado exitosamente',
  PASSWORD_UPDATED: 'Contraseña actualizada exitosamente',
  ROLES_UPDATED: 'Roles actualizados exitosamente',
}

/**
 * Mensajes de estado vacío
 */
export const USER_EMPTY_MESSAGES = {
  NO_USERS: 'No hay usuarios registrados',
  NO_RESULTS: 'No se encontraron usuarios que coincidan con los filtros',
  CREATE_FIRST: 'Comienza creando el primer usuario del sistema',
  TRY_DIFFERENT_FILTERS: 'Intenta con diferentes filtros de búsqueda',
}

/**
 * Opciones de filtro por rol
 */
export const USER_ROLE_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los roles' },
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'PRODUCTION_MANAGER', label: 'Gerente de Producción' },
  { value: 'WAREHOUSE_OPERATOR', label: 'Operador de Almacén' },
  { value: 'VIEWER', label: 'Visualizador' },
]

/**
 * Opciones de filtro por estado
 */
export const USER_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activos' },
  { value: 'inactive', label: 'Inactivos' },
]

/**
 * Límites de validación para usuarios
 */
export const USER_VALIDATION_LIMITS = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  FIRSTNAME_MIN_LENGTH: 2,
  FIRSTNAME_MAX_LENGTH: 50,
  LASTNAME_MIN_LENGTH: 2,
  LASTNAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 100,
}






