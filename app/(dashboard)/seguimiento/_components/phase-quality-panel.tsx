"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createPhaseQuality, updatePhaseQuality } from "@/lib/production-phases-api"
import { getActiveQualityParameters } from "@/lib/quality-parameters-api"
import type { ProductionPhaseQualityResponse, ProductionPhaseResponse, QualityParameterSimple } from "@/types"
import { AlertCircle, CheckCircle, Edit, Plus, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QualityParametersSectionProps {
  phase: ProductionPhaseResponse
  qualities: ProductionPhaseQualityResponse[]
  canManage: boolean
  onRefresh: () => Promise<void> | void
}

interface QualityParameterFormValues {
  qualityParameterId: string
  value: string
  isApproved: boolean
}

export function QualityParametersSection({
  phase,
  qualities,
  canManage,
  onRefresh,
}: QualityParametersSectionProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingQuality, setEditingQuality] = useState<ProductionPhaseQualityResponse | null>(null)
  const [availableParameters, setAvailableParameters] = useState<QualityParameterSimple[]>([])
  const [parametersError, setParametersError] = useState<string | null>(null)
  const [loadingParameters, setLoadingParameters] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const phaseKey = useMemo(() => phase.phase, [phase.phase])
  const isPhaseInProduction = phase.status === "EN_PROCESO"
  const canOpenCreate = canManage && isPhaseInProduction

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
    if (!isPhaseInProduction) {
      toast({
        title: "La fase no está en producción",
        description: "Solo puedes cargar parámetros cuando la fase está en producción.",
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
        isApproved: formValues.isApproved,
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

  const handleUpdate = async (formValues: Omit<QualityParameterFormValues, "qualityParameterId">) => {
    if (!editingQuality) return
    setIsSubmitting(true)
    try {
      await updatePhaseQuality(editingQuality.id.toString(), {
        value: formValues.value,
        isApproved: formValues.isApproved,
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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-primary-700 uppercase tracking-wide">
            Parámetros de Calidad
          </h4>
          <Badge variant="outline" className="border-primary-200 text-primary-600">
            {qualities.length} parámetro{qualities.length !== 1 && "s"}
          </Badge>
        </div>
        {canManage && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={!isPhaseInProduction}
                className="gap-2 border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Registrar parámetro
              </Button>
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

      {canManage && !isPhaseInProduction && (
        <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-600">
          Esta fase debe estar en producción para registrar nuevos parámetros de calidad.
        </div>
      )}

      {qualities.length === 0 ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary-200 bg-white/80 px-4 py-3 text-sm text-primary-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          No se registraron parámetros de calidad en esta fase.
        </div>
      ) : (
        <div className="space-y-2">
          {qualities.map((quality) => (
            <QualityParameterCard
              key={quality.id}
              quality={quality}
              canManage={canManage}
              onEdit={() => setEditingQuality(quality)}
            />
          ))}
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
  canManage,
  onEdit,
}: {
  quality: ProductionPhaseQualityResponse
  canManage: boolean
  onEdit: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-primary-200 bg-white/80 px-4 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary-900">{quality.qualityParameterName}</p>
          <p className="text-xs text-primary-500 mt-1">
            Registrado el {new Date(quality.realizationDate).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              quality.isApproved
                ? "bg-green-100 text-green-600 border border-green-200"
                : "bg-red-100 text-red-600 border border-red-200"
            }
          >
            {quality.isApproved ? "Aprobado" : "Observado"}
          </Badge>
          {canManage && (
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
          <span className="font-semibold text-primary-900">{quality.value}</span>
        </div>
      </div>
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
  parameters: QualityParameterSimple[]
  loadingParameters: boolean
  error: string | null
  onRetry: () => Promise<void> | void
  onSubmit: (values: QualityParameterFormValues) => Promise<void> | void
  submitting: boolean
}) {
  const [formValues, setFormValues] = useState<QualityParameterFormValues>({
    qualityParameterId: "",
    value: "",
    isApproved: true,
  })

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handlePromise(onSubmit(formValues))
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
            onValueChange={(value) => setFormValues((prev) => ({ ...prev, qualityParameterId: value }))}
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
                parameters.map((parameter) => (
                  <SelectItem key={parameter.id} value={parameter.id.toString()}>
                    {parameter.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        )}
      </div>

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

      <div className="space-y-2">
        <Label className="text-sm font-medium text-primary-900">Estado</Label>
        <Select
          value={formValues.isApproved ? "true" : "false"}
          onValueChange={(value) => setFormValues((prev) => ({ ...prev, isApproved: value === "true" }))}
        >
          <SelectTrigger className="h-11 border border-primary-300 bg-white text-primary-900 focus:border-primary-500 focus:ring-primary-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border border-primary-200 bg-white">
            <SelectItem value="true">Aprobado</SelectItem>
            <SelectItem value="false">Observado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent"
        disabled={submitting || loadingParameters || Boolean(error) || !formValues.qualityParameterId}
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
  onSubmit: (values: Omit<QualityParameterFormValues, "qualityParameterId">) => Promise<void> | void
}) {
  const [formValues, setFormValues] = useState<Omit<QualityParameterFormValues, "qualityParameterId">>({
    value: quality.value,
    isApproved: quality.isApproved,
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

      <div className="space-y-2">
        <Label className="text-sm font-medium text-primary-900">Estado</Label>
        <Select
          value={formValues.isApproved ? "true" : "false"}
          onValueChange={(value) => setFormValues((prev) => ({ ...prev, isApproved: value === "true" }))}
        >
          <SelectTrigger className="h-11 border border-primary-300 bg-white text-primary-900 focus:border-primary-500 focus:ring-primary-500">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border border-primary-200 bg-white">
            <SelectItem value="true">Aprobado</SelectItem>
            <SelectItem value="false">Observado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        className="w-full border border-primary-300 text-primary-700 hover:bg-primary-50 disabled:border-primary-200 disabled:text-primary-300 disabled:hover:bg-transparent"
        disabled={submitting}
      >
        {submitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}

