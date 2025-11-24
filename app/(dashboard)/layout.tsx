/**
 * Layout principal del dashboard
 * - Incluye Sidebar (desktop) y BottomBar (mobile)
 * - Header con título dinámico
 * - Área de contenido principal
 */

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomBar } from "@/components/layout/bottom-bar"
import ProtectedRoute from "@/components/auth/protected-route"
import { NotificationsDebug } from "@/components/debug/notifications-debug"
import { ErrorBoundary } from "@/components/error-boundary"
import { TourProvider } from "@/contexts/tour-context"
import { TourNotification } from "@/components/tour/tour-notification"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <ErrorBoundary showDetails={true}>
        <TourProvider>
          <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Solo desktop */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* El Header se incluye en cada página para títulos dinámicos */}
              <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
                {children}
              </main>
            </div>

            {/* BottomBar - Solo móvil */}
            <BottomBar />
          </div>
          
          {/* Debug panel - Solo en desarrollo */}
          <NotificationsDebug />
          
          {/* Notificación de tour para nuevos usuarios */}
          <TourNotification />
        </TourProvider>
      </ErrorBoundary>
    </ProtectedRoute>
  )
}
