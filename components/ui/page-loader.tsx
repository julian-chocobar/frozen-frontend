/**
 * Componente de carga para páginas
 * Muestra un spinner con el logo de Frozen mientras se carga el contenido
 */

import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-16 h-16 bg-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-2xl shadow-lg">
        F
      </div>
      <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
      <p className="text-sm text-muted">Cargando...</p>
    </div>
  )
}
