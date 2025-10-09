/**
 * Página de Configuración
 * Placeholder para ajustes del sistema
 */

import { Header } from "@/components/layout/header"

export default function ConfiguracionPage() {
  return (
    <>
      <Header title="Configuración" subtitle="Ajusta las preferencias del sistema" notificationCount={2} />
      <div className="p-4 md:p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Configuración</h2>
          <p className="text-muted">Las opciones de configuración se agregarán próximamente</p>
        </div>
      </div>
    </>
  )
}
