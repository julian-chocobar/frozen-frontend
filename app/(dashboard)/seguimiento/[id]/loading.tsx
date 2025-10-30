/**
 * Loading state para página de detalle de lote
 * Muestra skeleton mientras carga la información del lote
 */

import { Header } from "@/components/layout/header"
import { ArrowLeft } from "lucide-react"

export default function LoteDetailLoading() {
  return (
    <>
      <Header title="Cargando..." subtitle="Obteniendo información del lote" />
      <div className="p-4 md:p-6">
        {/* Botón volver skeleton */}
        <div className="inline-flex items-center gap-2 mb-6">
          <ArrowLeft className="w-4 h-4 text-muted" />
          <div className="h-5 w-40 bg-surface-secondary rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información general skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-48 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-surface-secondary rounded mb-2 animate-pulse" />
                    <div className="h-5 w-32 bg-surface-secondary rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Progreso skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-56 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="h-3 w-full bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-surface-secondary rounded animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-20 bg-surface-secondary rounded mb-1 animate-pulse" />
                      <div className="h-5 w-24 bg-surface-secondary rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Materiales skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-48 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-5 h-5 bg-stroke rounded animate-pulse" />
                      <div className="flex-1">
                        <div className="h-5 w-32 bg-stroke rounded mb-1 animate-pulse" />
                        <div className="h-4 w-24 bg-stroke rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-16 bg-stroke rounded mb-1 animate-pulse" />
                      <div className="h-4 w-12 bg-stroke rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Estado skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-32 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="h-10 w-24 bg-surface-secondary rounded animate-pulse" />
            </div>

            {/* Parámetros skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-40 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-secondary rounded-lg animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-20 bg-surface-secondary rounded mb-1 animate-pulse" />
                      <div className="h-6 w-16 bg-surface-secondary rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsable skeleton */}
            <div className="card p-6 border-2 border-primary-600">
              <div className="h-6 w-32 bg-surface-secondary rounded mb-4 animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-surface-secondary rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-surface-secondary rounded mb-1 animate-pulse" />
                  <div className="h-4 w-28 bg-surface-secondary rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
