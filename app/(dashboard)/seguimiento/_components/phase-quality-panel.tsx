"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { approvePhaseQuality, createPhaseQuality, disapprovePhaseQuality, reviewPhase, updatePhaseQuality } from "@/lib/phases/production-phases-api"
import { getActiveQualityParameters } from "@/lib/quality/quality-parameters-api"
import type { ProductionPhaseQualityResponse, ProductionPhaseResponse, QualityParameterResponse } from "@/types"
import { AlertCircle, CheckCircle, Edit, History, Loader2, Plus, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QualityParametersSectionProps {
  phase: ProductionPhaseResponse
  qualities: ProductionPhaseQualityResponse[]
  canCreate: boolean
  canReview: boolean
  onRefresh: () => Promise<void> | void
}

interface QualityParameterFormValues {
  qualityParameterId: string
  value: string
}

export function QualityParametersSection({
  phase,
  qualities,
  canCreate,
  canReview,
  onRefresh,
}: QualityParametersSectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingQuality, setEditingQuality] = useState<ProductionPhaseQualityResponse | null>(null)
  const [availableParameters, setAvailableParameters] = useState<QualityParameterResponse[]>([])
  const [parametersError, setParametersError] = useState<string | null>(null)
  const [loadingParameters, setLoadingParameters] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [processingQualityId, setProcessingQualityId] = useState<number | null>(null)
  const [isReviewingPhase, setIsReviewingPhase] = useState(false)
  const { toast } = useToast()

  const phaseKey = useMemo(() => phase.phase, [phase.phase])
  const isPhaseCompleted = phase.status === "COMPLETADA"
  const phaseAllowsRegistration = phase.status === "BAJO_REVISION"
  const canOpenCreate = canCreate && phaseAllowsRegistration && !isPhaseCompleted
  const canTriggerReview = canReview && phase.status === "BAJO_REVISION" && !isPhaseCompleted
  const activeQualities = useMemo(
    () => qualities.filter((quality) => quality.isActive),
    [qualities]
  )
  const historicalQualities = useMemo(
    () =>
      qualities
        .filter((quality) => !quality.isActive)
        .sort((a, b) => b.version - a.version),
    [qualities]
  )
  const groupedHistorical = useMemo(() => {
    return historicalQualities.reduce<Record<number, ProductionPhaseQualityResponse[]>>((acc, quality) => {
      if (!acc[quality.version]) {
        acc[quality.version] = []
      }
      acc[quality.version].push(quality)
      return acc
    }, {})
  }, [historicalQualities])

  useEffect(() => {
    if (!isAddOpen || !canOpenCreate) return
    void loadParameters()
  }, [isAddOpen, phaseKey, canOpenCreate])

  const loadParameters = async () => {
    setLoadingParameters(true)
    setParametersError(null)
    try {
      const params = await getActiveQualityParameters(phaseKey)
      setAvailableParameters(params)
    } catch (error) {
      console.error("Error cargando parámetros de calidad:", error)
      setParametersError(error instanceof Error ? error.message : "No se pudieron cargar los parámetros activos")
    } finally {
      setLoadingParameters(false)
    }
  }

  const handleCreate = async (formValues: QualityParameterFormValues) => {
    if (!phaseAllowsRegistration) {
      toast({
        title: "La fase no está lista para mediciones",
        description: "Solo puedes cargar parámetros cuando la fase está bajo revisión.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await createPhaseQuality({
        productionPhaseId: Number(phase.id),
        qualityParameterId: Number(formValues.qualityParameterId),
        value: formValues.value,
      })
      toast({
        title: "Parámetro registrado",
        description: "El parámetro de calidad fue guardado correctamente.",
      })
      setIsAddOpen(false)
      await Promise.resolve(onRefresh())
    } catch (error) {
      console.error("Error creando parámetro de calidad:", error)
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "No se pudo guardar el parámetro",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (formValues: Pick<QualityParameterFormValues, "value">) => {
    if (!editingQuality) return
    setIsSubmitting(true)
    try {
      await updatePhaseQuality(editingQuality.id.toString(), {
        value: formValues.value,
      })
      toast({
        title: "Parámetro actualizado",
        description: "Los cambios fueron guardados correctamente.",
      })
      setEditingQuality(null)
      await Promise.resolve(onRefresh())
    } catch (error) {
      console.error("Error actualizando parámetro de calidad:", error)
      toast({
        title: "Error al actualizar",
        description: error instanceof Error ? error.message : "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleApproval = async (quality: ProductionPhaseQualityResponse) => {
    setProcessingQualityId(quality.id)
    try {
      await approvePhaseQuality(quality.id.toString())
      toast({
        title: "Parámetro aprobado",
        description: "Se registró la aprobación correctamente.",
      })
      await Promise.resolve(onRefresh())
    } catch (error) {
      console.error("Error actualizando estado del parámetro:", error)
      toast({
        title: "No se pudo actualizar el estado",
        description: error instanceof Error ? error.message : "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      })
    } finally {
      setProcessingQualityId(null)
    }
  }

  const handleDisapproval = async (quality: ProductionPhaseQualityResponse) => {
    setProcessingQualityId(quality.id)
    try {
      await disapprovePhaseQuality(quality.id.toString())
      toast({
        title: "Parámetro desaprobado",
        description: "El registro fue marcado como desaprobado para su corrección.",
      })
      await Promise.resolve(onRefresh())
    } catch (error) {
      console.error("Error desaprobando parámetro:", error)
      toast({
        title: "No se pudo desaprobar",
        description: error instanceof Error ? error.message : "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      })
    } finally {
      setProcessingQualityId(null)
    }
  }

  const handleReviewPhase = async () => {
    if (!canReview || phase.status !== "BAJO_REVISION") {
      toast({
        title: "Fase no disponible para evaluación",
        description: "Solo puedes evaluar fases que estén marcadas como 'BAJO_REVISION'.",
        variant: "destructive",
      })
      return
    }

    setIsReviewingPhase(true)
    try {
      const updatedPhase = await reviewPhase(phase.id.toString())

      const messages: Record<string, { title: string; description: string }> = {
        COMPLETADA: {
          title: "Fase completada",
          description: "Todos los parámetros fueron aprobados y la fase se marcó como completada.",
        },
        RECHAZADA: {
          title: "Fase rechazada",
          description: "Se detectaron parámetros críticos rechazados. Producción fue notificada.",
        },
        SIENDO_AJUSTADA: {
          title: "Fase en ajuste",
          description: "Hay parámetros observados no críticos. Producción realizará correcciones.",
        },
      }

      const message = messages[updatedPhase.status] ?? {
        title: "Revisión registrada",
        description: "Se actualizó el estado de la fase según los parámetros evaluados.",
      }

      toast({
        title: message.title,
        description: message.description,
      })

      await Promise.resolve(onRefresh())
    } catch (error) {
      console.error("Error revisando fase:", error)
      toast({
        title: "No se pudo completar la revisión",
        description: error instanceof Error ? error.message : "Intenta nuevamente en unos minutos.",
        variant: "destructive",
      })
    } finally {
      setIsReviewingPhase(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-semibold text-primary-700 uppercase tracking-wide">
            Parámetros de Calidad
          </h4>
          <Badge variant="outline" className="border-primary-200 text-primary-600">
            {qualities.length} parámetro{qualities.length !== 1 && "s"}
          </Badge>
        </div>
        {(canReview || canCreate) && (
          <div className="flex items-center gap-2 flex-wrap">
            {canReview && (
              <div data-tour="phase-evaluate-button" className="flex-shrink-0">
                <Button
                  size="sm"
                  onClick={handleReviewPhase}
                  disabled={isReviewingPhase || !canTriggerReview}
                  className="gap-2 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-200 disabled:text-primary-400 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isReviewingPhase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="hidden sm:inline">Evaluando...</span>
                      <span className="sm:hidden">Evaluando</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Evaluar fase</span>
                      <span className="sm:hidden">Evaluar</span>
                    </>
                  )}
                </Button>
              </div>
            )}
            {canCreate && (
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <div data-tour="phase-register-parameter-button" className="flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canOpenCreate}
                      className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Registrar parámetro</span>
                      <span className="sm:hidden">Registrar</span>
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Parámetro de Calidad</DialogTitle>
                  </DialogHeader>
                  <QualityParameterCreateForm
                    parameters={availableParameters}
                    loadingParameters={loadingParameters}
                    error={parametersError}
                    onRetry={loadParameters}
                    onSubmit={handleCreate}
                    submitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>

      {isPhaseCompleted && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Esta fase está completada. No se pueden editar o aprobar parámetros de calidad.
        </div>
      )}
      {canCreate && !phaseAllowsRegistration && !isPhaseCompleted && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-600">
          Esta fase debe estar en revisión para registrar nuevos parámetros de calidad.
        </div>
      )}

      {activeQualities.length === 0 && historicalQualities.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-white/80 px-4 py-3 text-sm text-primary-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          No se registraron parámetros de calidad en esta fase.
        </div>
      ) : (
        <div className="space-y-5">
          {activeQualities.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-500">
                Versión actual
              </p>
              {activeQualities.map((quality) => (
                <QualityParameterCard
                  key={quality.id}
                  quality={quality}
                  canReview={canReview && !isPhaseCompleted}
                  onEdit={() => setEditingQuality(quality)}
                  onApprove={() => handleApproval(quality)}
                  onDisapprove={() => handleDisapproval(quality)}
                  processing={processingQualityId === quality.id}
                />
              ))}
            </div>
          )}

          {historicalQualities.length > 0 && (
            <div className="space-y-3 rounded-lg border border-primary-200 bg-primary-50/60 px-4 py-4">
              <div className="flex items-center gap-2 text-primary-600">
                <History className="w-4 h-4" />
                <p className="text-sm font-semibold">Historial de versiones</p>
              </div>
              <div className="space-y-4">
                {Object.entries(groupedHistorical)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([version, items]) => (
                    <div key={version} className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-primary-500">
                        Versión {version}
                      </p>
                      {items.map((quality) => (
                        <QualityParameterCard
                          key={quality.id}
                          quality={quality}
                          canReview={false}
                          onEdit={() => {}}
                          onApprove={() => {}}
                          onDisapprove={() => {}}
                          processing={false}
                          isHistorical
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Dialog open={Boolean(editingQuality)} onOpenChange={(open) => !open && setEditingQuality(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar parámetro de calidad</DialogTitle>
          </DialogHeader>
          {editingQuality && (
            <QualityParameterEditForm
              quality={editingQuality}
              submitting={isSubmitting}
              onSubmit={handleUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QualityParameterCard({
  quality,
  canReview,
  onEdit,
  onApprove,
  onDisapprove,
  processing,
  isHistorical = false,
}: {
  quality: ProductionPhaseQualityResponse
  canReview: boolean
  onEdit: () => void
  onApprove: () => void
  onDisapprove: () => void
  processing: boolean
  isHistorical?: boolean
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
        isHistorical ? "border-primary-200 bg-white/70" : "border-primary-200 bg-white/90"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-primary-900">{quality.qualityParameterName}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-primary-500">
            <span>Registrado el {new Date(quality.realizationDate).toLocaleString()}</span>
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-primary-700">
              Versión {quality.version}
            </span>
            {!quality.isActive && (
              <span className="inline-flex items-center rounded-full bg-primary-200 px-2 py-0.5 text-primary-700">
                Histórico
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              quality.isApproved
                ? "bg-green-100 text-green-600 border border-green-200"
                : "bg-red-100 text-red-600 border border-red-200"
            }
          >
            {quality.isApproved ? "Aprobado" : "No aprobado"}
          </Badge>
          {canReview && quality.isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 border-primary-300 text-primary-600 hover:bg-primary-50"
              title="Editar parámetro"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-primary-700">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-primary-500">Valor</span>
          <span className="font-semibold text-primary-900">
            {quality.value}
            {quality.unit && <span className="ml-1 text-primary-600 font-normal">({quality.unit})</span>}
          </span>
        </div>
      </div>

      {canReview && quality.isActive && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={processing}
            onClick={onDisapprove}
            className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300"
          >
            <XCircle className="w-4 h-4" />
            Desaprobar
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={processing}
            onClick={onApprove}
            className="gap-2 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-200"
          >
            <CheckCircle className="w-4 h-4" />
            Aprobar
          </Button>
        </div>
      )}
    </div>
  )
}

async function handlePromise<T>(maybePromise: T | Promise<T>) {
  return await Promise.resolve(maybePromise)
}

function QualityParameterCreateForm({
  parameters,
  loadingParameters,
  error,
  onRetry,
  onSubmit,
  submitting,
}: {
  parameters: QualityParameterResponse[]
  loadingParameters: boolean
  error: string | null
  onRetry: () => Promise<void> | void
  onSubmit: (values: QualityParameterFormValues) => Promise<void> | void
  submitting: boolean
}) {
  const [formValues, setFormValues] = useState<QualityParameterFormValues>({
    qualityParameterId: "",
    value: "",
  })
  const [selectedParameter, setSelectedParameter] = useState<QualityParameterResponse | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handlePromise(onSubmit(formValues))
  }

  const handleParameterChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, qualityParameterId: value }))
    const parameter = parameters.find((p) => p.id.toString() === value)
    setSelectedParameter(parameter || null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="qualityParameterId" className="text-sm font-medium text-primary-900">
          Parámetro
        </Label>
        {loadingParameters ? (
          <div className="text-sm text-primary-600">Cargando parámetros...</div>
        ) : error ? (
          <div className="space-y-2">
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePromise(onRetry())}
              type="button"
              className="border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <Select
            value={formValues.qualityParameterId}
            onValueChange={handleParameterChange}
          >
            <SelectTrigger className="h-11 w-full border border-primary-300 bg-white text-primary-900 focus:ring-primary-500 focus:border-primary-500">
              <SelectValue
                placeholder="Selecciona un parámetro activo"
                className="text-primary-400"
              />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto border border-primary-200 bg-white">
              {parameters.length === 0 ? (
                <div className="px-3 py-2 text-sm text-primary-500">
                  No hay parámetros activos para esta fase.
                </div>
              ) : (
                parameters.map((parameter) => {
                  const criticalLabel = parameter.isCritical ? " [Crítico]" : ""
                  const unitLabel = parameter.unit ? ` (${parameter.unit})` : ""
                  return (
                    <SelectItem key={parameter.id} value={parameter.id.toString()}>
                      {parameter.name}{criticalLabel}{unitLabel}
                    </SelectItem>
                  )
                })
              )}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Información del parámetro seleccionado */}
      {selectedParameter && (
        <div className="rounded-lg border border-primary-200 bg-primary-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-primary-900">{selectedParameter.name}</h4>
            <div className="flex items-center gap-2">
              {selectedParameter.isCritical && (
                <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs">
                  Crítico
                </Badge>
              )}
              {selectedParameter.unit && (
                <Badge variant="outline" className="border-primary-300 text-primary-700 text-xs">
                  {selectedParameter.unit}
                </Badge>
              )}
            </div>
          </div>
          {selectedParameter.information && (
            <div className="text-sm text-primary-700">
              <p className="font-medium text-primary-800 mb-1">Información:</p>
              <p className="text-primary-600">{selectedParameter.information}</p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="quality-value" className="text-sm font-medium text-primary-900">
          Valor registrado
        </Label>
        <Textarea
          id="quality-value"
          placeholder="Ejemplo: 18°C · 5.4 pH"
          value={formValues.value}
          onChange={(event) => setFormValues((prev) => ({ ...prev, value: event.target.value }))}
          required
          className="min-h-[110px] rounded-lg border border-primary-300 bg-white text-primary-900 placeholder:text-primary-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <Button
        type="submit"
        className="w-full border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent"
        disabled={
          submitting ||
          loadingParameters ||
          Boolean(error) ||
          !formValues.qualityParameterId ||
          formValues.value.trim().length === 0
        }
      >
        {submitting ? "Guardando..." : "Guardar parámetro"}
      </Button>
    </form>
  )
}

function QualityParameterEditForm({
  quality,
  submitting,
  onSubmit,
}: {
  quality: ProductionPhaseQualityResponse
  submitting: boolean
  onSubmit: (values: Pick<QualityParameterFormValues, "value">) => Promise<void> | void
}) {
  const [formValues, setFormValues] = useState<Pick<QualityParameterFormValues, "value">>({
    value: quality.value,
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handlePromise(onSubmit(formValues))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-sm font-medium text-primary-900">Parámetro</Label>
        <Input
          value={quality.qualityParameterName}
          disabled
          className="border border-primary-200 bg-primary-50 text-primary-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-quality-value" className="text-sm font-medium text-primary-900">
          Valor registrado
        </Label>
        <Textarea
          id="edit-quality-value"
          value={formValues.value}
          onChange={(event) => setFormValues((prev) => ({ ...prev, value: event.target.value }))}
          required
          className="min-h-[110px] rounded-lg border border-primary-300 bg-white text-primary-900 placeholder:text-primary-300 focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <Button
        type="submit"
        className="w-full border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent"
        disabled={submitting || formValues.value.trim().length === 0}
      >
        {submitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}

