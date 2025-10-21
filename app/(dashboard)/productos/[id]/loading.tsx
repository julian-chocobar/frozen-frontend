/**
 * Loading UI para la página de detalle de producto
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function ProductDetailLoading() {
  return (
    <>
      <Header title="Cargando producto..." subtitle="Preparando información del producto" />
      <PageLoader />
    </>
  )
}

