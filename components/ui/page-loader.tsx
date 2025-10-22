/**
 * Componente de carga para páginas
 * Muestra un spinner con el logo de Frozen mientras se carga el contenido
 */

import { Loader2 } from "lucide-react"

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative">
      {/* Imagen de fondo centrada */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 "
        style={{
          backgroundImage: 'url(/Frozen-loading.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.3,
          width: '700px',
          height: '700px'
        }}
      />
      
      {/* Overlay semitransparente */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      {/* Contenido del loading */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-primary-700 animate-spin" />
        <p className="text-sm text-primary-800 font-medium">Cargando...</p>
      </div>
    </div>
  )
}
