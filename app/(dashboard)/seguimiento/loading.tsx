/**
 * Loading UI para la página de seguimiento
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function SeguimientoLoading() {
  return (
    <>
      <Header title="Seguimiento de Producción" subtitle="Cargando lotes..." />
      <PageLoader />
    </>
  )
}
