/**
 * Funciones utilitarias generales
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
