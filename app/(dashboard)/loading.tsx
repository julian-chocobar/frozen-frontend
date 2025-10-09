/**
 * Loading UI para el dashboard
 * Se muestra automáticamente mientras se cargan las páginas del dashboard
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function DashboardLoading() {
  return (
    <>
      <Header title="Cargando..." subtitle="Preparando tu información" />
      <PageLoader />
    </>
  )
}
