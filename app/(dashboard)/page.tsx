/**
 * Página principal - Dashboard
 * Muestra estadísticas generales, gráficos y alertas
 */

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { UsageTrendsChart } from "@/components/dashboard/usage-trends-chart"
import { StockAlerts } from "@/components/dashboard/stock-alerts"
import { MaterialsSummary } from "@/components/dashboard/materials-summary"
import { Package, TrendingUp, AlertTriangle, Beaker } from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" notificationCount={2} />
      <div className="p-4 md:p-6 space-y-6">
        {/* Tarjetas de estadísticas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Lotes Activos" value={5} subtitle="En producción" icon={Beaker} variant="primary" />
          <StatCard title="En Fermentación" value={1} subtitle="Fase crítica" icon={TrendingUp} variant="default" />
          <StatCard
            title="Alertas Activas"
            value={2}
            subtitle="Requieren atención"
            icon={AlertTriangle}
            variant="alert"
          />
          <StatCard title="Volumen Total" value="2228L" subtitle="Litros en proceso" icon={Package} variant="success" />
        </div>

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
