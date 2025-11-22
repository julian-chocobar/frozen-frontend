/**
 * Hook personalizado para gestionar datos de movimientos
 * Centraliza la lógica de carga, estados y filtrado siguiendo el patrón de useMaterialsData
 * 
 * @example
 * ```tsx
 * const { data, loading, error, reload, pagination } = useMovementsData({
 *   filters: { type: 'INGRESO', status: 'PENDIENTE' },
 *   page: 0,
 *   size: 10
 * })
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import { getMovements } from '@/lib/movements'
import { handleError } from '@/lib/error-handler'
import type { MovementResponse } from '@/types'

interface UseMovementsDataOptions {
  /** Filtros de búsqueda para movimientos */
  filters?: {
    type?: string
    status?: string
    materialId?: string
    dateFrom?: string
    dateTo?: string
  }
  /** Página actual (0-indexed) */
  page?: number
  /** Cantidad de elementos por página */
  size?: number
  /** Si debe cargar datos automáticamente al montar */
  autoLoad?: boolean
  /** Mensaje de error personalizado */
  errorMessage?: string
}

interface UseMovementsDataReturn {
  /** Lista de movimientos cargados */
  data: MovementResponse[]
  /** Información de paginación */
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  } | null
  /** Indica si está cargando datos */
  loading: boolean
  /** Mensaje de error si ocurrió algún problema */
  error: string | null
  /** Función para recargar los datos manualmente */
  reload: () => void
  /** Función para limpiar el error */
  clearError: () => void
  /** Función para actualizar filtros y recargar */
  updateFilters: (newFilters: UseMovementsDataOptions['filters']) => void
}

/**
 * Hook para gestionar la carga y estado de movimientos
 * Sigue el patrón establecido en useMaterialsData
 */
export function useMovementsData({
  filters = {},
  page = 0,
  size = 10,
  autoLoad = true,
  errorMessage = 'No se pudieron cargar los movimientos',
}: UseMovementsDataOptions = {}): UseMovementsDataReturn {
  const [data, setData] = useState<MovementResponse[]>([])
  const [pagination, setPagination] = useState<UseMovementsDataReturn['pagination']>(null)
  const [loading, setLoading] = useState(autoLoad)
  const [error, setError] = useState<string | null>(null)
  const [shouldLoad, setShouldLoad] = useState(autoLoad)
  const [currentFilters, setCurrentFilters] = useState(filters)

  useEffect(() => {
    if (!shouldLoad) return

    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getMovements({
          ...currentFilters,
          page,
          size,
        })

        setData(result.movements)
        setPagination(result.pagination)
      } catch (err) {
        const errorInfo = handleError(err, {
          title: 'Error al cargar movimientos',
          description: errorMessage,
          showToast: false, // No mostrar toast, solo actualizar estado
        })
        setError(errorInfo.message)
        setData([])
        setPagination(null)
      } finally {
        setLoading(false)
        setShouldLoad(false)
      }
    }

    loadData()
  }, [shouldLoad, currentFilters, page, size, errorMessage])

  /**
   * Recarga los datos manualmente
   */
  const reload = useCallback(() => {
    setShouldLoad(true)
  }, [])

  /**
   * Limpia el estado de error
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Actualiza los filtros y recarga automáticamente
   */
  const updateFilters = useCallback((newFilters: UseMovementsDataOptions['filters']) => {
    setCurrentFilters(newFilters || {})
    setShouldLoad(true)
  }, [])

  return {
    data,
    pagination,
    loading,
    error,
    reload,
    clearError,
    updateFilters,
  }
}
