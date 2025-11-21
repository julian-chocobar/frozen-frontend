"use client"

/**
 * Componente de filtros reutilizable para analytics
 * Incluye rangos de fechas predefinidos y selectores de entidades
 * Similar a compact-filters.tsx - requiere presionar "Buscar" para aplicar cambios
 */

import { useState, useEffect, useRef } from "react"
import { Calendar, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears, format } from "date-fns"

export type DateRangePreset = 
  | "Este Mes"
  | "Últimos 3 Meses"
  | "Este Año"
  | "Año Anterior"
  | "Últimos 12 Meses"
  | "Personalizado"

export interface AnalyticsFiltersState {
  startDate?: string
  endDate?: string
  preset?: DateRangePreset
  productId?: string
  materialId?: string
  phase?: string
  transferOnly?: boolean
}

interface AnalyticsFiltersProps {
  onFiltersChange: (filters: AnalyticsFiltersState) => void
  onSearch: (filters: AnalyticsFiltersState) => void
  onClear: () => void
  showProductFilter?: boolean
  showMaterialFilter?: boolean
  showPhaseFilter?: boolean
  showTransferOnly?: boolean
  productFilterComponent?: React.ReactNode // Componente personalizado para filtro de productos
  materialFilterComponent?: React.ReactNode // Componente personalizado para filtro de materiales
  className?: string
}

const presets: { label: DateRangePreset; getDates: () => { start: Date; end: Date } }[] = [
  {
    label: "Este Mes",
    getDates: () => ({
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "Últimos 3 Meses",
    getDates: () => ({
      start: startOfMonth(subMonths(new Date(), 2)),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "Este Año",
    getDates: () => ({
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    }),
  },
  {
    label: "Año Anterior",
    getDates: () => {
      const lastYear = subYears(new Date(), 1)
      return {
        start: startOfYear(lastYear),
        end: endOfYear(lastYear),
      }
    },
  },
  {
    label: "Últimos 12 Meses",
    getDates: () => ({
      start: startOfMonth(subMonths(new Date(), 11)),
      end: endOfMonth(new Date()),
    }),
  },
  {
    label: "Personalizado",
    getDates: () => ({
      start: startOfMonth(subMonths(new Date(), 11)),
      end: endOfMonth(new Date()),
    }),
  },
]

// Función helper para obtener valores iniciales
const getDefaultValues = () => {
  const defaultPreset = presets.find((p) => p.label === "Últimos 12 Meses")
  if (defaultPreset) {
    const { start, end } = defaultPreset.getDates()
    return {
      preset: "Últimos 12 Meses" as DateRangePreset,
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    }
  }
  return {
    preset: "Últimos 12 Meses" as DateRangePreset,
    startDate: "",
    endDate: "",
  }
}

export function AnalyticsFilters({
  onFiltersChange,
  onSearch,
  onClear,
  showProductFilter = false,
  showMaterialFilter = false,
  showPhaseFilter = false,
  showTransferOnly = false,
  productFilterComponent,
  materialFilterComponent,
  className,
}: AnalyticsFiltersProps) {
  // Inicializar valores por defecto directamente
  const defaultValues = getDefaultValues()
  
  // Estado local de los filtros (no se aplican hasta presionar "Buscar")
  const [preset, setPreset] = useState<DateRangePreset>(defaultValues.preset)
  const [startDate, setStartDate] = useState<string>(defaultValues.startDate)
  const [endDate, setEndDate] = useState<string>(defaultValues.endDate)
  const [productId, setProductId] = useState<string>("")
  const [materialId, setMaterialId] = useState<string>("")
  const [phase, setPhase] = useState<string>("")
  const [transferOnly, setTransferOnly] = useState<boolean>(false)

  // Valores iniciales para comparar si hay cambios
  const initialValues = useRef<AnalyticsFiltersState>({
    ...defaultValues,
    productId: "",
    materialId: "",
    phase: "",
    transferOnly: false,
  })

  // Flag para saber si ya se inicializó
  const isInitialized = useRef(false)

  // Inicializar y aplicar valores por defecto solo una vez al montar
  useEffect(() => {
    if (isInitialized.current) return
    
    // Aplicar valores iniciales automáticamente al montar
    onFiltersChange(initialValues.current)
    isInitialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // onFiltersChange no debe causar re-ejecución

  // Verificar si hay cambios respecto a los valores aplicados en la última búsqueda
  const hasChanges = () => {
    const current: AnalyticsFiltersState = {
      preset,
      startDate,
      endDate,
      productId: showProductFilter ? productId : "",
      materialId: showMaterialFilter ? materialId : "",
      phase: showPhaseFilter ? phase : "",
      transferOnly: showTransferOnly ? transferOnly : false,
    }

    const applied: AnalyticsFiltersState = {
      preset: initialValues.current.preset || "Últimos 12 Meses",
      startDate: initialValues.current.startDate || "",
      endDate: initialValues.current.endDate || "",
      productId: initialValues.current.productId || "",
      materialId: initialValues.current.materialId || "",
      phase: initialValues.current.phase || "",
      transferOnly: initialValues.current.transferOnly || false,
    }

    // Comparar solo los campos relevantes según qué filtros están habilitados
    if (current.preset !== applied.preset) return true
    if (current.startDate !== applied.startDate) return true
    if (current.endDate !== applied.endDate) return true
    if (showProductFilter && current.productId !== applied.productId) return true
    if (showMaterialFilter && current.materialId !== applied.materialId) return true
    if (showPhaseFilter && current.phase !== applied.phase) return true
    if (showTransferOnly && current.transferOnly !== applied.transferOnly) return true

    return false
  }

  // Aplicar preset (solo actualiza estado local, no ejecuta búsqueda)
  const handlePresetChange = (selectedPreset: DateRangePreset) => {
    setPreset(selectedPreset)
    
    if (selectedPreset === "Personalizado") {
      // Mantener las fechas actuales
      return
    }

    const presetData = presets.find((p) => p.label === selectedPreset)
    if (presetData) {
      const { start, end } = presetData.getDates()
      const newStartDate = format(start, "yyyy-MM-dd")
      const newEndDate = format(end, "yyyy-MM-dd")
      setStartDate(newStartDate)
      setEndDate(newEndDate)
    }
  }

  // Manejar cambios de fechas personalizadas (solo actualiza estado local)
  const handleDateChange = (field: "startDate" | "endDate", value: string) => {
    if (field === "startDate") {
      setStartDate(value)
      if (preset !== "Personalizado") {
        setPreset("Personalizado")
      }
    } else {
      setEndDate(value)
      if (preset !== "Personalizado") {
        setPreset("Personalizado")
      }
    }
  }

  // Ejecutar búsqueda con los valores actuales
  const handleSearch = () => {
    // NO modificar el estado local aquí - mantener los valores que el usuario seleccionó
    const filters: AnalyticsFiltersState = {
      preset,
      startDate,
      endDate,
      productId: showProductFilter ? productId : undefined,
      materialId: showMaterialFilter ? materialId : undefined,
      phase: showPhaseFilter ? phase : undefined,
      transferOnly: showTransferOnly ? transferOnly : undefined,
    }
    
    // Actualizar los valores iniciales con los filtros aplicados
    // Esto hace que los filtros "recuerden" el estado actual después de buscar
    // y el botón "Limpiar" compare contra estos valores
    initialValues.current = {
      preset,
      startDate,
      endDate,
      productId: showProductFilter ? productId : "",
      materialId: showMaterialFilter ? materialId : "",
      phase: showPhaseFilter ? phase : "",
      transferOnly: showTransferOnly ? transferOnly : false,
    }
    
    onFiltersChange(filters)
    onSearch(filters) // Pasar los filtros al callback
    // Los valores del estado local (preset, startDate, endDate, etc.) se mantienen
  }

  // Limpiar filtros y volver a valores iniciales por defecto
  const handleClear = () => {
    // Restaurar valores por defecto
    const defaultPreset = presets.find((p) => p.label === "Últimos 12 Meses")
    if (defaultPreset) {
      const { start, end } = defaultPreset.getDates()
      const defaultStartDate = format(start, "yyyy-MM-dd")
      const defaultEndDate = format(end, "yyyy-MM-dd")
      
      setPreset("Últimos 12 Meses")
      setStartDate(defaultStartDate)
      setEndDate(defaultEndDate)
      setProductId("")
      setMaterialId("")
      setPhase("")
      setTransferOnly(false)
      
      // Restaurar valores iniciales por defecto
      const defaultValues: AnalyticsFiltersState = {
        preset: "Últimos 12 Meses",
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        productId: "",
        materialId: "",
        phase: "",
        transferOnly: false,
      }
      
      initialValues.current = {
        ...defaultValues,
        productId: "",
        materialId: "",
        phase: "",
        transferOnly: false,
      }
      
      onFiltersChange(defaultValues)
      onClear()
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-4 bg-surface-secondary rounded-lg", className)}>
      {/* Selector de preset y filtro de producto juntos */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <select
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value as DateRangePreset)}
            className={cn(
              "px-3 py-2 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 bg-white"
            )}
          >
            {presets.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de producto al lado del período */}
        {showProductFilter && productFilterComponent && (
          <div className="flex items-center gap-2">
            {productFilterComponent}
          </div>
        )}

        {/* Filtro de producto simple (si no hay componente personalizado) */}
        {showProductFilter && !productFilterComponent && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="ID Producto"
              className={cn(
                "px-3 py-2 border border-stroke rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
                "text-sm text-primary-900 bg-white w-32"
              )}
            />
          </div>
        )}
      </div>

      {/* Fechas personalizadas (solo si está en modo personalizado) */}
      {preset === "Personalizado" && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            className={cn(
              "px-3 py-2 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 bg-white"
            )}
            placeholder="Desde"
          />
          <span className="text-primary-600">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange("endDate", e.target.value)}
            className={cn(
              "px-3 py-2 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 bg-white"
            )}
            placeholder="Hasta"
          />
        </>
      )}

      {/* Filtro de material */}
      {showMaterialFilter && materialFilterComponent && (
        <div className="flex items-center gap-2">
          {materialFilterComponent}
        </div>
      )}

      {/* Filtro de material simple (si no hay componente personalizado) */}
      {showMaterialFilter && !materialFilterComponent && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            placeholder="ID Material"
            className={cn(
              "px-3 py-2 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 bg-white w-32"
            )}
          />
        </div>
      )}

      {/* Filtro de fase */}
      {showPhaseFilter && (
        <div className="flex items-center gap-2">
          <select
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            className={cn(
              "px-3 py-2 border border-stroke rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
              "text-sm text-primary-900 bg-white"
            )}
          >
            <option value="">Todas las fases</option>
            <option value="MOLIENDA">Molienda</option>
            <option value="MACERACION">Maceración</option>
            <option value="FILTRACION">Filtración</option>
            <option value="COCCION">Cocción</option>
            <option value="FERMENTACION">Fermentación</option>
            <option value="MADURACION">Maduración</option>
            <option value="GASIFICACION">Gasificación</option>
            <option value="ENVASADO">Envasado</option>
            <option value="DESALCOHOLIZACION">Desalcoholización</option>
          </select>
        </div>
      )}

      {/* Toggle transferOnly */}
      {showTransferOnly && (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-primary-900 cursor-pointer">
            <input
              type="checkbox"
              checked={transferOnly}
              onChange={(e) => setTransferOnly(e.target.checked)}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-300"
            />
            <span>Solo transferencias</span>
          </label>
        </div>
      )}

      {/* Botones de acción */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={handleSearch}
          className={cn(
            "px-3 py-2 bg-primary-600 text-white rounded-lg shrink-0",
            "hover:bg-primary-700 transition-colors font-medium text-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary-300",
            "flex items-center gap-2 whitespace-nowrap"
          )}
        >
          <Search className="w-4 h-4" />
          Buscar
        </button>
        
        {hasChanges() && (
          <button
            onClick={handleClear}
            className={cn(
              "px-3 py-2 bg-gray-500 text-white rounded-lg shrink-0",
              "hover:bg-gray-600 transition-colors font-medium text-sm",
              "focus:outline-none focus:ring-2 focus:ring-gray-300",
              "flex items-center gap-2 whitespace-nowrap"
            )}
          >
            <X className="w-4 h-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
