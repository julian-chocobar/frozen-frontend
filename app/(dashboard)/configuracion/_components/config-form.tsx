import { useState } from "react"
import type { WorkingDay, WorkingDayUpdateRequest } from "@/types"
import { Button } from "@/components/ui/button"

interface WorkingDayFormProps {
  initial: WorkingDay
  onSubmit: (data: WorkingDayUpdateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function WorkingDayForm({ initial, onSubmit, onCancel, isLoading }: WorkingDayFormProps) {
  const [form, setForm] = useState<WorkingDayUpdateRequest>({
    dayOfWeek: initial.dayOfWeek,
    isWorkingDay: initial.isWorkingDay ?? false,
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
      <div className="space-y-6">
        {/* Primera fila: Día y checkbox */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Día</label>
            <input
              value={form.dayOfWeek}
              disabled
              className="w-full px-3 py-2 border border-stroke rounded-lg bg-muted/30"
            />
          </div>

          <div className="flex items-center gap-3 mt-6 md:mt-6 ml-3">
            <input
              type="checkbox"
              checked={form.isWorkingDay}
              onChange={(e) => handleChange("isWorkingDay", e.target.checked)}
              className="w-6 h-6 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-primary-900">Día laborable</span>
          </div>
        </div>

        {/* Segunda fila: Horas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Hora apertura</label>
            <input
              type="time"
              value={form.openingHour}
              onChange={(e) => handleChange("openingHour", e.target.value)}
              className="w-full px-3 py-2 border border-stroke rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">Hora cierre</label>
            <input
              type="time"
              value={form.closingHour}
              onChange={(e) => handleChange("closingHour", e.target.value)}
              className="w-full px-3 py-2 border border-stroke rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  )
}
