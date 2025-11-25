"use client"

/**
 * Componente para generar reportes PDF de las analíticas del dashboard
 * Incluye reportes generales y por fase para desperdicio y eficiencia
 */

import { useState, useCallback } from "react"
import { FileDown } from "lucide-react"
import { analyticsApi } from "@/lib/analytics"
import { MonthlyTotalDTO, Phase } from "@/types"
import { format } from "date-fns"
import { es } from "date-fns/locale/es"
import jsPDF from "jspdf"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const PHASES: Phase[] = [
  "MOLIENDA",
  "MACERACION",
  "FILTRACION",
  "COCCION",
  "FERMENTACION",
  "MADURACION",
  "GASIFICACION",
  "ENVASADO",
  "DESALCOHOLIZACION",
]

const PHASE_LABELS: Record<Phase, string> = {
  MOLIENDA: "Molienda",
  MACERACION: "Maceración",
  FILTRACION: "Filtración",
  COCCION: "Cocción",
  FERMENTACION: "Fermentación",
  MADURACION: "Maduración",
  GASIFICACION: "Gasificación",
  ENVASADO: "Envasado",
  DESALCOHOLIZACION: "Desalcoholización",
}

interface FilterState {
  preset?: string
  startDate?: string
  endDate?: string
  productId?: string
  materialId?: string
  phase?: string
  transferOnly?: boolean
}

/**
 * Obtiene el estado de filtros desde sessionStorage
 */
function getFilterStateFromStorage(key: string): FilterState {
  if (typeof window === "undefined") return {}
  try {
    const stored = sessionStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn(`Error al leer ${key} desde sessionStorage:`, e)
  }
  return {}
}

/**
 * Obtiene los filtros de fecha comunes de todos los gráficos
 * Busca en todas las posibles claves de sessionStorage usadas por AnalyticsFilters
 */
function getCommonDateFilters(): { startDate?: string; endDate?: string } {
  if (typeof window === "undefined") {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
    return {
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(now, "yyyy-MM-dd"),
    }
  }

  // Buscar en todas las posibles claves de sessionStorage
  // AnalyticsFilters usa claves dinámicas basadas en los filtros mostrados
  const possibleKeys: string[] = []
  
  // Generar todas las combinaciones posibles de claves
  const prefixes = ["analytics-filters-"]
  const suffixes = ["", "product", "material", "phase", "transfer", "productmaterial", "productphase", "materialphase", "productmaterialphase", "productmaterialphasetransfer"]
  
  for (const prefix of prefixes) {
    for (const suffix of suffixes) {
      possibleKeys.push(`${prefix}${suffix}`)
    }
  }

  // También buscar en claves específicas de cada gráfico
  possibleKeys.push("analytics-filters-state")
  possibleKeys.push("waste-chart-filters")
  possibleKeys.push("efficiency-chart-filters")
  possibleKeys.push("inventory-chart-filters")
  possibleKeys.push("usage-trends-chart-filters")

  // Buscar en todas las claves de sessionStorage que empiecen con "analytics-filters"
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith("analytics-filters")) {
        const state = getFilterStateFromStorage(key)
        if (state.startDate && state.endDate) {
          return {
            startDate: state.startDate,
            endDate: state.endDate,
          }
        }
      }
    }
  } catch (e) {
    console.warn("Error al buscar filtros en sessionStorage:", e)
  }

  // Si no hay filtros guardados, usar últimos 12 meses por defecto
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  return {
    startDate: format(start, "yyyy-MM-dd"),
    endDate: format(now, "yyyy-MM-dd"),
  }
}

/**
 * Formatea una fecha para mostrar en el PDF
 */
function formatDateForPDF(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00")
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

/**
 * Agrega una sección de título al PDF
 */
function addSectionTitle(pdf: jsPDF, y: number, title: string, fontSize = 16): number {
  pdf.setFontSize(fontSize)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text(title, 20, y)
  return y + 10
}

/**
 * Agrega texto al PDF
 */
function addText(pdf: jsPDF, y: number, text: string, fontSize = 10, bold = false): number {
  pdf.setFontSize(fontSize)
  pdf.setFont("helvetica", bold ? "bold" : "normal")
  pdf.setTextColor(0, 0, 0)
  pdf.text(text, 20, y)
  return y + fontSize * 0.5
}

/**
 * Agrega una tabla de datos al PDF
 */
function addDataTable(
  pdf: jsPDF,
  y: number,
  headers: string[],
  data: Array<Array<string | number>>,
  columnWidths: number[]
): number {
  const startX = 20
  const rowHeight = 8
  const headerHeight = 10

  // Encabezados
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(255, 255, 255)
  let x = startX
  headers.forEach((header, i) => {
    pdf.setFillColor(66, 66, 66)
    pdf.rect(x, y - headerHeight, columnWidths[i], headerHeight, "F")
    pdf.text(header, x + 2, y - 3, { maxWidth: columnWidths[i] - 4 })
    x += columnWidths[i]
  })

  // Datos
  pdf.setFont("helvetica", "normal")
  pdf.setTextColor(0, 0, 0)
  let currentY = y
  data.forEach((row) => {
    x = startX
    row.forEach((cell, i) => {
      pdf.setFillColor(245, 245, 245)
      pdf.rect(x, currentY, columnWidths[i], rowHeight, "F")
      pdf.text(String(cell), x + 2, currentY + 6, { maxWidth: columnWidths[i] - 4 })
      x += columnWidths[i]
    })
    currentY += rowHeight
  })

  return currentY + 5
}

/**
 * Agrega un gráfico de barras al PDF
 */
function addBarChart(
  pdf: jsPDF,
  y: number,
  data: Array<{ month: string; value: number }>,
  color: [number, number, number],
  maxWidth: number = 170,
  maxHeight: number = 40
): number {
  if (data.length === 0) return y

  const startX = 20
  const chartHeight = maxHeight
  const chartWidth = maxWidth
  const barSpacing = 2
  const barWidth = (chartWidth - (data.length - 1) * barSpacing) / data.length
  const maxValue = Math.max(...data.map((d) => d.value), 1)

  // Dibujar ejes
  pdf.setDrawColor(200, 200, 200)
  pdf.setLineWidth(0.5)
  // Eje Y (vertical)
  pdf.line(startX, y, startX, y + chartHeight)
  // Eje X (horizontal)
  pdf.line(startX, y + chartHeight, startX + chartWidth, y + chartHeight)

  // Dibujar barras
  let currentX = startX
  data.forEach((item) => {
    const barHeight = (item.value / maxValue) * chartHeight
    const barY = y + chartHeight - barHeight

    // Barra
    pdf.setFillColor(color[0], color[1], color[2])
    pdf.rect(currentX, barY, barWidth, barHeight, "F")

    // Etiqueta del mes (abajo)
    pdf.setFontSize(7)
    pdf.setTextColor(0, 0, 0)
    pdf.setFont("helvetica", "normal")
    // Formatear mes: si es YYYY-MM, mostrar solo MM, sino mostrar el valor completo
    let monthLabel = item.month
    if (item.month && item.month.length >= 7 && item.month.includes("-")) {
      // Formato YYYY-MM, extraer solo el mes
      const parts = item.month.split("-")
      if (parts.length >= 2) {
        const monthNum = parseInt(parts[1], 10)
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        monthLabel = monthNames[monthNum - 1] || parts[1]
      }
    }
    pdf.text(monthLabel, currentX + barWidth / 2, y + chartHeight + 5, {
      align: "center",
      maxWidth: barWidth,
    })

    // Valor en la parte superior de la barra
    pdf.setFontSize(7)
    pdf.setTextColor(0, 0, 0)
    const valueLabel = item.value.toFixed(1)
    if (barHeight > 8) {
      // Solo mostrar valor si la barra es lo suficientemente alta
      pdf.text(valueLabel, currentX + barWidth / 2, barY - 2, {
        align: "center",
        maxWidth: barWidth,
      })
    }

    currentX += barWidth + barSpacing
  })

  // Título del gráfico (opcional, se puede agregar arriba)
  return y + chartHeight + 15
}

/**
 * Analiza si una fase es problemática basándose en la eficiencia
 */
function isProblematicPhase(efficiency: number): boolean {
  return efficiency < 60
}

/**
 * Genera el PDF del reporte completo
 */
async function generateReportPDF(
  dateFilters: { startDate: string; endDate: string },
  onProgress?: (message: string) => void
): Promise<void> {
  const pdf = new jsPDF()
  let y = 20
  const pageHeight = pdf.internal.pageSize.height
  const margin = 20
  const footerHeight = 25 // Altura reservada para el footer (15px posición + 10px margen)

  // Título principal
  pdf.setFontSize(20)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(0, 0, 0)
  pdf.text("Reporte de Analíticas del Dashboard", 20, y)
  y += 10

  // Período del reporte
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text(
    `Período: ${formatDateForPDF(dateFilters.startDate)} - ${formatDateForPDF(dateFilters.endDate)}`,
    20,
    y
  )
  y += 15

  // Información sobre eficiencia
  onProgress?.("Agregando información sobre eficiencia...")
  y = addSectionTitle(pdf, y, "Valores Normales de Eficiencia", 14)
  y = addText(
    pdf,
    y,
    "La eficiencia mide cuánto producto terminado se obtiene de los materiales utilizados.",
    10
  )
  y = addText(pdf, y, "Interpretación de los porcentajes:", 10, true)
  y = addText(pdf, y, "• 60-75%: Eficiencia normal (pérdidas naturales del procesamiento)", 10)
  y = addText(pdf, y, "• 75-85%: Muy buena eficiencia", 10)
  y = addText(pdf, y, "• < 60%: Revisar procesos, hay mucho desperdicio (PROBLEMÁTICO)", 10)
  y = addText(pdf, y, "• > 85%: Excelente eficiencia", 10)
  y += 10

  // Verificar si necesitamos nueva página (reservando espacio para el footer)
  if (y > pageHeight - footerHeight - 10) {
    pdf.addPage()
    y = 20
  }

  // 1. PRODUCCIÓN
  onProgress?.("Obteniendo datos de producción...")
  y = addSectionTitle(pdf, y, "1. Producción Mensual", 14)
  try {
    const productionData = await analyticsApi.getMonthlyProduction(dateFilters)
    if (productionData.length > 0) {
      const total = productionData.reduce((sum, item) => sum + (item.total || 0), 0)
      y = addText(pdf, y, `Total del período: ${total.toFixed(2)} L`, 10, true)
      y += 5

      const tableData = productionData.map((item) => [
        item.month || "",
        `${(item.total || 0).toFixed(2)} L`,
      ])
      y = addDataTable(
        pdf,
        y + 10,
        ["Mes", "Producción (L)"],
        tableData,
        [80, 50]
      )
      
      // Agregar gráfico de barras
      if (y > pageHeight - footerHeight - 60) {
        pdf.addPage()
        y = 20
      }
      y = addText(pdf, y, "Gráfico de Producción Mensual", 10, true)
      const productionChartData = productionData.map((item) => ({
        month: item.month || "",
        value: item.total || 0,
      }))
      y = addBarChart(pdf, y + 5, productionChartData, [59, 130, 246]) // Azul para producción
    } else {
      y = addText(pdf, y, "No hay datos disponibles", 10)
    }
  } catch (error) {
    y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
  }
  y += 10

  if (y > pageHeight - footerHeight - 10) {
    pdf.addPage()
    y = 20
  }

  // 2. CONSUMO DE MATERIALES
  onProgress?.("Obteniendo datos de consumo...")
  y = addSectionTitle(pdf, y, "2. Consumo de Materiales Mensual", 14)
  try {
    const consumptionData = await analyticsApi.getMonthlyMaterialConsumption(dateFilters)
    if (consumptionData.length > 0) {
      const total = consumptionData.reduce((sum, item) => sum + (item.total || 0), 0)
      y = addText(pdf, y, `Total del período: ${total.toFixed(2)} kg`, 10, true)
      y += 5

      const tableData = consumptionData.map((item) => [
        item.month || "",
        `${(item.total || 0).toFixed(2)} kg`,
      ])
      y = addDataTable(
        pdf,
        y + 10,
        ["Mes", "Consumo (kg)"],
        tableData,
        [80, 50]
      )
      
      // Agregar gráfico de barras
      if (y > pageHeight - footerHeight - 60) {
        pdf.addPage()
        y = 20
      }
      y = addText(pdf, y, "Gráfico de Consumo Mensual", 10, true)
      const consumptionChartData = consumptionData.map((item) => ({
        month: item.month || "",
        value: item.total || 0,
      }))
      y = addBarChart(pdf, y + 5, consumptionChartData, [249, 115, 22]) // Naranja para consumo
    } else {
      y = addText(pdf, y, "No hay datos disponibles", 10)
    }
  } catch (error) {
    y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
  }
  y += 10

  if (y > pageHeight - footerHeight - 10) {
    pdf.addPage()
    y = 20
  }

  // 3. DESPERDICIOS - General
  onProgress?.("Obteniendo datos de desperdicios...")
  y = addSectionTitle(pdf, y, "3. Desperdicios Mensuales - General", 14)
  try {
    const wasteData = await analyticsApi.getMonthlyWaste(dateFilters)
    if (wasteData.length > 0) {
      const total = wasteData.reduce((sum, item) => sum + (item.total || 0), 0)
      y = addText(pdf, y, `Total del período: ${total.toFixed(2)} L`, 10, true)
      y += 5

      const tableData = wasteData.map((item) => [
        item.month || "",
        `${(item.total || 0).toFixed(2)} L`,
      ])
      y = addDataTable(
        pdf,
        y + 10,
        ["Mes", "Desperdicios (L)"],
        tableData,
        [80, 50]
      )
      
      // Agregar gráfico de barras
      if (y > pageHeight - footerHeight - 60) {
        pdf.addPage()
        y = 20
      }
      y = addText(pdf, y, "Gráfico de Desperdicios Mensuales", 10, true)
      const wasteChartData = wasteData.map((item) => ({
        month: item.month || "",
        value: item.total || 0,
      }))
      y = addBarChart(pdf, y + 5, wasteChartData, [239, 68, 68]) // Rojo para desperdicios
    } else {
      y = addText(pdf, y, "No hay datos disponibles", 10)
    }
  } catch (error) {
    y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
  }
  y += 10

  // 3.1. DESPERDICIOS - Solo Transferencias
  if (y > pageHeight - footerHeight - 10) {
    pdf.addPage()
    y = 20
  }
  onProgress?.("Obteniendo datos de desperdicios por transferencias...")
  y = addSectionTitle(pdf, y, "3.1. Desperdicios por Transferencias", 14)
  try {
    const transferWasteData = await analyticsApi.getMonthlyWaste({
      ...dateFilters,
      transferOnly: true,
    })
    if (transferWasteData.length > 0) {
      const total = transferWasteData.reduce((sum, item) => sum + (item.total || 0), 0)
      y = addText(pdf, y, `Total del período: ${total.toFixed(2)} L`, 10, true)
      y += 5

      const tableData = transferWasteData.map((item) => [
        item.month || "",
        `${(item.total || 0).toFixed(2)} L`,
      ])
      y = addDataTable(
        pdf,
        y + 10,
        ["Mes", "Desperdicios (L)"],
        tableData,
        [80, 50]
      )
      
      // Agregar gráfico de barras
      if (y > pageHeight - footerHeight - 60) {
        pdf.addPage()
        y = 20
      }
      y = addText(pdf, y, "Gráfico de Desperdicios por Transferencias", 10, true)
      const transferChartData = transferWasteData.map((item) => ({
        month: item.month || "",
        value: item.total || 0,
      }))
      y = addBarChart(pdf, y + 5, transferChartData, [239, 68, 68]) // Rojo para desperdicios
    } else {
      y = addText(pdf, y, "No hay datos disponibles", 10)
    }
  } catch (error) {
    y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
  }
  y += 10

  // 3.2. DESPERDICIOS - Por Fase
  for (const phase of PHASES) {
    if (y > pageHeight - footerHeight - 10) {
      pdf.addPage()
      y = 20
    }
    onProgress?.(`Obteniendo datos de desperdicios para ${PHASE_LABELS[phase]}...`)
    y = addSectionTitle(pdf, y, `3.2. Desperdicios - ${PHASE_LABELS[phase]}`, 14)
    try {
      const phaseWasteData = await analyticsApi.getMonthlyWaste({
        ...dateFilters,
        phase,
      })
      if (phaseWasteData.length > 0) {
        const total = phaseWasteData.reduce((sum, item) => sum + (item.total || 0), 0)
        y = addText(pdf, y, `Total del período: ${total.toFixed(2)} L`, 10, true)
        y += 5

        const tableData = phaseWasteData.map((item) => [
          item.month || "",
          `${(item.total || 0).toFixed(2)} L`,
        ])
        y = addDataTable(
          pdf,
          y + 10,
          ["Mes", "Desperdicios (L)"],
          tableData,
          [80, 50]
        )
        
        // Agregar gráfico de barras
        if (y > pageHeight - footerHeight - 60) {
          pdf.addPage()
          y = 20
        }
        y = addText(pdf, y, `Gráfico de Desperdicios - ${PHASE_LABELS[phase]}`, 10, true)
        const phaseWasteChartData = phaseWasteData.map((item) => ({
          month: item.month || "",
          value: item.total || 0,
        }))
        y = addBarChart(pdf, y + 5, phaseWasteChartData, [239, 68, 68]) // Rojo para desperdicios
      } else {
        y = addText(pdf, y, "No hay datos disponibles", 10)
      }
    } catch (error) {
      y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
    }
    y += 10
  }

  // 4. EFICIENCIA - General
  if (y > pageHeight - footerHeight - 10) {
    pdf.addPage()
    y = 20
  }
  onProgress?.("Obteniendo datos de eficiencia...")
  y = addSectionTitle(pdf, y, "4. Eficiencia Mensual - General", 14)
  try {
    const efficiencyData = await analyticsApi.getMonthlyEfficiency(dateFilters)
    if (efficiencyData.length > 0) {
      const avg = efficiencyData.reduce((sum, item) => sum + (item.total || 0), 0) / efficiencyData.length
      y = addText(pdf, y, `Promedio del período: ${avg.toFixed(2)}%`, 10, true)
      if (avg < 60) {
        y = addText(pdf, y, "⚠️ ATENCIÓN: Eficiencia por debajo del rango normal (< 60%)", 10)
        pdf.setTextColor(255, 0, 0)
      }
      pdf.setTextColor(0, 0, 0)
      y += 5

      const tableData = efficiencyData.map((item) => [
        item.month || "",
        `${(item.total || 0).toFixed(2)}%`,
      ])
      y = addDataTable(
        pdf,
        y + 10,
        ["Mes", "Eficiencia (%)"],
        tableData,
        [80, 50]
      )
      
      // Agregar gráfico de barras
      if (y > pageHeight - footerHeight - 60) {
        pdf.addPage()
        y = 20
      }
      y = addText(pdf, y, "Gráfico de Eficiencia Mensual", 10, true)
      const efficiencyChartData = efficiencyData.map((item) => ({
        month: item.month || "",
        value: item.total || 0,
      }))
      y = addBarChart(pdf, y + 5, efficiencyChartData, [34, 197, 94]) // Verde para eficiencia
    } else {
      y = addText(pdf, y, "No hay datos disponibles", 10)
    }
  } catch (error) {
    y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
  }
  y += 10

  // 4.1. EFICIENCIA - Por Fase
  const problematicPhases: string[] = []
  for (const phase of PHASES) {
    if (y > pageHeight - footerHeight - 10) {
      pdf.addPage()
      y = 20
    }
    onProgress?.(`Obteniendo datos de eficiencia para ${PHASE_LABELS[phase]}...`)
    y = addSectionTitle(pdf, y, `4.1. Eficiencia - ${PHASE_LABELS[phase]}`, 14)
    try {
      const phaseEfficiencyData = await analyticsApi.getMonthlyEfficiency({
        ...dateFilters,
        phase,
      })
      if (phaseEfficiencyData.length > 0) {
        const avg =
          phaseEfficiencyData.reduce((sum, item) => sum + (item.total || 0), 0) /
          phaseEfficiencyData.length
        y = addText(pdf, y, `Promedio del período: ${avg.toFixed(2)}%`, 10, true)
        
        if (isProblematicPhase(avg)) {
          problematicPhases.push(PHASE_LABELS[phase])
          y = addText(pdf, y, "⚠️ PROBLEMÁTICA: Eficiencia < 60%", 10)
          pdf.setTextColor(255, 0, 0)
        }
        pdf.setTextColor(0, 0, 0)
        y += 5

        const tableData = phaseEfficiencyData.map((item) => [
          item.month || "",
          `${(item.total || 0).toFixed(2)}%`,
        ])
        y = addDataTable(
          pdf,
          y + 10,
          ["Mes", "Eficiencia (%)"],
          tableData,
          [80, 50]
        )
        
        // Agregar gráfico de barras
        if (y > pageHeight - footerHeight - 60) {
          pdf.addPage()
          y = 20
        }
        y = addText(pdf, y, `Gráfico de Eficiencia - ${PHASE_LABELS[phase]}`, 10, true)
        const phaseEfficiencyChartData = phaseEfficiencyData.map((item) => ({
          month: item.month || "",
          value: item.total || 0,
        }))
        y = addBarChart(pdf, y + 5, phaseEfficiencyChartData, [34, 197, 94]) // Verde para eficiencia
      } else {
        y = addText(pdf, y, "No hay datos disponibles", 10)
      }
    } catch (error) {
      y = addText(pdf, y, `Error al cargar datos: ${error}`, 10)
    }
    y += 10
  }

  // Resumen de fases problemáticas
  if (problematicPhases.length > 0) {
    if (y > pageHeight - footerHeight - 10) {
      pdf.addPage()
      y = 20
    }
    y = addSectionTitle(pdf, y, "Resumen: Fases Problemáticas", 14)
    pdf.setTextColor(255, 0, 0)
    y = addText(
      pdf,
      y,
      `Las siguientes fases presentan eficiencia por debajo del 60%:`,
      10,
      true
    )
    pdf.setTextColor(0, 0, 0)
    problematicPhases.forEach((phase) => {
      y = addText(pdf, y, `• ${phase}`, 10)
    })
    y = addText(
      pdf,
      y,
      "Se recomienda revisar los procesos de estas fases para identificar oportunidades de mejora.",
      10
    )
  }

  // Pie de página - agregar en todas las páginas
  const totalPages = pdf.getNumberOfPages()
  const footerY = pdf.internal.pageSize.height - 15 // Posición del footer con más espacio
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(128, 128, 128)
    pdf.setFont("helvetica", "normal")
    
    // Línea separadora del footer
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.5)
    pdf.line(20, footerY - 3, pdf.internal.pageSize.width - 20, footerY - 3)
    
    // Texto del footer
    pdf.text(
      `Página ${i} de ${totalPages}`,
      pdf.internal.pageSize.width - 40,
      footerY
    )
    pdf.text(
      `Generado el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      20,
      footerY
    )
  }

  // Descargar el PDF
  const fileName = `reporte-analiticas-${format(new Date(), "yyyy-MM-dd")}.pdf`
  pdf.save(fileName)
}

interface ReportPdfGeneratorProps {
  className?: string
}

export function ReportPdfGenerator({ className }: ReportPdfGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progressMessage, setProgressMessage] = useState<string>("")

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    setProgressMessage("Iniciando generación del reporte...")

    try {
      const dateFilters = getCommonDateFilters()
      await generateReportPDF(dateFilters, (message) => {
        setProgressMessage(message)
      })
      setProgressMessage("Reporte generado exitosamente")
      // Limpiar el mensaje después de un breve delay
      setTimeout(() => {
        setProgressMessage("")
        setIsGenerating(false)
      }, 1500)
    } catch (error) {
      console.error("Error al generar el reporte:", error)
      setProgressMessage(`Error: ${error}`)
      setTimeout(() => {
        setProgressMessage("")
        setIsGenerating(false)
      }, 3000)
    }
  }, [])

  // Determinar el texto a mostrar en el botón
  const getButtonText = () => {
    if (isGenerating) {
      if (progressMessage) {
        // Truncar mensajes muy largos para mobile
        const maxLength = 30
        if (progressMessage.length > maxLength) {
          return progressMessage.substring(0, maxLength) + "..."
        }
        return progressMessage
      }
      return "Generando reporte..."
    }
    return "Generar Reporte PDF"
  }

  return (
    <div className={cn("flex justify-end w-full sm:w-auto", className)} data-tour="dashboard-pdf-generator">
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        size="lg"
        variant="outline"
        className="w-full sm:w-auto sm:min-w-[200px] border-primary-300 text-primary-700 hover:bg-primary-50"
      >
        {isGenerating ? (
          <div className="flex items-center gap-2 w-full justify-center">
            <div className="w-5 h-5 border-2 border-primary-200 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="truncate text-sm sm:text-base">{getButtonText()}</span>
          </div>
        ) : (
          <>
            <FileDown className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">Generar Reporte PDF</span>
            <span className="sm:hidden">Generar PDF</span>
          </>
        )}
      </Button>
    </div>
  )
}

