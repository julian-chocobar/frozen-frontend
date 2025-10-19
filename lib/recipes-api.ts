import { api } from './fetcher'
import type { RecipeCreateRequest, RecipeUpdateRequest, RecipeResponse } from '@/types'

export async function createRecipe(data: RecipeCreateRequest) {
    const response = await api.post<RecipeResponse>('/api/recipes', data)
    return response
}

export async function updateRecipe(id: string, data: RecipeUpdateRequest) {
    const response = await api.put<RecipeResponse>(`/api/recipes/${id}`, data)
    return response
}

export async function deleteRecipe(id: string) {
    const response = await api.delete<RecipeResponse>(`/api/recipes/${id}`)
    return response
}

export async function getRecipeById(id: string) {
    const response = await api.get<RecipeResponse>(`/api/recipes/${id}`)
    return response
}

export async function getRecipesByProductPhaseId(productPhaseId: string) {
    const response = await api.get<RecipeResponse[]>(`/api/recipes/by-product-phase/${productPhaseId}`)
    return response
}

export async function getRecipesByProductId(productId: string) {
    const response = await api.get<RecipeResponse[]>(`/api/recipes/by-product/${productId}`)
    return response
}

export async function getRecipes() {
    const response = await api.get<RecipeResponse[]>('/api/recipes')
    return response
}