/**
 * Loading UI para la página de producción
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function ProduccionLoading() {
  return (
    <>
      <Header title="Planificación de Producción" subtitle="Cargando órdenes..." />
      <PageLoader />
    </>
  )
}
