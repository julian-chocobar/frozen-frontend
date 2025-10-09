/**
 * Loading UI para la página de configuración
 */

import { Header } from "@/components/layout/header"
import { PageLoader } from "@/components/ui/page-loader"

export default function ConfiguracionLoading() {
  return (
    <>
      <Header title="Configuración" subtitle="Cargando configuración..." />
      <PageLoader />
    </>
  )
}
