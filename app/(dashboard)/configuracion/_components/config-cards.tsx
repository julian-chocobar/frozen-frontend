import type { WorkingDay, DayOfWeek } from "@/types"
import { cn } from "@/lib/utils"

interface ConfigCardsProps {
  workingDays: WorkingDay[]
  onEdit: (workingDay: WorkingDay) => void
}

// Función para formatear el día de la semana en español
const formatDayOfWeek = (day: DayOfWeek): string => {
  const dayMap: Record<DayOfWeek, string> = {
    'MONDAY': 'Lunes',
    'TUESDAY': 'Martes',
    'WEDNESDAY': 'Miércoles',
    'THURSDAY': 'Jueves',
    'FRIDAY': 'Viernes',
    'SATURDAY': 'Sábado',
    'SUNDAY': 'Domingo'
  }
  return dayMap[day] || day
}

export function ConfigCards({ workingDays, onEdit }: ConfigCardsProps) {
  return (
    <div className="space-y-4">
      {workingDays.map((wd) => (
        <div key={wd.dayOfWeek} className="card p-4 border-2 border-primary-600 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-primary-900">{formatDayOfWeek(wd.dayOfWeek)}</h4>
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
              wd.isWorkingDay
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-primary-50 text-primary-700 border-primary-200"
            )}>
              {wd.isWorkingDay ? 'Laborable' : 'No laborable'}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-600">Apertura:</span>
              <span className="text-sm font-medium text-primary-900">
                {wd.openingHour?.slice(0,5) || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary-600">Cierre:</span>
              <span className="text-sm font-medium text-primary-900">
                {wd.closingHour?.slice(0,5) || '-'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={() => onEdit(wd)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
              aria-label="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
