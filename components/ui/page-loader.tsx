/**
 * Componente de carga para páginas
 * Muestra un spinner con el logo de Frozen mientras se carga el contenido
 */

import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 relative"
      style={{
        backgroundImage: 'url(/Frozen-loading.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      
      {/* Contenido del loading */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
        <p className="text-sm text-primary-800 font-medium">Cargando...</p>
      </div>
    </div>
  )
}
