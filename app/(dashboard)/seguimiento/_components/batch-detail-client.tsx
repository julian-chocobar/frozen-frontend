"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { getProductionPhasesByBatch, getPhaseQualitiesByBatch } from "@/lib/production-phases-api"
import { QualityParametersSection } from "./phase-quality-panel"
import { ErrorState } from "@/components/ui/error-state"
import type { ProductionPhaseResponse, ProductionPhaseQualityResponse } from "@/types"
import { AlertTriangle, Clock, CheckCircle, Play, Settings, Ban } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface BatchDetailClientProps {
  batchId: string
}

const PHASE_ICONS: Record<string, any> = {
  MOLIENDA: Settings,
  MACERACION: Clock,
  FILTRACION: Settings,
  COCCION: AlertTriangle,
  FERMENTACION: Play,
  MADURACION: Clock,
  GASIFICACION: Settings,
  ENVASADO: CheckCircle,
  DESALCOHOLIZACION: Settings
}

const PHASE_NAMES: Record<string, string> = {
  MOLIENDA: "Molienda",
  MACERACION: "Maceración",
  FILTRACION: "Filtración", 
  COCCION: "Cocción",
  FERMENTACION: "Fermentación",
  MADURACION: "Maduración",
  GASIFICACION: "Gasificación",
  ENVASADO: "Envasado",
  DESALCOHOLIZACION: "Desalcoholización"
}

const STATUS_BADGE_VARIANTS: Record<string, string> = {
  PENDIENTE: "bg-amber-100 text-amber-700 border border-amber-200",
  EN_PROCESO: "bg-primary-100 text-primary-700 border border-primary-300",
  BAJO_REVISION: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  SIENDO_AJUSTADA: "bg-primary-50 text-primary-800 border border-primary-300",
  RECHAZADA: "bg-red-100 text-red-600 border border-red-200",
  SUSPENDIDA: "bg-primary-100 text-primary-800 border border-primary-300",
  COMPLETADA: "bg-green-100 text-green-600 border border-green-200",
  default: "bg-primary-50 text-primary-700 border border-primary-200"
}

const STATUS_CARD_VARIANTS: Record<string, string> = {
  PENDIENTE: "border-amber-300 bg-amber-50",
  EN_PROCESO: "border-primary-300 bg-primary-50",
  BAJO_REVISION: "border-yellow-300 bg-yellow-50",
  SIENDO_AJUSTADA: "border-primary-300 bg-primary-50",
  RECHAZADA: "border-red-300 bg-red-50",
  SUSPENDIDA: "border-primary-300 bg-primary-50",
  COMPLETADA: "border-green-300 bg-green-50",
  default: "border-primary-200 bg-white"
}

export function BatchDetailClient({ batchId }: BatchDetailClientProps) {
  const [phases, setPhases] = useState<ProductionPhaseResponse[]>([])
  const [qualities, setQualities] = useState<ProductionPhaseQualityResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const canManageQuality = Boolean(
    user?.roles?.some(
      (role) => role === "SUPERVISOR_DE_CALIDAD" || role === "OPERARIO_DE_CALIDAD"
    )
  )

  const refreshQualities = async () => {
    try {
      const qualitiesData = await getPhaseQualitiesByBatch(batchId)
      setQualities(qualitiesData)
    } catch (err) {
      console.error("Error actualizando parámetros de calidad:", err)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        const [phasesData, qualitiesData] = await Promise.all([
          getProductionPhasesByBatch(batchId),
          getPhaseQualitiesByBatch(batchId)
        ])
        
        setPhases(phasesData)
        setQualities(qualitiesData)
      } catch (err) {
        console.error('Error cargando fases:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('No se pudieron cargar las fases de producción')
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [batchId])

  if (loading) {
    return (
      <div className="card border-2 border-primary-600 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-primary-600">Cargando fases de producción...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card border-2 border-primary-600">
        <ErrorState error={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card border-2 border-primary-600 p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h2 className="text-xl font-semibold text-primary-900">Fases de Producción</h2>
          <Badge variant="outline" className="border-primary-600 text-primary-600">
            {phases.length} fase{phases.length !== 1 && "s"}
          </Badge>
        </div>

        {phases.length === 0 ? (
          <div className="text-center py-10">
            <Ban className="h-12 w-12 text-primary-300 mx-auto mb-4" />
            <p className="text-primary-600">No hay fases de producción registradas para este lote.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {phases.map((phase, index) => {
              const Icon = PHASE_ICONS[phase.phase] || Settings
              const phaseName = PHASE_NAMES[phase.phase] || phase.phase
              const badgeClass = STATUS_BADGE_VARIANTS[phase.status] ?? STATUS_BADGE_VARIANTS.default
              const cardClass = STATUS_CARD_VARIANTS[phase.status] ?? STATUS_CARD_VARIANTS.default
              const phaseQualities = qualities.filter(q => q.productionPhaseId === phase.id)
              const isLastPhase = index === phases.length - 1

              return (
                <div key={phase.id} className={`relative border-2 rounded-lg p-5 transition-all duration-200 ${cardClass}`}>
                  {!isLastPhase && (
                    <div className="hidden md:block absolute left-6 -bottom-8 w-0.5 h-8 bg-primary-200 rounded-full"></div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border border-primary-200 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary-900">{phaseName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={badgeClass}>{phase.status.replace("_", " ")}</Badge>
                          <span className="text-xs text-primary-600">
                            Fase {index + 1} de {phases.length}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-primary-600 font-medium uppercase text-xs">Input</p>
                      <p className="text-primary-900 font-semibold">
                        {phase.input ? `${phase.input} ${phase.outputUnit}` : "Pendiente"}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 font-medium uppercase text-xs">Output</p>
                      <p className="text-primary-900 font-semibold">
                        {phase.output ? `${phase.output} ${phase.outputUnit}` : "Pendiente"}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 font-medium uppercase text-xs">Inicio</p>
                      <p className="text-primary-900 font-semibold">
                        {phase.startDate ? new Date(phase.startDate).toLocaleDateString() : "Pendiente"}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 font-medium uppercase text-xs">Fin</p>
                      <p className="text-primary-900 font-semibold">
                        {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : "En proceso"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-primary-200">
                    <QualityParametersSection
                      phase={phase}
                      qualities={phaseQualities}
                      canManage={canManageQuality}
                      onRefresh={refreshQualities}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}