'use client';

/**
 * Página de Reportes y Analítica
 * Placeholder para el módulo de reportes
 */

import { Header } from "@/components/layout/header"

export default function ReportesPage() {
  return (
    <>
      <Header title="Reportes y Analítica" subtitle="Analiza el rendimiento de tu producción" />
      <div className="p-4 md:p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Módulo de Reportes</h2>
          <p className="text-muted">Los reportes y gráficos se implementarán próximamente</p>
        </div>
      </div>
    </>
  )
}
