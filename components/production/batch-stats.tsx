/**
 * Componente BatchStats - Estadísticas de lotes de producción
 * Muestra resumen de lotes activos, en fermentación, alertas y volumen total
 */

import { Beaker, Activity, AlertTriangle, Package } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"

interface BatchStatsProps {
  lotesActivos: number
  enFermentacion: number
  alertasActivas: number
  volumenTotal: number
}

export function BatchStats({ lotesActivos, enFermentacion, alertasActivas, volumenTotal }: BatchStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard title="Lotes Activos" value={lotesActivos} subtitle="En producción" icon={Beaker} variant="primary" />
      <StatCard
        title="En Fermentación"
        value={enFermentacion}
        subtitle="Fase crítica"
        icon={Activity}
        variant="default"
      />
      <StatCard
        title="Alertas Activas"
        value={alertasActivas}
        subtitle="Requieren atención"
        icon={AlertTriangle}
        variant="alert"
      />
      <StatCard
        title="Volumen Total"
        value={`${volumenTotal}L`}
        subtitle="Litros en proceso"
        icon={Package}
        variant="success"
      />
    </div>
  )
}
