/**
 * Componente MaterialsSummary - Resumen de materiales activos
 * Muestra el conteo de materiales por categoría
 */

import Link from "next/link"

interface CategoryCount {
  categoria: string
  cantidad: number
}

const categorias: CategoryCount[] = [
  { categoria: "Lúpulos", cantidad: 4 },
  { categoria: "Maltas", cantidad: 4 },
  { categoria: "Levaduras", cantidad: 4 },
]

export function MaterialsSummary() {
  return (
    <div className="card p-6 border-2 border-primary-600">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary-900 mb-1">Materiales Activos</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-primary-900 font-mono">22</p>
          <span className="text-sm font-medium text-primary-600">+3 nuevos este mes</span>
        </div>
      </div>

      <div className="space-y-3">
        {categorias.map((cat) => (
          <div key={cat.categoria} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
            <span className="text-sm font-medium text-primary-900">{cat.categoria}</span>
            <span className="text-sm font-bold text-primary-600">{cat.cantidad}</span>
          </div>
        ))}
      </div>

      <Link
        href="/materiales"
        className="block mt-4 text-center text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        Ver inventario completo →
      </Link>
    </div>
  )
}
