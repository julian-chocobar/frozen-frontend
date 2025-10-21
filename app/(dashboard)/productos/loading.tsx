/**
 * Loading UI para la página de productos
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function ProductosLoading() {
  return (
    <>
      <Header title="Productos" subtitle="Cargando productos..." />
      <PageLoader />
    </>
  )
}

