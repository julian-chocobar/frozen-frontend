import type { WorkingDay } from "@/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfigCardsProps {
  workingDays: WorkingDay[]
  onEdit: (workingDay: WorkingDay) => void
}

export function ConfigCards({ workingDays, onEdit }: ConfigCardsProps) {
  return (
    <div className="space-y-4">
      {workingDays.map((wd) => (
        <div key={wd.dayOfWeek} className="card p-4 border-2 border-primary-600 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-base font-semibold text-primary-900">{wd.dayOfWeek}</h4>
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
            <Button
              size="sm"
              onClick={() => onEdit(wd)}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Editar
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
