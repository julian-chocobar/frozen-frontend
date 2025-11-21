// lib/analytics-api.ts

import { api } from './fetcher';
import type {
  MonthlyTotalDTO,
  DashboardStatsDTO,
  AnalyticsFilters,
} from '@/types';

/**
 * API client para analytics
 * Implementa todos los endpoints del módulo de analytics del backend
 */
export const analyticsApi = {
  /**
   * Obtiene la producción mensual agregada
   * @param filters - Filtros opcionales: startDate, endDate, productId
   */
  getMonthlyProduction: async (filters?: {
    startDate?: string
    endDate?: string
    productId?: string
  }): Promise<MonthlyTotalDTO[]> => {
    const params: Record<string, string> = {}
    if (filters?.startDate) params.startDate = filters.startDate
    if (filters?.endDate) params.endDate = filters.endDate
    if (filters?.productId) params.productId = filters.productId
    return api.get<MonthlyTotalDTO[]>('/api/analytics/monthly-production', params)
  },

  /**
   * Obtiene el consumo de materiales mensual
   * @param filters - Filtros opcionales: startDate, endDate, materialId
   */
  getMonthlyMaterialConsumption: async (filters?: {
    startDate?: string
    endDate?: string
    materialId?: string
  }): Promise<MonthlyTotalDTO[]> => {
    const params: Record<string, string> = {}
    if (filters?.startDate) params.startDate = filters.startDate
    if (filters?.endDate) params.endDate = filters.endDate
    if (filters?.materialId) params.materialId = filters.materialId
    return api.get<MonthlyTotalDTO[]>('/api/analytics/monthly-material-consumption', params)
  },

  /**
   * Obtiene los desperdicios generados mensualmente
   * @param filters - Filtros opcionales: startDate, endDate, phase, transferOnly
   */
  getMonthlyWaste: async (filters?: {
    startDate?: string
    endDate?: string
    phase?: string
    transferOnly?: boolean
  }): Promise<MonthlyTotalDTO[]> => {
    const params: Record<string, string> = {}
    if (filters?.startDate) params.startDate = filters.startDate
    if (filters?.endDate) params.endDate = filters.endDate
    if (filters?.phase) params.phase = filters.phase
    if (filters?.transferOnly !== undefined) params.transferOnly = filters.transferOnly.toString()
    return api.get<MonthlyTotalDTO[]>('/api/analytics/monthly-waste', params)
  },

  /**
   * Obtiene un resumen estadístico del último mes
   */
  getDashboardMonthly: async (): Promise<DashboardStatsDTO> => {
    return api.get<DashboardStatsDTO>('/api/analytics/dashboard/monthly')
  },
};

