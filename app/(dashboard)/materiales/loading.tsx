/**
 * Loading UI para la página de materiales
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function MaterialesLoading() {
  return (
    <>
      <Header title="Inventario de Materiales" subtitle="Cargando inventario..." />
      <PageLoader />
    </>
  )
}
