"use client"

import { useEffect, useState } from "react"
import { getSystemConfiguration, updateWorkingDays } from "@/lib/system-config-api"
import type { SystemConfigurationResponse, WorkingDay, WorkingDayUpdateRequest, DayOfWeek } from "@/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface WorkingDayFormProps {
  initial: WorkingDay
  onSubmit: (data: WorkingDayUpdateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

function WorkingDayForm({ initial, onSubmit, onCancel, isLoading }: WorkingDayFormProps) {
  const [form, setForm] = useState<WorkingDayUpdateRequest>({
    dayOfWeek: initial.dayOfWeek,
    isWorkingDay: initial.isWorkingDay,
    openingHour: initial.openingHour,
    closingHour: initial.closingHour,
  })

  const handleChange = (key: keyof WorkingDayUpdateRequest, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Día</label>
          <input value={form.dayOfWeek} disabled className="w-full px-3 py-2 border border-stroke rounded-lg bg-muted/30" />
        </div>

        <div className="flex items-center gap-3 mt-6 md:mt-0">
          <Switch checked={form.isWorkingDay} onCheckedChange={(v) => handleChange("isWorkingDay", v)} />
          <span className="text-sm">Hábil</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Hora apertura</label>
          <input type="time" value={form.openingHour} onChange={(e)=>handleChange("openingHour", e.target.value)} className="w-full px-3 py-2 border border-stroke rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">Hora cierre</label>
          <input type="time" value={form.closingHour} onChange={(e)=>handleChange("closingHour", e.target.value)} className="w-full px-3 py-2 border border-stroke rounded-lg" />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar"}</Button>
      </div>
    </form>
  )
}

export function ConfigClient() {
  const [data, setData] = useState<SystemConfigurationResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<WorkingDay | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeSaving] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Cargando configuración del sistema...')

      // Intentar obtener los datos del backend
      const res = await getSystemConfiguration()
      console.log('Respuesta del backend:', res)
      console.log('Tipo de respuesta:', typeof res)
      console.log('Keys de respuesta:', res ? Object.keys(res) : 'null')

      // Procesar la respuesta de manera defensiva
      let processedData: SystemConfigurationResponse | null = null

      if (res && typeof res === 'object') {
        processedData = {
          isActive: res.isActive || false,
          workingDays: []
        }

        // Procesar workingDays si existen
        if (res.workingDays && Array.isArray(res.workingDays)) {
          processedData.workingDays = res.workingDays.map((wd: any, index: number) => {
            console.log(`Procesando día ${index}:`, wd)
            return {
              dayOfWeek: wd.dayOfWeek || `DIA_${index}`,
              isWorkingDay: wd.isWorkingDay !== undefined ? wd.isWorkingDay : false,
              openingHour: wd.openingHour || '',
              closingHour: wd.closingHour || ''
            }
          })
        }
      }

      console.log('Datos procesados:', processedData)
      setData(processedData)
    } catch (e: any) {
      console.error('Error al cargar configuración del sistema:', e)
      console.error('Detalles del error:', e?.response?.data || e?.data || e)

      // Mostrar datos de prueba si el backend falla
      const mockData: SystemConfigurationResponse = {
        isActive: true,
        workingDays: [
          { dayOfWeek: 'LUNES', isWorkingDay: true, openingHour: '08:00', closingHour: '17:00' },
          { dayOfWeek: 'MARTES', isWorkingDay: true, openingHour: '08:00', closingHour: '17:00' },
          { dayOfWeek: 'MIERCOLES', isWorkingDay: true, openingHour: '08:00', closingHour: '17:00' },
          { dayOfWeek: 'JUEVES', isWorkingDay: true, openingHour: '08:00', closingHour: '17:00' },
          { dayOfWeek: 'VIERNES', isWorkingDay: true, openingHour: '08:00', closingHour: '17:00' },
          { dayOfWeek: 'SABADO', isWorkingDay: false, openingHour: '', closingHour: '' },
          { dayOfWeek: 'DOMINGO', isWorkingDay: false, openingHour: '', closingHour: '' }
        ]
      }

      console.log('Usando datos de prueba:', mockData)
      setData(mockData)
      setError('Mostrando datos de prueba - Backend no disponible')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleUpdate = async (payload: WorkingDayUpdateRequest) => {
    // Si estamos mostrando datos de prueba, no intentar guardar
    if (error && error.includes('datos de prueba')) {
      alert('No se puede guardar cambios: el backend no está disponible. Los cambios se muestran localmente.')
      setSelected(null)
      return
    }

    try {
      setSaving(true)
      console.log('Actualizando día laboral:', payload)

      // Asegurar que los tiempos estén en formato HH:mm:ss
      const formattedPayload: WorkingDayUpdateRequest = {
        ...payload,
        openingHour: payload.openingHour ? payload.openingHour + ':00' : " ",
        closingHour: payload.closingHour ? payload.closingHour + ':00' : " ",
      }

      console.log('Payload formateado:', formattedPayload)
      await updateWorkingDays([formattedPayload])
      console.log('Día laboral actualizado exitosamente')
      await load()
      setSelected(null)
    } catch (e: any) {
      console.error('Error al actualizar día laboral:', e)
      alert('Error al guardar los cambios: ' + (e?.message || 'Error desconocido'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card p-8 border-2 border-primary-600 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-primary-600">Cargando configuración...</p>
      </div>
    )
  }

  if (!data && !loading) {
    return (
      <div className="card p-6 border-2 border-primary-600">
        <ErrorState error={error || 'No hay datos disponibles'} />
      </div>
    )
  }

  return (
    <>
      {/* Encabezado con toggle activo */}
      <div className="card p-6 border-2 border-primary-600 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary-900">Estado del sistema</h2>
            <p className="text-sm text-primary-600">{data?.isActive ? 'El sistema está activo' : 'El sistema está inactivo'}</p>
            {error && error.includes('datos de prueba') && data && (
              <p className="text-sm text-orange-600 mt-1">⚠️ Mostrando datos de ejemplo - Backend no disponible</p>
            )}
          </div>
          <div className="text-sm text-primary-700">
            (Solo lectura)
          </div>
        </div>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block card p-6 border-2 border-primary-600">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Días Laborales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Día</th>
                <th className="py-2 pr-4">Hábil</th>
                <th className="py-2 pr-4">Apertura</th>
                <th className="py-2 pr-4">Cierre</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.workingDays.map((wd) => (
                <tr key={wd.dayOfWeek} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{wd.dayOfWeek}</td>
                  <td className="py-2 pr-4">{wd.isWorkingDay ? 'Sí' : 'No'}</td>
                  <td className="py-2 pr-4">{wd.openingHour?.slice(0,5) || '-'}</td>
                  <td className="py-2 pr-4">{wd.closingHour?.slice(0,5) || '-'}</td>
                  <td className="py-2 pr-4">
                    <Button
                      size="sm"
                      onClick={()=>setSelected(wd)}
                      disabled={!!(error && error.includes('datos de prueba'))}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards mobile */}
      <div className="md:hidden space-y-4">
        {data?.workingDays.map((wd) => (
          <div key={wd.dayOfWeek} className="card p-4 border-2 border-primary-600">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{wd.dayOfWeek}</h4>
              <span className="text-sm px-2 py-1 rounded-full {wd.isWorkingDay ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                {wd.isWorkingDay ? 'Hábil' : 'No hábil'}
              </span>
            </div>
            <p className="text-sm">Apertura: {wd.openingHour?.slice(0,5) || '-'}</p>
            <p className="text-sm">Cierre: {wd.closingHour?.slice(0,5) || '-'}</p>
            <div className="mt-3 text-right">
              <Button
                size="sm"
                onClick={()=>setSelected(wd)}
                disabled={!!(error && error.includes('datos de prueba'))}
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal edición */}
      <Dialog open={!!selected} onOpenChange={(v)=> !v && setSelected(null)}>
        <DialogContent className="max-w-xl">
          <DialogTitle>Editar día laboral</DialogTitle>
          {selected && (
            <WorkingDayForm
              initial={selected}
              onSubmit={handleUpdate}
              onCancel={()=>setSelected(null)}
              isLoading={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


