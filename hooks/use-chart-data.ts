/**
 * Hook personalizado para manejar la carga de datos de gráficos
 * Centraliza la lógica de estados (loading, error, data) y recarga
 */

import { useState, useEffect, useCallback } from 'react'
import { MonthlyTotalDTO } from '@/types'
import { AnalyticsFiltersState } from '@/components/dashboard/analytics-filters'
import { handleError } from '@/lib/error-handler'

interface UseChartDataOptions {
  /**
   * Función que carga los datos del gráfico
   * Debe retornar una Promise con MonthlyTotalDTO[]
   */
  loadFunction: (filters: AnalyticsFiltersState) => Promise<MonthlyTotalDTO[]>
  
  /**
   * Filtros actuales del gráfico
   */
  filters: AnalyticsFiltersState
  
  /**
   * ID adicional para filtrar (productId, materialId, etc.)
   */
  additionalFilterId?: string
  
  /**
   * Nombre del campo adicional en filters (ej: 'productId', 'materialId')
   */
  additionalFilterKey?: keyof AnalyticsFiltersState
  
  /**
   * Filtros adicionales personalizados (ej: phase, transferOnly)
   */
  additionalFilters?: Partial<AnalyticsFiltersState>
  
  /**
   * Mensaje de error personalizado
   */
  errorMessage?: string
  
  /**
   * Cargar datos automáticamente al montar
   */
  autoLoad?: boolean
}

interface UseChartDataReturn {
  /** Datos cargados */
  data: MonthlyTotalDTO[]
  /** Estado de carga */
  loading: boolean
  /** Mensaje de error si existe */
  error: string | null
  /** Función para recargar datos */
  reload: () => void
  /** Función para limpiar error */
  clearError: () => void
}

/**
 * Hook para manejar la carga de datos de gráficos
 * 
 * Centraliza la lógica de carga de datos, manejo de estados (loading, error, data)
 * y recarga de datos para componentes de gráficos. Proporciona una interfaz consistente
 * para todos los gráficos del dashboard.
 * 
 * @param options - Opciones de configuración del hook
 * @param options.loadFunction - Función async que carga los datos del backend
 * @param options.filters - Filtros actuales del gráfico (fechas, etc.)
 * @param options.additionalFilterId - ID adicional para filtrar (productId, materialId, etc.)
 * @param options.additionalFilterKey - Nombre del campo adicional en filters
 * @param options.additionalFilters - Filtros adicionales personalizados (ej: phase, transferOnly)
 * @param options.errorMessage - Mensaje de error personalizado
 * @param options.autoLoad - Si cargar datos automáticamente al montar - Por defecto: true
 * 
 * @returns Objeto con datos, estados y funciones de control
 * @returns data - Datos cargados del backend
 * @returns loading - Estado de carga (true mientras se cargan datos)
 * @returns error - Mensaje de error si ocurrió alguno (null si no hay error)
 * @returns reload - Función para recargar los datos
 * @returns clearError - Función para limpiar el estado de error
 * 
 * @example
 * ```tsx
 * // Uso básico
 * const { data, loading, error, reload } = useChartData({
 *   loadFunction: analyticsApi.getMonthlyProduction,
 *   filters,
 *   errorMessage: 'No se pudo cargar la producción mensual'
 * })
 * 
 * // Con filtro adicional
 * const { data, loading, error } = useChartData({
 *   loadFunction: analyticsApi.getMonthlyProduction,
 *   filters,
 *   additionalFilterId: productId,
 *   additionalFilterKey: 'productId',
 *   errorMessage: 'No se pudo cargar la producción mensual'
 * })
 * 
 * // Con filtros adicionales personalizados
 * const { data, loading, error } = useChartData({
 *   loadFunction: analyticsApi.getMonthlyWaste,
 *   filters,
 *   additionalFilters: {
 *     phase: selectedPhase,
 *     transferOnly: true,
 *   },
 *   errorMessage: 'No se pudo cargar los desperdicios mensuales'
 * })
 * ```
 */
export function useChartData({
  loadFunction,
  filters,
  additionalFilterId,
  additionalFilterKey,
  additionalFilters,
  errorMessage = 'No se pudieron cargar los datos',
  autoLoad = true,
}: UseChartDataOptions): UseChartDataReturn {
  const [data, setData] = useState<MonthlyTotalDTO[]>([])
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState<string | null>(null)
  const [shouldLoad, setShouldLoad] = useState(autoLoad)

  // Efecto para cargar datos cuando cambian las dependencias
  useEffect(() => {
    if (!shouldLoad) return
    
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Construir filtros finales
        const finalFilters: AnalyticsFiltersState = {
          ...filters,
          ...additionalFilters, // Aplicar filtros adicionales primero
        }
        
        // Agregar filtro adicional si existe (tiene prioridad sobre additionalFilters)
        if (additionalFilterKey && additionalFilterId) {
          finalFilters[additionalFilterKey] = additionalFilterId
        } else if (additionalFilterKey && filters[additionalFilterKey]) {
          // Usar el valor de filters si no hay additionalFilterId
          finalFilters[additionalFilterKey] = filters[additionalFilterKey]
        }
        
        const monthlyData = await loadFunction(finalFilters)
        setData(monthlyData)
      } catch (err) {
        // Usar sistema centralizado de manejo de errores
        const errorInfo = handleError(err, {
          title: 'Error al cargar datos',
          description: errorMessage,
          showToast: false, // No mostrar toast, solo actualizar estado
          logToConsole: true,
        })
        setError(errorInfo.message || errorMessage)
      } finally {
        setLoading(false)
        setShouldLoad(false)
      }
    }
    
    loadData()
  }, [shouldLoad, loadFunction, filters, additionalFilterId, additionalFilterKey, additionalFilters, errorMessage])

  // Función para recargar datos
  const reload = useCallback(() => {
    setShouldLoad(true)
  }, [])

  // Función para limpiar error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    reload,
    clearError,
  }
}

