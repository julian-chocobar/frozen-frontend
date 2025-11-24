/**
 * Página de Configuración
 * - Configuración de días laborales
 * - Gestión de sectores
 * - Gestión de parámetros de calidad
 */

import { Header } from "@/components/layout/header"
import { WorkingDaysTab } from "./_components/working-days-tab"
import { SectorsTab } from "./_components/sectors-tab"
import { QualityParametersTab } from "./_components/quality-parameters-tab"
import { PackagingsTab } from "./_components/packagings-tab"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar, Building2, CheckSquare, Package } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <>
      <Header title="Configuración" subtitle="Ajusta las preferencias del sistema" />
      <div className="p-4 md:p-6 space-y-6">
        <Tabs defaultValue="working-days" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="working-days" className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">Días Laborales</span>
              <span className="hidden sm:inline md:hidden">Días</span>
            </TabsTrigger>
            <TabsTrigger value="sectors" className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Sectores</span>
            </TabsTrigger>
            <TabsTrigger value="quality-parameters" className="flex items-center justify-center gap-1.5 sm:gap-2">
              <CheckSquare className="w-4 h-4 flex-shrink-0" />
              <span className="hidden md:inline">Parámetros</span>
              <span className="hidden sm:inline md:hidden">Parám.</span>
            </TabsTrigger>
            <TabsTrigger value="packagings" className="flex items-center justify-center gap-1.5 sm:gap-2">
              <Package className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Packagings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="working-days">
            <WorkingDaysTab />
          </TabsContent>

          <TabsContent value="sectors">
            <SectorsTab />
          </TabsContent>

          <TabsContent value="quality-parameters">
            <QualityParametersTab />
          </TabsContent>

          <TabsContent value="packagings">
            <PackagingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
