/**
 * Componente StockAlerts - Lista de alertas de stock
 * Muestra materiales que necesitan reabastecimiento
 */

import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface StockAlert {
  id: string
  nombre: string
  stockActual: string
  categoria: string
}

const alertas: StockAlert[] = [
  { id: "1", nombre: "Lúpulo Citra", stockActual: "3.2 kg", categoria: "Lúpulos" },
  { id: "2", nombre: "Levadura S-04 (Ale Inglesa)", stockActual: "8 sobres", categoria: "Levaduras" },
  { id: "3", nombre: "Levadura BE-256 (Sin Alcohol)", stockActual: "4 sobres", categoria: "Levaduras" },
]

export function StockAlerts() {
  return (
    <div className="card p-6 border-2 border-alert-500 bg-alert-50/30">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-alert-600" />
        <h3 className="text-lg font-semibold text-primary-900">Alertas de Stock</h3>
      </div>

      <p className="text-sm text-primary-800 font-medium mb-4">Artículos necesitan reabastecimiento</p>

      <div className="space-y-3">
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-stroke"
          >
            <div>
              <p className="text-sm font-medium text-primary-900">{alerta.nombre}</p>
              <p className="text-xs text-primary-700">{alerta.categoria}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-alert-700">{alerta.stockActual}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/materiales"
        className="block mt-4 text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        Ver todos los materiales →
      </Link>
    </div>
  )
}
