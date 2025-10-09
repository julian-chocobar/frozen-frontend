/**
 * Loading UI para la página de reportes
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function ReportesLoading() {
  return (
    <>
      <Header title="Reportes" subtitle="Generando reportes..." />
      <PageLoader />
    </>
  )
}
