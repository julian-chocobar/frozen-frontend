'use client';

/**
 * Página de Seguimiento de Producción
 * Muestra todos los lotes activos con su progreso y estado
 */

import { Header } from "@/components/layout/header"
import { BatchStats } from "@/components/production/batch-stats"
import { BatchCard } from "@/components/production/batch-card"
import { mockLotes } from "@/lib/mock-data"

export default function SeguimientoPage() {
  // Calcular estadísticas
  const lotesActivos = mockLotes.filter((l) => l.estado !== "Completado" && l.estado !== "Cancelado").length
  const enFermentacion = mockLotes.filter((l) => l.etapaActual === "Fermentación").length
  const alertasActivas = mockLotes.filter((l) => l.alertas && l.alertas.length > 0).length
  const volumenTotal = mockLotes.reduce((sum, l) => sum + (l.volumenReal || l.volumenObjetivo), 0)

  return (
    <>
      <Header
        title="Seguimiento de Producción"
        subtitle="Monitorea el progreso de los lotes en tiempo real"
        notificationCount={2}
      />
      <div className="p-4 md:p-6">
        {/* Estadísticas */}
        <BatchStats
          lotesActivos={lotesActivos}
          enFermentacion={enFermentacion}
          alertasActivas={alertasActivas}
          volumenTotal={volumenTotal}
        />

        {/* Título de sección */}
        <div className="card p-6 border-2 border-primary-600 mb-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-1">Lotes en Producción</h2>
          <p className="text-sm text-primary-600">Monitoreo en tiempo real de todos los lotes activos</p>
        </div>

        {/* Grid de lotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockLotes.map((lote) => (
            <BatchCard key={lote.id} lote={lote} />
          ))}
        </div>
      </div>
    </>
  )
}
