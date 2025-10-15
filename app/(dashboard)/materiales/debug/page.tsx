/**
 * Página de diagnóstico para verificar la conexión con el backend
 */

import { checkBackendConnection, checkMaterialsEndpoint } from "@/lib/backend-check"

export default async function DebugPage() {
  const backendCheck = await checkBackendConnection()
  const materialsCheck = await checkMaterialsEndpoint()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Diagnóstico de Conexión Backend</h1>
      
      <div className="space-y-6">
        {/* Información del Backend */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Información del Backend</h2>
          <div className="space-y-2">
            <p><strong>URL:</strong> {backendCheck.url}</p>
            <p><strong>Estado:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                backendCheck.isConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {backendCheck.isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </p>
            {backendCheck.error && (
              <p><strong>Error:</strong> <span className="text-red-600">{backendCheck.error}</span></p>
            )}
          </div>
        </div>

        {/* Endpoint de Materiales */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Endpoint de Materiales</h2>
          <div className="space-y-2">
            <p><strong>URL:</strong> {backendCheck.url}/api/materials</p>
            <p><strong>Estado:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                materialsCheck.isWorking 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {materialsCheck.isWorking ? 'Funcionando' : 'Error'}
              </span>
            </p>
            {materialsCheck.error && (
              <p><strong>Error:</strong> <span className="text-red-600">{materialsCheck.error}</span></p>
            )}
          </div>
        </div>

        {/* Instrucciones de Solución */}
        {(!backendCheck.isConnected || !materialsCheck.isWorking) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Pasos para Solucionar</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-700">
              <li>Verifica que tu backend Spring Boot esté ejecutándose</li>
              <li>Confirma que esté en el puerto 8080 (o cambia NEXT_PUBLIC_BACKEND_URL)</li>
              <li>Revisa la consola del backend por errores</li>
              <li>Asegúrate de que el endpoint /api/materials esté disponible</li>
              <li>Verifica la configuración de CORS en tu backend</li>
              <li>Confirma que las credenciales user:1234 sean correctas</li>
            </ol>
          </div>
        )}

        {/* Configuración Actual */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Configuración Actual</h3>
          <div className="space-y-2 text-sm font-mono">
            <p><strong>NEXT_PUBLIC_BACKEND_URL:</strong> {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}</p>
            <p><strong>Credenciales:</strong> user:1234</p>
            <p><strong>Autenticación:</strong> Basic Auth</p>
          </div>
        </div>

        {/* Enlaces */}
        <div className="flex gap-4">
          <a 
            href="/materiales" 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Volver a Materiales
          </a>
          <a 
            href="/materiales/debug" 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Actualizar Diagnóstico
          </a>
        </div>
      </div>
    </div>
  )
}
