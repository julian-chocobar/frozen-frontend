/**
 * Componente OrderCard - Tarjeta de orden de producción
 * Muestra información detallada de una orden con progreso y acciones
 */

import { Calendar, Clock, User, Eye, Copy, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderCardProps {
  id: string
  beerType: string
  batchCode: string
  status: "En Proceso" | "Planificada" | "Completada"
  priority: "Alta" | "Media" | "Baja"
  startDate: string
  estimatedEndDate: string
  responsible: string
  progress: number
  quantity: number
  notes?: string
}

const statusStyles = {
  "En Proceso": "bg-primary-100 text-primary-700 border-primary-300",
  Planificada: "bg-blue-100 text-blue-700 border-blue-300",
  Completada: "bg-gray-100 text-gray-700 border-gray-300",
}

const priorityStyles = {
  Alta: "bg-red-100 text-red-700 border-red-300",
  Media: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Baja: "bg-green-100 text-green-700 border-green-300",
}

export function OrderCard({
  id,
  beerType,
  batchCode,
  status,
  priority,
  startDate,
  estimatedEndDate,
  responsible,
  progress,
  quantity,
  notes,
}: OrderCardProps) {
  return (
    <div className="card p-6 border-2 border-primary-600 hover:shadow-md transition-all">
      {/* Header con ID y badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-lg font-semibold text-primary-900">{id}</h3>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", statusStyles[status])}>
            {status}
          </span>
          <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", priorityStyles[priority])}>
            {priority}
          </span>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
            aria-label="Ver detalle"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
            aria-label="Copiar orden"
          >
            <Copy className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
            aria-label="Editar orden"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" aria-label="Eliminar orden">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tipo de cerveza */}
      <h4 className="text-xl font-semibold text-primary-900 mb-2">{beerType}</h4>
      <p className="text-sm text-primary-600 mb-4">Lote: {batchCode}</p>

      {/* Información de fechas y responsable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span className="text-primary-800">
            Inicio: <span className="font-medium">{startDate}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary-600" />
          <span className="text-primary-800">
            Fin estimado: <span className="font-medium">{estimatedEndDate}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4 text-primary-600" />
          <span className="text-primary-800">
            Responsable: <span className="font-medium">{responsible}</span>
          </span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary-800">Progreso</span>
          <span className="text-sm font-semibold text-primary-900">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Cantidad y notas */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-primary-800">
          Cantidad: <span className="font-semibold text-primary-900">{quantity} litros</span>
        </p>
        {notes && <p className="text-sm italic text-primary-600">{notes}</p>}
      </div>
    </div>
  )
}
