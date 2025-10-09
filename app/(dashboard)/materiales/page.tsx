/**
 * Página de Materias Primas
 * Muestra el inventario completo con filtros y búsqueda
 */

import { Header } from "@/components/layout/header"
import { MaterialsTable } from "@/components/materials/materials-table"
import { MaterialsCards } from "@/components/materials/materials-cards"
import { MaterialsFilters } from "@/components/materials/materials-filters"
import { mockMateriales } from "@/lib/mock-data"
import { Plus } from "lucide-react"

export default function MaterialesPage() {
  return (
    <>
      <Header
        title="Inventario de Materiales"
        subtitle="Administra tu stock de materias primas cerveceras"
        notificationCount={2}
        actionButton={
          <button
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            aria-label="Agregar nuevo material"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        }
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <MaterialsFilters />

        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <h2 className="text-xl font-semibold text-primary-900 mb-1">Materias Primas</h2>
            <p className="text-sm text-primary-600">Gestiona maltas, lúpulos, levaduras y otros insumos</p>
          </div>
          <MaterialsTable materiales={mockMateriales} />
          <MaterialsCards materiales={mockMateriales} />
        </div>

        {/* Contador de resultados */}
        <div className="text-center">
          <p className="text-sm text-primary-700">
            Mostrando {mockMateriales.length} materiales de {mockMateriales.length} totales
          </p>
        </div>
      </div>
    </>
  )
}
