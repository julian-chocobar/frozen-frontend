/**
 * Componente de carga para páginas
 * Muestra un spinner con el logo de Frozen mientras se carga el contenido
 */

import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-200">
        <img 
          src="/Frozen-image.png" 
          alt="Frozen Cervecería Artesanal" 
          className="w-full h-full object-contain"
        /> 
      </div>
      <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
      <p className="text-sm text-muted">Cargando...</p>
    </div>
  )
}
