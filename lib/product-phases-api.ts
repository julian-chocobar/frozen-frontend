import { api } from './fetcher'
import type { Phase, ProductPhaseResponse,
    ProductPhaseUpdateRequest,
 } from '@/types'

const PHASE_LABELS: Record<Phase, string> = {
  'MOLIENDA': 'Molienda',
  'MACERACION': 'Maceración',
  'FILTRACION': 'Filtración',
  'COCCION': 'Cocción',
  'FERMENTACION': 'Fermentación',
  'MADURACION': 'Maduración',
  'GASIFICACION': 'Gasificación',
  'ENVASADO': 'Envasado',
  'DESALCOHOLIZACION': 'Desalcoholización',
}

export async function getProductPhases() {
    const response = await api.get<ProductPhaseResponse>('/api/product-phases')
    return response
}

export async function getProductPhaseById(id: string) {
    const response = await api.get<ProductPhaseResponse>(`/api/product-phases/${id}`)
    return response
}

export async function updateProductPhase(id: string, data: ProductPhaseUpdateRequest) {
    const response = await api.patch<ProductPhaseResponse>(`/api/product-phases/${id}`, data)
    return response
}

export async function toggleReady(id: string) {
    const response = await api.patch<ProductPhaseResponse>(`/api/product-phases/${id}/toggle-ready`)
    return response
}

export async function getProductPhasesByProductId(productId: string) {
    const response = await api.get<ProductPhaseResponse[]>(`/api/product-phases/by-product/${productId}`)
    return response
}