/**
 * Utilidad para verificar la conexión con el backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

export async function checkBackendConnection(): Promise<{
  isConnected: boolean
  error?: string
  url: string
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/actuator/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa('user:1234')}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return {
        isConnected: true,
        url: BACKEND_URL
      }
    } else {
      return {
        isConnected: false,
        error: `Backend respondió con status ${response.status}`,
        url: BACKEND_URL
      }
    }
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      url: BACKEND_URL
    }
  }
}

export async function checkMaterialsEndpoint(): Promise<{
  isWorking: boolean
  error?: string
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/materials?page=0&size=1`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa('user:1234')}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      return { isWorking: true }
    } else {
      return {
        isWorking: false,
        error: `Endpoint de materiales respondió con status ${response.status}`
      }
    }
  } catch (error) {
    return {
      isWorking: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
