"use client"

/**
 * Componente de filtros reutilizable para analytics
 * Incluye rangos de fechas predefinidos y selectores de entidades
 * Similar a compact-filters.tsx - requiere presionar "Buscar" para aplicar cambios
 */

import { useState, useEffect, useRef, memo } from "react"
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
  currentProductId?: string // Valor actual del filtro de producto (para componentes personalizados)
  currentMaterialId?: string // Valor actual del filtro de material (para componentes personalizados)
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

function AnalyticsFiltersComponent({
  onFiltersChange,
  onSearch,
  onClear,
  showProductFilter = false,
  showMaterialFilter = false,
  showPhaseFilter = false,
  showTransferOnly = false,
  productFilterComponent,
  materialFilterComponent,
  currentProductId,
  currentMaterialId,
  className,
}: AnalyticsFiltersProps) {
  // Inicializar valores por defecto directamente - usar función para evitar recalcular en cada render
  const getInitialState = () => {
  const defaultValues = getDefaultValues()
    return {
      preset: defaultValues.preset,
      startDate: defaultValues.startDate,
      endDate: defaultValues.endDate,
    productId: "",
    materialId: "",
    phase: "",
    transferOnly: false,
    }
  }
  
  // Almacenar el estado actual en un ref para persistir entre remounts
  // Tipo explícito para evitar errores de TypeScript
  interface FilterState {
    preset: DateRangePreset
    startDate: string
    endDate: string
    productId: string
    materialId: string
    phase: string
    transferOnly: boolean
  }
  
  // Función para obtener el estado desde sessionStorage o valores por defecto
  const getPersistedState = (): FilterState => {
    if (typeof window === 'undefined') return getInitialState()
    
    try {
      const key = `analytics-filters-${showProductFilter ? 'product' : ''}${showMaterialFilter ? 'material' : ''}${showPhaseFilter ? 'phase' : ''}${showTransferOnly ? 'transfer' : ''}`
      const stored = sessionStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validar que tenga los campos necesarios
        if (parsed.preset && parsed.startDate && parsed.endDate) {
          return {
            preset: parsed.preset,
            startDate: parsed.startDate,
            endDate: parsed.endDate,
            productId: parsed.productId || "",
            materialId: parsed.materialId || "",
            phase: parsed.phase || "",
            transferOnly: parsed.transferOnly || false,
          }
        }
      }
    } catch (e) {
      // Si hay error al leer, usar valores por defecto
      console.warn('Error al leer estado persistido:', e)
    }
    return getInitialState()
  }
  
  // Función para guardar el estado en sessionStorage
  const persistState = (state: FilterState) => {
    if (typeof window === 'undefined') return
    try {
      const key = `analytics-filters-${showProductFilter ? 'product' : ''}${showMaterialFilter ? 'material' : ''}${showPhaseFilter ? 'phase' : ''}${showTransferOnly ? 'transfer' : ''}`
      sessionStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.warn('Error al guardar estado:', e)
    }
  }
  
  const stateRef = useRef<FilterState>(getPersistedState())
  
  // Estado local de los filtros (no se aplican hasta presionar "Buscar")
  // Usar función inicializadora que lee desde el ref para mantener el estado entre remounts
  const [preset, setPresetState] = useState<DateRangePreset>(() => stateRef.current.preset)
  const [startDate, setStartDateState] = useState<string>(() => stateRef.current.startDate)
  const [endDate, setEndDateState] = useState<string>(() => stateRef.current.endDate)
  const [productId, setProductIdState] = useState<string>(() => stateRef.current.productId)
  const [materialId, setMaterialIdState] = useState<string>(() => stateRef.current.materialId)
  const [phase, setPhaseState] = useState<string>(() => stateRef.current.phase)
  const [transferOnly, setTransferOnlyState] = useState<boolean>(() => stateRef.current.transferOnly)

  // Wrappers para setState que también actualizan el ref y persisten
  const setPreset = (value: DateRangePreset) => {
    stateRef.current.preset = value
    setPresetState(value)
    persistState(stateRef.current)
  }
  const setStartDate = (value: string) => {
    stateRef.current.startDate = value
    setStartDateState(value)
    persistState(stateRef.current)
  }
  const setEndDate = (value: string) => {
    stateRef.current.endDate = value
    setEndDateState(value)
    persistState(stateRef.current)
  }
  const setProductId = (value: string) => {
    stateRef.current.productId = value
    setProductIdState(value)
    persistState(stateRef.current)
  }
  const setMaterialId = (value: string) => {
    stateRef.current.materialId = value
    setMaterialIdState(value)
    persistState(stateRef.current)
  }
  const setPhase = (value: string) => {
    stateRef.current.phase = value
    setPhaseState(value)
    persistState(stateRef.current)
  }
  const setTransferOnly = (value: boolean) => {
    stateRef.current.transferOnly = value
    setTransferOnlyState(value)
    persistState(stateRef.current)
  }

  // Valores iniciales para comparar si hay cambios - inicializar una sola vez
  const initialValues = useRef<AnalyticsFiltersState>({ ...stateRef.current })

  // Flag para saber si ya se inicializó
  const isInitialized = useRef(false)
  // Flag para saber si el usuario ya ha interactuado con los filtros
  const hasUserInteracted = useRef(false)

  // Sincronizar estado desde el ref si el componente se remonta
  useEffect(() => {
    if (isInitialized.current) {
      // Si ya estaba inicializado, significa que el componente se remontó
      // Cargar estado persistido y restaurar
      const persistedState = getPersistedState()
      stateRef.current = persistedState
      setPresetState(persistedState.preset)
      setStartDateState(persistedState.startDate)
      setEndDateState(persistedState.endDate)
      setProductIdState(persistedState.productId)
      setMaterialIdState(persistedState.materialId)
      setPhaseState(persistedState.phase)
      setTransferOnlyState(persistedState.transferOnly)
      return
    }
    isInitialized.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Función helper para determinar el preset basado en las fechas
  const getPresetFromDates = (start: string, end: string): DateRangePreset => {
    if (!start || !end) return "Últimos 12 Meses"
    
    // Comparar con cada preset
    for (const presetOption of presets) {
      if (presetOption.label === "Personalizado") continue
      
      const { start: presetStart, end: presetEnd } = presetOption.getDates()
      const presetStartStr = format(presetStart, "yyyy-MM-dd")
      const presetEndStr = format(presetEnd, "yyyy-MM-dd")
      
      if (start === presetStartStr && end === presetEndStr) {
        return presetOption.label
      }
    }
    
    return "Personalizado"
  }

  // Verificar si hay filtros activos (diferentes a los valores por defecto)
  // El botón de limpiar debe aparecer siempre que haya filtros aplicados
  const hasActiveFilters = () => {
    // Usar valores de componentes personalizados si están disponibles, sino usar estado local
    const actualProductId = showProductFilter 
      ? (productFilterComponent ? (currentProductId || "") : productId)
      : ""
    const actualMaterialId = showMaterialFilter
      ? (materialFilterComponent ? (currentMaterialId || "") : materialId)
      : ""
    
    // Verificar si hay algún filtro activo (diferente a los valores por defecto)
    // Preset diferente a "Últimos 12 Meses"
    if (preset !== "Últimos 12 Meses") return true
    
    // ProductId activo
    if (showProductFilter && actualProductId) return true
    
    // MaterialId activo
    if (showMaterialFilter && actualMaterialId) return true
    
    // Phase seleccionada
    if (showPhaseFilter && phase) return true
    
    // TransferOnly activo
    if (showTransferOnly && transferOnly) return true

    return false
  }

  // Aplicar preset (solo actualiza estado local, no ejecuta búsqueda)
  const handlePresetChange = (selectedPreset: DateRangePreset) => {
    hasUserInteracted.current = true
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
    hasUserInteracted.current = true
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
    hasUserInteracted.current = true
    
    // Usar valores de componentes personalizados si están disponibles, sino usar estado local
    const actualProductId = showProductFilter 
      ? (productFilterComponent ? (currentProductId || "") : productId)
      : undefined
    const actualMaterialId = showMaterialFilter
      ? (materialFilterComponent ? (currentMaterialId || "") : materialId)
      : undefined
    
    // Capturar los valores actuales del estado local antes de cualquier operación
    // Esto asegura que usamos los valores correctos incluso si hay un re-render
    const currentPreset = preset
    const currentStartDate = startDate
    const currentEndDate = endDate
    const currentPhase = phase
    const currentTransferOnly = transferOnly
    
    // Actualizar el stateRef con los valores actuales para persistir entre remounts
    const newState: FilterState = {
      preset: currentPreset,
      startDate: currentStartDate,
      endDate: currentEndDate,
      productId: actualProductId || "",
      materialId: actualMaterialId || "",
      phase: showPhaseFilter ? currentPhase : "",
      transferOnly: showTransferOnly ? currentTransferOnly : false,
    }
    stateRef.current = newState
    persistState(newState)
    
    // NO modificar el estado local aquí - mantener los valores que el usuario seleccionó
    // Usar el preset actual del estado local, no intentar detectarlo desde las fechas
    // porque el usuario puede haber seleccionado un preset específico
    const filters: AnalyticsFiltersState = {
      preset: currentPreset,
      startDate: currentStartDate,
      endDate: currentEndDate,
      productId: actualProductId || undefined,
      materialId: actualMaterialId || undefined,
      phase: showPhaseFilter ? currentPhase : undefined,
      transferOnly: showTransferOnly ? currentTransferOnly : undefined,
    }
    
    // Actualizar los valores iniciales con los filtros aplicados ANTES de llamar a los callbacks
    // Esto asegura que si hay un re-render, los valores se mantengan
    initialValues.current = {
      preset: currentPreset,
      startDate: currentStartDate,
      endDate: currentEndDate,
      productId: actualProductId || "",
      materialId: actualMaterialId || "",
      phase: showPhaseFilter ? currentPhase : "",
      transferOnly: showTransferOnly ? currentTransferOnly : false,
    }
    
    // Llamar a los callbacks después de actualizar initialValues y stateRef
    // Esto previene que un re-render cause que se resetee el componente
    onFiltersChange(filters)
    onSearch(filters) // Pasar los filtros al callback
    
    // Los valores del estado local (preset, startDate, endDate, etc.) se mantienen
    // NO se modifican aquí para preservar lo que el usuario seleccionó
  }

  // Limpiar filtros y volver a valores iniciales por defecto
  const handleClear = () => {
    // Restaurar valores por defecto
    const defaultPreset = presets.find((p) => p.label === "Últimos 12 Meses")
    if (defaultPreset) {
      const { start, end } = defaultPreset.getDates()
      const defaultStartDate = format(start, "yyyy-MM-dd")
      const defaultEndDate = format(end, "yyyy-MM-dd")
      
      const defaultValues: AnalyticsFiltersState = {
        preset: "Últimos 12 Meses",
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        productId: "",
        materialId: "",
        phase: "",
        transferOnly: false,
      }
      
      // Actualizar stateRef primero - asegurar que todos los valores estén definidos
      const clearedState: FilterState = {
        preset: "Últimos 12 Meses",
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        productId: "",
        materialId: "",
        phase: "",
        transferOnly: false,
      }
      stateRef.current = clearedState
      persistState(clearedState)
      
      // Luego actualizar el estado local
      setPreset("Últimos 12 Meses")
      setStartDate(defaultStartDate)
      setEndDate(defaultEndDate)
      setProductId("")
      setMaterialId("")
      setPhase("")
      setTransferOnly(false)
      
      // Restaurar valores iniciales por defecto
      initialValues.current = { ...defaultValues }
      
      onFiltersChange(defaultValues)
      onClear()
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3 p-4 bg-surface-secondary rounded-lg", className)}>
      {/* Selector de preset con fechas personalizadas al lado (solo si es Personalizado) */}
      <div className="flex items-center gap-3 flex-wrap" data-tour="dashboard-date-filters">
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

        {/* Fechas personalizadas - solo se muestran cuando el preset es "Personalizado" */}
        {preset === "Personalizado" && (
          <div className="flex items-center gap-2">
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
          </div>
        )}

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
        
        {hasActiveFilters() && (
          <button
            onClick={handleClear}
            className={cn(
              "px-3 py-2 bg-gray-500 text-white rounded-lg shrink-0",
              "hover:bg-gray-600 transition-colors font-medium text-sm",
              "focus:outline-none focus:ring-2 focus:ring-gray-300",
              "flex items-center justify-center whitespace-nowrap"
            )}
            title="Limpiar filtros"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// Exportar componente memoizado para evitar re-renders innecesarios
export const AnalyticsFilters = memo(AnalyticsFiltersComponent, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian props relevantes
  // Ignorar cambios en callbacks ya que son funciones que pueden cambiar en cada render
  return (
    prevProps.showProductFilter === nextProps.showProductFilter &&
    prevProps.showMaterialFilter === nextProps.showMaterialFilter &&
    prevProps.showPhaseFilter === nextProps.showPhaseFilter &&
    prevProps.showTransferOnly === nextProps.showTransferOnly &&
    prevProps.currentProductId === nextProps.currentProductId &&
    prevProps.currentMaterialId === nextProps.currentMaterialId &&
    prevProps.className === nextProps.className
  )
})
