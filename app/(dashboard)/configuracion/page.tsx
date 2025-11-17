/**
 * Página de Configuración
 * - Configuración de días laborales
 * - Gestión de sectores
 * - Gestión de parámetros de calidad
 */

import { Header } from "@/components/layout/header"
import { ConfigClient } from "./_components/config-client"
import { SectorsTab } from "./_components/sectors-tab"
import { QualityParametersTab } from "./_components/quality-parameters-tab"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar, Building2, CheckSquare } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <>
      <Header title="Configuración" subtitle="Ajusta las preferencias del sistema" />
      <div className="p-4 md:p-6 space-y-6">
        <Tabs defaultValue="working-days" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="working-days" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Días Laborales</span>
              <span className="sm:hidden">Días</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>Sectores</span>
            </TabsTrigger>
            <TabsTrigger value="quality-parameters" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Parámetros</span>
              <span className="sm:hidden">Parámetros</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="working-days">
            <ConfigClient />
          </TabsContent>

          <TabsContent value="sectors">
            <SectorsTab />
          </TabsContent>

          <TabsContent value="quality-parameters">
            <QualityParametersTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
