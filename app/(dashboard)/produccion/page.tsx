/**
 * Página de Planificación de Producción
 * Gestiona las órdenes de producción de cerveza
 */

import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { OrderCard } from "@/components/production/order-card"
import { Plus } from "lucide-react"

export default function ProduccionPage() {
  return (
    <>
      <Header
        title="Planificación de Producción"
        subtitle="Gestiona las órdenes de producción de cerveza"
        notificationCount={2}
        actionButton={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nueva</span>
          </button>
        }
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Órdenes Activas" value="3" subtitle="En planificación o proceso" variant="primary" />
          <StatCard title="En Proceso" value="2" subtitle="Producción en curso" variant="default" />
          <StatCard title="Completadas" value="1" subtitle="Este mes" variant="default" />
          <StatCard title="Litros Planificados" value="1800" subtitle="Total en órdenes activas" variant="primary" />
        </div>

        {/* Sección de órdenes */}
        <div className="card p-6 border-2 border-primary-600">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Órdenes de Producción</h2>
            <p className="text-sm text-primary-600">Listado de todas las órdenes planificadas y en proceso</p>
          </div>

          <div className="space-y-4">
            <OrderCard
              id="OP-2025-001"
              beerType="IPA Americana"
              batchCode="IPA-2025-001"
              status="En Proceso"
              priority="Alta"
              startDate="14 sep 2025"
              estimatedEndDate="05 oct 2025"
              responsible="Juan Pérez"
              progress={65}
              quantity={500}
              notes="Dry hopping programado para el día 18"
            />
            <OrderCard
              id="OP-2025-002"
              beerType="Lager Clásica"
              batchCode="LAG-2025-012"
              status="Planificada"
              priority="Media"
              startDate="07 oct 2025"
              estimatedEndDate="04 nov 2025"
              responsible="María González"
              progress={0}
              quantity={800}
            />
            <OrderCard
              id="OP-2025-003"
              beerType="Stout Imperial"
              batchCode="STO-2025-005"
              status="En Proceso"
              priority="Alta"
              startDate="01 oct 2025"
              estimatedEndDate="15 nov 2025"
              responsible="Carlos Rodríguez"
              progress={35}
              quantity={500}
              notes="Fermentación a temperatura controlada 18°C"
            />
          </div>
        </div>
      </div>
    </>
  )
}
