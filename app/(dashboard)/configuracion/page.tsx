/**
 * Página de Configuración
 * Placeholder para ajustes del sistema
 */

import { Header } from "@/components/layout/header"
import { ConfigClient } from "./_components/config-client"

export default function ConfiguracionPage() {
  return (
    <>
      <Header title="Configuración" subtitle="Ajusta las preferencias del sistema" notificationCount={2} />
      <div className="p-4 md:p-6 space-y-6">
        <ConfigClient />
      </div>
    </>
  )
}
