/**
 * Página de Packaging
 */

import { Header } from "@/components/layout/header"
import { getPackagings } from "@/lib/packagings-api"
import { PackagingsClient } from "./_components/packagings-client"
import { PackagingCreateButton } from "./_components/create-button"
import { ErrorState } from "@/components/ui/error-state"
import { PaginationClient } from "@/components/ui/pagination-client"


interface PackagingPageProps {
  searchParams: Promise<{
    page?: string
    name?: string
    unitMeasurement?: string
    quantity?: string
  }>
}

export default async function PackagingPage({ searchParams }: PackagingPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '0')
  const name = params.name
  const unitMeasurement = params.unitMeasurement
  const quantity = params.quantity

  let packagingsData
  let error: string | null = null

  try {
    packagingsData = await getPackagings({ page, size: 10 })
  } catch (err) {
    console.error('Error al cargar packagings:', err)
    error = 'No se pudieron cargar los packagings'
  }
  return (
    <>
      <Header
        title="Packagings"
        subtitle="Administra todos los packagings disponibles"
        notificationCount={2}
        actionButton={<PackagingCreateButton />}
      />
      <div className="p-4 md:p-6 space-y-6">
        <div className="card border-2 border-primary-600 overflow-hidden">
              <div className="p-6 border-b border-stroke">
                <h2 className="text-xl font-semibold text-primary-900 mb-1">Packagings</h2>
                <p className="text-sm text-primary-600">Gestiona latas, botellas y otros envases</p>
        </div>

        {error ? (
                <ErrorState error={error} />
              ) : packagingsData ? (
                <PackagingsClient 
                  packagings={packagingsData.packagings} 
                  pagination={packagingsData.pagination}
                />
              ) : (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-primary-600">Cargando packagings...</p>
                </div>
              )}
        </div>
        {/* Contador de resultados y paginación */}
        {packagingsData && (
          <div className="text-center space-y-4">
            <p className="text-sm text-primary-700">
              Mostrando {packagingsData.packagings.length} packagings de {packagingsData.pagination.totalElements} totales
            </p>
            <PaginationClient 
              currentPage={packagingsData.pagination.currentPage}
              totalPages={packagingsData.pagination.totalPages}
            />
          </div>
        )}
      </div>
    </>
  )
}