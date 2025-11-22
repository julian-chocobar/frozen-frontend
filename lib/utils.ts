/**
 * Funciones utilitarias generales
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { MONTH_NAMES_ES } from "@/lib/constants"

/**
 * Combina clases de Tailwind de manera inteligente
 * Evita conflictos entre clases
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea una fecha ISO a formato legible en español
 */
export function formatearFecha(fecha: string, incluirHora = false): string {
  const date = new Date(fecha)
  const opciones: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }

  if (incluirHora) {
    opciones.hour = "2-digit"
    opciones.minute = "2-digit"
  }

  return date.toLocaleDateString("es-AR", opciones)
}

/**
 * Formatea un número como moneda
 */
export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(valor)
}

/**
 * Formatea un número con separadores de miles
 */
export function formatearNumero(valor: number, decimales = 0): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}

/**
 * Calcula el porcentaje de progreso
 */
export function calcularProgreso(actual: number, total: number): number {
  if (total === 0) return 0
  return Math.round((actual / total) * 100)
}

/**
 * Determina el color de un badge según el estado
 */
export function obtenerColorEstado(estado: string): string {
  const colores: Record<string, string> = {
    Bueno: "badge-success",
    Bajo: "badge-alert",
    Exceso: "badge-status",
    Agotado: "badge-alert",
    Activo: "badge-primary",
    Completado: "badge-success",
    "En Producción": "badge-status",
    Fermentación: "badge-primary",
    Cancelado: "badge-alert",
  }

  return colores[estado] || "badge-status"
}

/**
 * Formatea el label de un mes para gráficos
 * Maneja diferentes formatos de entrada (monthName, string, number)
 * 
 * @param item - Objeto con información del mes (month, year, monthName)
 * @returns String formateado del mes (ej: "Ene 2024" o "Ene")
 * 
 * @example
 * ```ts
 * formatMonthLabel({ month: 1, year: 2024 }) // "Ene 2024"
 * formatMonthLabel({ month: 5 }) // "May"
 * formatMonthLabel({ monthName: "Enero 2024" }) // "Enero 2024"
 * ```
 */
export function formatMonthLabel(item: { month: number | string; year?: number; monthName?: string }): string {
  if (item.monthName) {
    return item.monthName
  }
  
  if (typeof item.month === 'string') {
    return item.month
  }
  
  if (typeof item.month === 'number' && item.month >= 1 && item.month <= 12) {
    const monthLabel = MONTH_NAMES_ES[item.month - 1]
    if (item.year) {
      return `${monthLabel} ${item.year}`
    }
    return monthLabel
  }
  
  return `Mes ${item.month || 'N/A'}`
}

/**
 * Ordena datos mensuales por año y mes
 * 
 * @param data - Array de objetos con propiedades year y month
 * @returns Array ordenado por año (ascendente) y luego por mes (ascendente)
 * 
 * @example
 * ```ts
 * const data = [
 *   { month: 3, year: 2024 },
 *   { month: 1, year: 2024 },
 *   { month: 2, year: 2023 }
 * ]
 * sortMonthlyData(data)
 * // [{ month: 2, year: 2023 }, { month: 1, year: 2024 }, { month: 3, year: 2024 }]
 * ```
 */
export function sortMonthlyData<T extends { year?: number; month: number | string }>(data: T[]): T[] {
  return [...data].sort((a, b) => {
    // Si tienen año, ordenar por año primero
    if (a.year !== undefined && b.year !== undefined) {
      if (a.year !== b.year) {
        return a.year - b.year
      }
    }
    
    // Luego ordenar por mes
    const monthA = typeof a.month === 'number' ? a.month : 0
    const monthB = typeof b.month === 'number' ? b.month : 0
    return monthA - monthB
  })
}