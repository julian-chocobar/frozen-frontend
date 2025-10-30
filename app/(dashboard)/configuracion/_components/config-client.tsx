"use client"

import { useEffect, useState } from "react"
import { getSystemConfiguration, updateWorkingDays } from "@/lib/system-config-api"
import type { SystemConfigurationResponse, WorkingDay, WorkingDayUpdateRequest, DayOfWeek } from "@/types"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ConfigTable } from "./config-table"
import { ConfigCards } from "./config-cards"
import { WorkingDayForm } from "./config-form"

// Orden de días de la semana: lunes a domingo
const DAY_ORDER: Record<DayOfWeek, number> = {
  'LUNES': 1,
  'MARTES': 2,
  'MIERCOLES': 3,
  'JUEVES': 4,
  'VIERNES': 5,
  'SABADO': 6,
  'DOMINGO': 7
}

// Función para normalizar valores de hora para inputs HTML
const normalizeTimeValue = (timeValue: any): string => {
  if (!timeValue) return ""
  if (typeof timeValue === 'string') {
    // Si ya es string, asegurarse de que tenga formato HH:mm
    if (timeValue.includes(':')) {
      return timeValue.slice(0, 5) // Tomar solo HH:mm
    }
    return timeValue
  }
  return ""
}

// Función para ordenar días sin crear nuevas referencias de objetos
const sortWorkingDays = (workingDays: WorkingDay[]): WorkingDay[] => {
  // Crear un nuevo array pero mantener las mismas referencias de objetos
  // Solo cambiamos el orden, no los objetos en sí
  const sorted = [...workingDays].sort((a, b) => DAY_ORDER[a.dayOfWeek] - DAY_ORDER[b.dayOfWeek])

  // Normalizar los valores de hora para que sean compatibles con inputs HTML
  return sorted.map(day => ({
    ...day,
    openingHour: normalizeTimeValue(day.openingHour),
    closingHour: normalizeTimeValue(day.closingHour)
  }))
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

      const errorMessage = e?.message || e?.data?.message || 'Error desconocido del backend'
      setError(`Error al cargar datos: ${errorMessage}`)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleUpdate = async (payload: WorkingDayUpdateRequest) => {
    try {
      setSaving(true)
      console.log('Actualizando día laboral:', payload)
      
      // Si no hay hora, enviamos string vacío que el backend puede manejar
      const formattedPayload: WorkingDayUpdateRequest = {
        ...payload,
        openingHour: payload.openingHour || "",
        closingHour: payload.closingHour || "",
      }

      console.log('Payload formateado:', formattedPayload)
      await updateWorkingDays([formattedPayload])
      console.log('Día laboral actualizado exitosamente')
      await load()
      setSelected(null)
    } catch (e: any) {
      console.error('Error al actualizar día laboral:', e)
      console.error('Detalles del error:', e?.response?.data || e?.data || e)
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
      {/* Tabla desktop */}
      <div className="hidden md:block">
        <ConfigTable
          workingDays={sortWorkingDays(data?.workingDays || [])}
          onEdit={(day) => setSelected({
            ...day,
            openingHour: normalizeTimeValue(day.openingHour),
            closingHour: normalizeTimeValue(day.closingHour)
          })}
        />
      </div>

      {/* Cards mobile */}
      <div className="md:hidden">
        <ConfigCards
          workingDays={sortWorkingDays(data?.workingDays || [])}
          onEdit={(day) => setSelected({
            ...day,
            openingHour: normalizeTimeValue(day.openingHour),
            closingHour: normalizeTimeValue(day.closingHour)
          })}
        />
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


