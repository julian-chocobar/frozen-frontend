"use client"

import { useCallback, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getProductionPhasesByBatch, getPhaseQualitiesByBatch, setPhaseUnderReview } from "@/lib/production-phases-api"
import { QualityParametersSection } from "./phase-quality-panel"
import { ErrorState } from "@/components/ui/error-state"
import type { ProductionPhaseResponse, ProductionPhaseQualityResponse } from "@/types"
import { AlertTriangle, Clock, CheckCircle, Play, Settings, Ban, Loader2, RotateCcw } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  const [phaseUnderReview, setPhaseUnderReview] = useState<ProductionPhaseResponse | null>(null)
  const [underReviewForm, setUnderReviewForm] = useState<{ input: string; output: string }>({
    input: "",
    output: "",
  })
  const [submittingUnderReview, setSubmittingUnderReview] = useState(false)

  const isQualityOperator = Boolean(user?.roles?.includes("OPERARIO_DE_CALIDAD"))
  const isQualitySupervisor = Boolean(user?.roles?.includes("SUPERVISOR_DE_CALIDAD"))
  const isProductionSupervisor = Boolean(user?.roles?.includes("SUPERVISOR_DE_PRODUCCION"))

  const fetchData = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) {
        setLoading(true)
      }
      setError(null)

      try {
        const [phasesData, qualitiesData] = await Promise.all([
          getProductionPhasesByBatch(batchId),
          getPhaseQualitiesByBatch(batchId),
        ])

        setPhases(phasesData)
        setQualities(qualitiesData)
      } catch (err) {
        console.error("Error cargando fases:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("No se pudieron cargar las fases de producción")
        }
      } finally {
        if (showSpinner) {
          setLoading(false)
        }
      }
    },
    [batchId]
  )

  const refreshData = useCallback(async () => {
    await fetchData(false)
  }, [fetchData])

  const handleOpenUnderReview = (phase: ProductionPhaseResponse) => {
    setPhaseUnderReview(phase)
    setUnderReviewForm({
      input: phase.input !== null && phase.input !== undefined ? String(phase.input) : "",
      output: phase.output !== null && phase.output !== undefined ? String(phase.output) : "",
    })
  }

  const handleCloseUnderReview = () => {
    setPhaseUnderReview(null)
    setUnderReviewForm({ input: "", output: "" })
    setSubmittingUnderReview(false)
  }

  const handleSubmitUnderReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!phaseUnderReview) return

    const inputRaw = underReviewForm.input.trim()
    const outputRaw = underReviewForm.output.trim()

    if (!inputRaw || !outputRaw) {
      toast({
        title: "Datos incompletos",
        description: "Debes ingresar los valores de input y output antes de enviar a revisión.",
        variant: "destructive",
      })
      return
    }

    const inputValue = Number(inputRaw)
    const outputValue = Number(outputRaw)

    if (Number.isNaN(inputValue) || Number.isNaN(outputValue)) {
      toast({
        title: "Datos inválidos",
        description: "Debes ingresar valores numéricos para input y output.",
        variant: "destructive",
      })
      return
    }

    setSubmittingUnderReview(true)
    try {
      await setPhaseUnderReview(phaseUnderReview.id.toString(), {
        input: inputValue,
        output: outputValue,
      })
      toast({
        title: "Fase enviada a revisión",
        description: "Se notificó al equipo de calidad para continuar con la revisión.",
      })
      handleCloseUnderReview()
      await refreshData()
    } catch (err) {
      console.error("Error al enviar fase a revisión:", err)
      toast({
        title: "No se pudo enviar a revisión",
        description: err instanceof Error ? err.message : "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      })
      setSubmittingUnderReview(false)
    }
  }

  useEffect(() => {
    void fetchData(true)
  }, [fetchData])

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
    <>
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
              const canSendUnderReview =
                isProductionSupervisor &&
                (phase.status === "EN_PROCESO" || phase.status === "SIENDO_AJUSTADA")

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
                    {canSendUnderReview && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenUnderReview(phase)}
                          className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Enviar a revisión
                        </Button>
                      </div>
                    )}
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
                      canCreate={isQualityOperator}
                      canReview={isQualitySupervisor}
                      onRefresh={refreshData}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>

      <Dialog open={Boolean(phaseUnderReview)} onOpenChange={(open) => !open && handleCloseUnderReview()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar fase a revisión</DialogTitle>
          </DialogHeader>
          {phaseUnderReview && (
            <form onSubmit={handleSubmitUnderReview} className="space-y-4">
              <p className="text-sm text-primary-600">
                Confirma los valores medidos antes de solicitar la revisión de calidad.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase-input" className="text-sm font-medium text-primary-900">
                    Input registrado
                  </Label>
                  <Input
                    id="phase-input"
                    type="number"
                    step="0.01"
                    value={underReviewForm.input}
                    onChange={(event) => setUnderReviewForm((prev) => ({ ...prev, input: event.target.value }))}
                    required
                    className="border border-primary-300 text-primary-900 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phase-output" className="text-sm font-medium text-primary-900">
                    Output registrado
                  </Label>
                  <Input
                    id="phase-output"
                    type="number"
                    step="0.01"
                    value={underReviewForm.output}
                    onChange={(event) => setUnderReviewForm((prev) => ({ ...prev, output: event.target.value }))}
                    required
                    className="border border-primary-300 text-primary-900 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseUnderReview}
                  className="border-primary-300 text-primary-700 hover:bg-primary-50"
                  disabled={submittingUnderReview}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submittingUnderReview}
                  className="gap-2 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {submittingUnderReview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar a revisión"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}