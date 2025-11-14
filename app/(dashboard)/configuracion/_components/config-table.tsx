import type { WorkingDay, DayOfWeek } from "@/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfigTableProps {
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

export function ConfigTable({ workingDays, onEdit }: ConfigTableProps) {
  return (
    <div className="card p-6 border-2 border-primary-600">
      <h3 className="text-lg font-semibold text-primary-900 mb-4">Días Laborales</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-primary-200">
              <th className="py-2 pr-4 text-primary-700 font-medium">Día</th>
              <th className="py-2 pr-4 text-primary-700 font-medium">Estado</th>
              <th className="py-2 pr-4 text-primary-700 font-medium">Apertura</th>
              <th className="py-2 pr-4 text-primary-700 font-medium">Cierre</th>
              <th className="py-2 pr-4 text-primary-700 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workingDays.map((wd) => (
              <tr key={wd.dayOfWeek} className="border-b border-primary-100 last:border-0 hover:bg-primary-50">
                <td className="py-3 pr-4">
                  <span className="text-sm font-medium text-primary-900">{formatDayOfWeek(wd.dayOfWeek)}</span>
                </td>
                <td className="py-3 pr-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                    wd.isWorkingDay
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-primary-50 text-primary-700 border-primary-200"
                  )}>
                    {wd.isWorkingDay ? 'Laborable' : 'No laborable'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-sm text-primary-600">
                    {wd.openingHour?.slice(0,5) || '-'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-sm text-primary-600">
                    {wd.closingHour?.slice(0,5) || '-'}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <Button
                    size="sm"
                    onClick={() => onEdit(wd)}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
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
  )
}
