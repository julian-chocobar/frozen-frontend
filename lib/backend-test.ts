/**
 * Test de conectividad backend
 * Para probar la conexión y autenticación
 */

import { api } from '@/lib/fetcher'

export async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...')
    
    // Test 1: Validar sesión
    const isValid = await api.get('/api/auth/validate')
    console.log('✅ Session validation:', isValid)
    
    // Test 2: Obtener usuario actual
    const user = await api.get('/api/auth/me')
    console.log('✅ Current user:', user)
    
    // Test 3: Obtener materiales (primera página)
    const materials = await api.get('/api/materials', { page: '0', size: '5' })
    console.log('✅ Materials:', materials)
    
    return { success: true, data: { isValid, user, materials } }
  } catch (error) {
    console.error('❌ Backend test failed:', error)
    return { success: false, error }
  }
}