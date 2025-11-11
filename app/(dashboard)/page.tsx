/**
 * Página principal - Dashboard
 * Muestra estadísticas generales, gráficos y alertas
 */

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { UsageTrendsChart } from "@/components/dashboard/usage-trends-chart"
import { StockAlerts } from "@/components/dashboard/stock-alerts"
import { MaterialsSummary } from "@/components/dashboard/materials-summary"
import { Package, TrendingUp, AlertTriangle, Beaker } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
      <div className="p-4 md:p-6 space-y-6 text-primary-900">
        {/* Tarjetas de estadísticas principales */}
        <StatsCarousel>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Lotes Activos" 
              value={5} 
              subtitle="En producción" 
              icon={Beaker} 
              variant="primary" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="En Fermentación" 
              value={1} 
              subtitle="Fase crítica" 
              icon={TrendingUp} 
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard
              title="Alertas Activas"
              value={2}
              subtitle="Requieren atención"
              icon={AlertTriangle}
              variant="alert"
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Volumen Total" 
              value="2228L" 
              subtitle="Litros en proceso" 
              icon={Package} 
              variant="success" 
            />
          </div>
        </StatsCarousel>

        {/* Gráficos y resúmenes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Gráficos grandes */}
          <div className="lg:col-span-2 space-y-6">
            <InventoryChart />
            <UsageTrendsChart />
          </div>

          {/* Columna derecha - Resúmenes y alertas */}
          <div className="space-y-6">
            <MaterialsSummary />
            <StockAlerts />
          </div>
        </div>
      </div>
    </>
  )
}
