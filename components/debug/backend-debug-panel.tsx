'use client'

import { useState } from 'react'
import { testBackendConnection } from '@/lib/backend-test'

export function BackendDebugPanel() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runTest = async () => {
    setLoading(true)
    const result = await testBackendConnection()
    setResults(result)
    setLoading(false)
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-3">🔍 Backend Debug</h3>
        
        <button
          onClick={runTest}
          disabled={loading}
          className="w-full mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {results && (
          <div className="space-y-2 text-sm">
            <div className={`p-2 rounded ${results.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              Status: {results.success ? '✅ Success' : '❌ Failed'}
            </div>
            
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}