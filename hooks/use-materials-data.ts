/**
 * Hook personalizado para gestionar datos de materiales
 * Centraliza la lógica de carga, estados y filtrado siguiendo el patrón de useChartData
 * 
 * @example
 * ```tsx
 * const { data, loading, error, reload, pagination } = useMaterialsData({
 *   filters: { type: 'MALTA', isActive: true },
 *   page: 0,
 *   size: 10
 * })
 * ```
 */

import { useState, useEffect, useCallback } from 'react'
import { getMaterials } from '@/lib/materials/api'
import { handleError } from '@/lib/error-handler'
import type { Material } from '@/types'

interface UseMaterialsDataOptions {
  /** Filtros de búsqueda para materiales */
  filters?: {
    type?: string
    estado?: string
    name?: string
    supplier?: string
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

interface UseMaterialsDataReturn {
  /** Lista de materiales cargados */
  data: Material[]
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
  updateFilters: (newFilters: UseMaterialsDataOptions['filters']) => void
}

/**
 * Hook para gestionar la carga y estado de materiales
 * Sigue el patrón establecido en useChartData del módulo de dashboards
 */
export function useMaterialsData({
  filters = {},
  page = 0,
  size = 10,
  autoLoad = true,
  errorMessage = 'No se pudieron cargar los materiales',
}: UseMaterialsDataOptions = {}): UseMaterialsDataReturn {
  const [data, setData] = useState<Material[]>([])
  const [pagination, setPagination] = useState<UseMaterialsDataReturn['pagination']>(null)
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
        const result = await getMaterials({
          ...currentFilters,
          page,
          size,
        })

        setData(result.materials)
        setPagination(result.pagination)
      } catch (err) {
        const errorInfo = handleError(err, {
          title: 'Error al cargar materiales',
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
  const updateFilters = useCallback((newFilters: UseMaterialsDataOptions['filters']) => {
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
