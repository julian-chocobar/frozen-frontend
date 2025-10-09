import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { NavigationProvider } from "@/components/providers/navigation-provider"
import { NavigationLoader } from "@/components/layout/navigation-loader"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Frozen - Gestión de Producción Cervecera",
  description: "Sistema de gestión de producción para cervecería artesanal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable}`}>
      <body className="antialiased font-sans">
        <NavigationProvider>
          <NavigationLoader />
          {children}
        </NavigationProvider>
      </body>
    </html>
  )
}
