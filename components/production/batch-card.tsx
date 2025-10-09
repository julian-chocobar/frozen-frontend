/**
 * Componente BatchCard - Tarjeta de lote de producción
 * Muestra información detallada de un lote con progreso, parámetros y alertas
 */

import { Activity, Thermometer, Droplet, Calendar, User, ArrowRight, AlertCircle } from "lucide-react"
import { cn, formatearFecha } from "@/lib/utils"
import type { LoteProduccion } from "@/types"
import { NavLink } from "@/components/layout/nav-link"

interface BatchCardProps {
  lote: LoteProduccion
}

export function BatchCard({ lote }: BatchCardProps) {
  const hasAlerts = lote.alertas && lote.alertas.length > 0

  return (
    <div
      className={cn(
        "card p-5 transition-all hover:shadow-lg border-2",
        hasAlerts ? "border-alert-500" : "border-primary-600",
      )}
    >
      {/* Header con código y estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-bold text-primary-900">{lote.codigo}</h3>
            <p className="text-xs text-primary-700">Orden: {lote.ordenProduccionId}</p>
          </div>
        </div>
        <span
          className={cn(
            "badge",
            lote.estado === "Fermentación" && "badge-primary",
            lote.estado === "En Producción" && "badge-status",
            lote.estado === "Completado" && "badge-success",
          )}
        >
          {lote.estado === "Fermentación" ? "ACTIVO" : lote.estado === "En Producción" ? "ACTIVO" : lote.estado}
        </span>
      </div>

      {/* Información del lote */}
      <div className="mb-4">
        <p className="text-xs text-primary-700 mb-1">Lote: {lote.codigo}</p>
        <p className="text-sm font-semibold text-primary-900 mb-1">{lote.nombreProducto}</p>
        <p className="text-sm text-primary-600">{lote.tipoProducto}</p>
      </div>

      {/* Etapa y progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-primary-800">
            Etapa: {lote.etapaActual} {lote.etapaActual === "Fermentación" && `(Día 9 de 9)`}
            {lote.etapaActual === "Cocción" && `(0h 45m)`}
            {lote.etapaActual === "Maduración" && `(Día 14 de 14)`}
          </p>
          <p className="text-xs font-bold text-primary-600">{lote.progreso}%</p>
        </div>
        <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${lote.progreso}%` }}
          />
        </div>
      </div>

      {/* Parámetros */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-stroke">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-primary-600" />
          <div>
            <p className="text-xs text-primary-700">Temp</p>
            <p className="text-sm font-bold text-primary-900">{lote.temperatura}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="w-4 h-4 text-primary-600" />
          <div>
            <p className="text-xs text-primary-700">pH</p>
            <p className="text-sm font-bold text-primary-900">{lote.ph}</p>
          </div>
        </div>
      </div>

      {/* Fechas y responsable */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-primary-700">
          <User className="w-4 h-4" />
          <span>{lote.responsable}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary-700">
          <Calendar className="w-4 h-4" />
          <span>Inicio: {formatearFecha(lote.fechaInicio)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary-700">
          <ArrowRight className="w-4 h-4" />
          <span>Fin estimado: {formatearFecha(lote.fechaFinEstimada)}</span>
        </div>
      </div>

      {/* Alertas */}
      {hasAlerts && (
        <div className="mb-4 p-3 bg-alert-50 border border-alert-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-alert-600" />
            <p className="text-xs font-medium text-alert-700">{lote.alertas![0]}</p>
          </div>
        </div>
      )}

      {/* Botón de detalle */}
      <NavLink
        href={`/seguimiento/${lote.id}`}
        className="block w-full py-2.5 text-center text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        Ver Detalle
      </NavLink>
    </div>
  )
}
