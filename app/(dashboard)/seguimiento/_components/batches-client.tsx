"use client"

import { useEffect, useMemo, useState } from "react"
import { BatchCard } from "@/components/production/batch-card"
import { Eye } from "lucide-react"
import { PaginationClient } from "@/components/ui/pagination-client"
import type { BatchResponse, Phase, ProductionPhaseResponse } from "@/types"
import { getProductionPhasesByBatch } from "@/lib/phases/production-phases-api"

interface BatchesClientProps {
  batches: BatchResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

interface PhaseSummary {
  currentStage: string
  completed: number
  total: number
}

const DEFAULT_SUMMARY: PhaseSummary = {
  currentStage: "Por iniciar",
  completed: 0,
  total: 0,
}

export function BatchesClient({ batches, pagination }: BatchesClientProps) {
  const [phaseSummaries, setPhaseSummaries] = useState<Record<string, PhaseSummary>>({})

  useEffect(() => {
    let isMounted = true

    const loadPhases = async () => {
      if (batches.length === 0) {
        if (isMounted) setPhaseSummaries({})
        return
      }

      const entries = await Promise.all(
        batches.map(async (batch) => {
          try {
            const phases = await getProductionPhasesByBatch(batch.id)
            return [batch.id, summarizePhases(phases)] as const
          } catch (error) {
            console.error("Error cargando fases del lote:", batch.id, error)
            return [batch.id, DEFAULT_SUMMARY] as const
          }
        })
      )

      if (isMounted) {
        setPhaseSummaries(Object.fromEntries(entries))
      }
    }

    void loadPhases()

    return () => {
      isMounted = false
    }
  }, [batches])

  const batchesWithSummary = useMemo(
    () =>
      batches.map((batch) => {
        const summary = phaseSummaries[batch.id] ?? DEFAULT_SUMMARY
        const progress =
          summary.total > 0 ? Math.min(Math.max((summary.completed / summary.total) * 100, 0), 100) : 0

        return {
          batch,
          summary,
          progress,
        }
      }),
    [batches, phaseSummaries]
  )

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batchesWithSummary.map(({ batch, summary, progress }) => (
          <BatchCard
            key={batch.id}
            lote={{
              id: batch.id,
              codigo: batch.code,
              ordenProduccionId: batch.orderId,
              nombreProducto: batch.productName,
              tipoProducto: batch.packagingName,
              estado: mapBatchStatusToEstadoLote(batch.status),
              etapaActual: summary.currentStage,
              fasesCompletadas: summary.completed,
              totalFases: summary.total,
              progreso: progress,
              fechaInicio: batch.startDate || batch.plannedDate,
              fechaFinEstimada: batch.estimatedCompletedDate,
              fechaFinReal: batch.completedDate,
            }}
          />
        ))}
      </div>

      {batches.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <Eye className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">No se encontraron lotes</h3>
          <p className="text-primary-600">Ajusta los filtros para ver lotes disponibles</p>
        </div>
      )}

      {pagination && (
        <div className="mt-6 border-t border-stroke bg-primary-50/40 px-4 py-4 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
            <p>Mostrando {batches.length} lotes de {pagination.totalElements} totales</p>
            <PaginationClient currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          </div>
        </div>
      )}
    </>
  )
}

const PHASE_LABELS: Record<Phase, string> = {
  MOLIENDA: "Molienda",
  MACERACION: "Maceración",
  FILTRACION: "Filtración",
  COCCION: "Cocción",
  FERMENTACION: "Fermentación",
  MADURACION: "Maduración",
  GASIFICACION: "Gasificación",
  ENVASADO: "Envasado",
  DESALCOHOLIZACION: "Desalcoholización",
}

function summarizePhases(phases: ProductionPhaseResponse[] | null | undefined): PhaseSummary {
  if (!phases || phases.length === 0) {
    return DEFAULT_SUMMARY
  }

  const total = phases.length
  const completed = phases.filter((phase) => phase.status === "COMPLETADA").length
  const inProgress = phases.find((phase) => phase.status === "EN_PROCESO")
  const pending = phases.find((phase) => phase.status === "PENDIENTE")
  const nextPending = phases.find(
    (phase) =>
      phase.status !== "COMPLETADA" &&
      phase.status !== "EN_PROCESO"
  )

  let currentStage = "Por iniciar"

  if (inProgress) {
    currentStage = PHASE_LABELS[inProgress.phase] ?? inProgress.phase
  } else if (completed === total) {
    currentStage = "Finalizado"
  } else if (pending) {
    currentStage = PHASE_LABELS[pending.phase] ?? pending.phase
  } else if (nextPending) {
    currentStage = PHASE_LABELS[nextPending.phase] ?? nextPending.phase
  }

  return {
    currentStage,
    completed,
    total,
  }
}

function mapBatchStatusToEstadoLote(status: BatchResponse["status"]) {
  switch (status) {
    case "Pendiente":
      return "Planificado"
    case "En Producción":
      return "En Producción"
    case "En Espera":
      return "En Espera"
    case "Completado":
      return "Completado"
    case "Cancelado":
      return "Cancelado"
    default:
      return status
  }
}