/**
 * Página de detalle de lote
 * Muestra información completa de un lote específico
 */

import { Header } from "@/components/layout/header"
import { mockLotes } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { ArrowLeft, Thermometer, Droplet, Calendar, User, Package, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatearFecha, cn } from "@/lib/utils"

interface PageProps {
  params: {
    id: string
  }
}

export default async function LoteDetailPage({ params }: PageProps) {
  // Asegurarse de que params esté disponible
  const { id } = await params;
  const lote = mockLotes.find((l) => l.id === id);
  
  if (!lote) {
    notFound()
  }

  const hasAlerts = lote.alertas && lote.alertas.length > 0

  return (
    <>
      <Header title={`Lote ${lote.codigo}`} subtitle={lote.nombreProducto} notificationCount={2} />
      <div className="p-4 md:p-6">
        {/* Botón volver */}
        <Link
          href="/seguimiento"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Seguimiento
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información general */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Información General</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Código de Lote</p>
                  <p className="text-sm font-bold text-foreground font-mono">{lote.codigo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Orden de Producción</p>
                  <p className="text-sm font-bold text-foreground font-mono">{lote.ordenProduccionId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Producto</p>
                  <p className="text-sm font-medium text-foreground">{lote.nombreProducto}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Tipo</p>
                  <p className="text-sm font-medium text-primary-700">{lote.tipoProducto}</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Volumen Objetivo</p>
                  <p className="text-sm font-bold text-foreground">{lote.volumenObjetivo}L</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Volumen Real</p>
                  <p className="text-sm font-bold text-foreground">{lote.volumenReal || "-"}L</p>
                </div>
              </div>
            </div>

            {/* Progreso */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Progreso de Producción</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted">Etapa: {lote.etapaActual}</p>
                  <p className="text-sm font-bold text-primary-600">{lote.progreso}%</p>
                </div>
                <div className="w-full bg-surface-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${lote.progreso}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted" />
                  <div>
                    <p className="text-xs text-muted">Fecha de Inicio</p>
                    <p className="text-sm font-medium text-foreground">{formatearFecha(lote.fechaInicio)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted" />
                  <div>
                    <p className="text-xs text-muted">Fin Estimado</p>
                    <p className="text-sm font-medium text-foreground">{formatearFecha(lote.fechaFinEstimada)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Materiales utilizados */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Materiales Utilizados</h3>
              <div className="space-y-3">
                {lote.materiales.map((material, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{material.nombreMaterial}</p>
                        <p className="text-xs text-muted">
                          Planificado: {material.cantidadPlanificada} {material.unidad}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        {material.cantidadUsada || 0} {material.unidad}
                      </p>
                      <p className="text-xs text-muted">Usado</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-6">
            {/* Estado */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Estado Actual</h3>
              <span
                className={cn(
                  "badge text-base px-4 py-2",
                  lote.estado === "Fermentación" && "badge-primary",
                  lote.estado === "En Producción" && "badge-status",
                )}
              >
                {lote.estado}
              </span>
            </div>

            {/* Parámetros */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Parámetros Actuales</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Temperatura</p>
                    <p className="text-lg font-bold text-foreground">{lote.temperatura}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">pH</p>
                    <p className="text-lg font-bold text-foreground">{lote.ph}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Responsable */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Responsable</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{lote.responsable}</p>
                  <p className="text-xs text-muted">Maestro Cervecero</p>
                </div>
              </div>
            </div>

            {/* Alertas */}
            {hasAlerts && (
              <div className="card p-6 border-alert-300 bg-alert-50/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-alert-600" />
                  <h3 className="text-lg font-semibold text-foreground">Alertas</h3>
                </div>
                <div className="space-y-2">
                  {lote.alertas!.map((alerta, idx) => (
                    <div key={idx} className="p-3 bg-white border border-alert-200 rounded-lg">
                      <p className="text-sm font-medium text-alert-700">{alerta}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
