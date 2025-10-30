import { api } from './fetcher'
import type { SystemConfigurationResponse, WorkingDayUpdateRequest } from '@/types'

// Obtener configuración del sistema
export async function getSystemConfiguration(): Promise<SystemConfigurationResponse> {
  try {
    const response = await api.get<SystemConfigurationResponse>('/api/system-configurations')
    return response
  } catch (error) {
    console.error('Error al obtener configuración del sistema:', error)
    throw error
  }
}

// Actualizar working days (lista de WorkingDayUpdateDTO)
export async function updateWorkingDays(dtos: WorkingDayUpdateRequest[]): Promise<SystemConfigurationResponse> {
  try {
    const response = await api.patch<SystemConfigurationResponse>(`/api/system-configurations/working-days`, dtos)
    return response
  } catch (error) {
    console.error('Error al actualizar días laborales:', error)
    throw error
  }
}


