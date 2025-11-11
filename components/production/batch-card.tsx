import { Activity, Calendar, ArrowRight } from "lucide-react"
import { formatearFecha } from "@/lib/utils"
import { NavLink } from "@/components/layout/nav-link"

interface BatchCardProps {
  lote: {
    id: string
    codigo: string
    ordenProduccionId: string
    nombreProducto: string
    tipoProducto: string
    estado: string
    etapaActual: string
    fasesCompletadas: number
    totalFases: number
    progreso: number
    fechaInicio?: string | null
    fechaFinEstimada?: string | null
  }
}

export function BatchCard({ lote }: BatchCardProps) {
  const progressPercent = Math.min(Math.max(lote.progreso ?? 0, 0), 100)
  const showDates = lote.fechaInicio || lote.fechaFinEstimada

  return (
    <div className="card p-5 transition-all hover:shadow-card-hover border-2 border-primary-600">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-primary-600" />
          <div>
            <h3 className="text-lg font-bold text-primary-900">{lote.codigo}</h3>
            <p className="text-xs text-primary-700">Orden: {lote.ordenProduccionId}</p>
          </div>
        </div>
        <span className="badge badge-status">
          {lote.estado}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-xs text-primary-700 mb-1">Orden {lote.ordenProduccionId}</p>
        <p className="text-sm font-semibold text-primary-900 mb-1">{lote.nombreProducto}</p>
        <p className="text-sm text-primary-600">{lote.tipoProducto}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-primary-800 mb-2 font-medium uppercase tracking-wide">
          Etapa actual
        </p>
        <p className="text-sm font-semibold text-primary-900 mb-3">
          {lote.etapaActual ?? "En preparación"}
        </p>
        <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {lote.totalFases > 0 && (
          <p className="mt-2 text-xs text-primary-600">
            Fases completadas {lote.fasesCompletadas}/{lote.totalFases}
          </p>
        )}
      </div>

      {showDates && (
        <div className="space-y-2 mb-4">
          {lote.fechaInicio && (
            <div className="flex items-center gap-2 text-xs text-primary-700">
              <Calendar className="w-4 h-4" />
              <span>Inicio: {formatearFecha(lote.fechaInicio)}</span>
            </div>
          )}
          {lote.fechaFinEstimada && (
            <div className="flex items-center gap-2 text-xs text-primary-700">
              <ArrowRight className="w-4 h-4" />
              <span>Fin estimado: {formatearFecha(lote.fechaFinEstimada)}</span>
            </div>
          )}
        </div>
      )}

      <NavLink
        href={`/seguimiento/${lote.id}`}
        className="block w-full py-2.5 text-center text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300"
      >
        Ver Detalle
      </NavLink>
    </div>
  )
}
