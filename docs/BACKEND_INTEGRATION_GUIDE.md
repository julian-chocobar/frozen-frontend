# Guía de Integración con Backend - Sistema Frozen

## Arquitectura Backend

### Stack Backend
- **Framework**: Spring Boot 3.x
- **Seguridad**: Spring Security con Session Cookies
- **Base de Datos**: PostgreSQL / MySQL
- **API**: REST (JSON)

### Autenticación
- **Método**: Session-based (NO JWT)
- **Cookies**: HttpOnly, Secure, SameSite=Lax
- **CSRF**: Token en header o cookie

## Configuración del Cliente HTTP

### 1. Fetcher Base (lib/fetcher.ts)

\`\`\`typescript
// lib/fetcher.ts
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BACKEND_URL}${endpoint}`
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // ← CRÍTICO: Envía cookies de sesión
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Métodos helper
export const api = {
  get: <T>(endpoint: string) => 
    fetcher<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: any) =>
    fetcher<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) =>
    fetcher<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: <T>(endpoint: string, data: any) =>
    fetcher<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) =>
    fetcher<T>(endpoint, { method: 'DELETE' }),
}
\`\`\`

### 2. SWR Configuration

\`\`\`typescript
// app/layout.tsx
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SWRConfig
          value={{
            fetcher,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            shouldRetryOnError: true,
            errorRetryCount: 3,
            errorRetryInterval: 5000,
            onError: (error) => {
              console.error('[SWR Error]', error)
              // Opcional: Mostrar toast de error
            },
          }}
        >
          {children}
        </SWRConfig>
      </body>
    </html>
  )
}
\`\`\`

## Patrones de Integración

### 1. Server Component (SSR)

**Cuándo usar:**
- Datos iniciales de la página
- Datos que no cambian frecuentemente
- SEO importante

\`\`\`typescript
// app/(dashboard)/materiales/page.tsx
import { api } from '@/lib/fetcher'
import { Material } from '@/types'

export default async function MaterialesPage() {
  // Fetch en el servidor
  const materials = await api.get<Material[]>('/api/materiales')
  
  return (
    <div>
      <h1>Materiales</h1>
      <MaterialsTable materials={materials} />
    </div>
  )
}
\`\`\`

**Manejo de errores:**
\`\`\`typescript
export default async function MaterialesPage() {
  try {
    const materials = await api.get<Material[]>('/api/materiales')
    return <MaterialsTable materials={materials} />
  } catch (error) {
    return (
      <ErrorState 
        message="No se pudieron cargar los materiales"
        error={error}
      />
    )
  }
}
\`\`\`

### 2. Client Component con SWR

**Cuándo usar:**
- Datos que cambian frecuentemente
- Necesitas revalidación automática
- Interactividad (filtros, búsqueda)

\`\`\`typescript
// components/production/batch-monitor.tsx
'use client'
import useSWR from 'swr'
import { Batch } from '@/types'

export function BatchMonitor() {
  const { data, error, isLoading, mutate } = useSWR<Batch[]>(
    '/api/batches/active',
    {
      refreshInterval: 10000, // Revalidar cada 10s
      revalidateOnFocus: true,
    }
  )
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState error={error} />
  if (!data || data.length === 0) return <EmptyState />
  
  return (
    <div>
      <Button onClick={() => mutate()}>Actualizar</Button>
      {data.map(batch => (
        <BatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  )
}
\`\`\`

### 3. Hybrid (Server + Client)

**Mejor de ambos mundos:**
- SSR para datos iniciales (SEO, performance)
- Client para actualizaciones en tiempo real

\`\`\`typescript
// app/(dashboard)/seguimiento/[id]/page.tsx
import { api } from '@/lib/fetcher'
import { BatchDetailClient } from './batch-detail-client'

export default async function BatchDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  // Fetch inicial en servidor
  const initialData = await api.get(`/api/batches/${params.id}`)
  
  // Pasar a Client Component para interactividad
  return <BatchDetailClient initialData={initialData} />
}

// batch-detail-client.tsx
'use client'
import useSWR from 'swr'

export function BatchDetailClient({ initialData }) {
  const { data, mutate } = useSWR(
    `/api/batches/${initialData.id}`,
    {
      fallbackData: initialData, // ← Usa datos del servidor
      refreshInterval: 5000,
    }
  )
  
  const updateParameter = async (param: string, value: number) => {
    // Optimistic update
    mutate({ ...data, parametros: { ...data.parametros, [param]: value } }, false)
    
    try {
      await api.patch(`/api/batches/${data.id}/parametros`, { [param]: value })
      mutate() // Revalidar
    } catch (error) {
      mutate() // Revertir en caso de error
      throw error
    }
  }
  
  return <BatchDetails batch={data} onUpdateParameter={updateParameter} />
}
\`\`\`

## Operaciones CRUD

### CREATE

\`\`\`typescript
// Server Action (recomendado para forms)
// app/actions/materials.ts
'use server'
import { api } from '@/lib/fetcher'
import { revalidatePath } from 'next/cache'

export async function createMaterial(formData: FormData) {
  const data = {
    nombre: formData.get('nombre'),
    stock: Number(formData.get('stock')),
    categoria: formData.get('categoria'),
  }
  
  try {
    await api.post('/api/materiales', data)
    revalidatePath('/materiales') // Revalidar cache
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Uso en componente
'use client'
import { createMaterial } from '@/app/actions/materials'

export function MaterialForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await createMaterial(formData)
    if (result.success) {
      // Mostrar éxito
    } else {
      // Mostrar error
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input name="nombre" />
      <input name="stock" type="number" />
      <select name="categoria">...</select>
      <button type="submit">Crear</button>
    </form>
  )
}
\`\`\`

**Alternativa con Client Component:**
\`\`\`typescript
'use client'
import { api } from '@/lib/fetcher'
import { mutate } from 'swr'

export function MaterialForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await api.post('/api/materiales', formData)
      mutate('/api/materiales') // Revalidar lista
      // Mostrar éxito
    } catch (error) {
      // Mostrar error
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
\`\`\`

### READ

\`\`\`typescript
// Server Component
export default async function Page() {
  const data = await api.get('/api/materiales')
  return <List data={data} />
}

// Client Component con SWR
'use client'
export function MaterialsList() {
  const { data } = useSWR('/api/materiales')
  return <List data={data} />
}

// Con filtros
const { data } = useSWR(
  `/api/materiales?categoria=${category}&search=${search}`
)

// Con paginación
const { data } = useSWR(
  `/api/materiales?page=${page}&limit=${limit}`
)
\`\`\`

### UPDATE

\`\`\`typescript
'use client'
import { api } from '@/lib/fetcher'
import useSWR, { mutate } from 'swr'

export function MaterialEditor({ materialId }: { materialId: string }) {
  const { data: material } = useSWR(`/api/materiales/${materialId}`)
  
  const updateMaterial = async (updates: Partial<Material>) => {
    // Optimistic update
    mutate(
      `/api/materiales/${materialId}`,
      { ...material, ...updates },
      false
    )
    
    try {
      await api.patch(`/api/materiales/${materialId}`, updates)
      mutate(`/api/materiales/${materialId}`) // Revalidar
      mutate('/api/materiales') // Revalidar lista también
    } catch (error) {
      mutate(`/api/materiales/${materialId}`) // Revertir
      throw error
    }
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      updateMaterial({ nombre: e.target.nombre.value })
    }}>
      <input name="nombre" defaultValue={material?.nombre} />
      <button type="submit">Actualizar</button>
    </form>
  )
}
\`\`\`

### DELETE

\`\`\`typescript
'use client'
import { api } from '@/lib/fetcher'
import { mutate } from 'swr'

export function MaterialCard({ material }: { material: Material }) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const handleDelete = async () => {
    if (!confirm('¿Estás seguro?')) return
    
    setIsDeleting(true)
    
    try {
      await api.delete(`/api/materiales/${material.id}`)
      mutate('/api/materiales') // Revalidar lista
      // Opcional: Mostrar toast de éxito
    } catch (error) {
      // Mostrar error
    } finally {
      setIsDeleting(false)
    }
  }
  
  return (
    <Card>
      <CardContent>
        <p>{material.nombre}</p>
        <Button 
          onClick={handleDelete} 
          disabled={isDeleting}
          variant="destructive"
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </CardContent>
    </Card>
  )
}
\`\`\`

## Manejo de Errores

### 1. Error Boundaries (UI)

\`\`\`typescript
// app/(dashboard)/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Algo salió mal
      </h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  )
}
\`\`\`

### 2. Error Handling en Fetcher

\`\`\`typescript
// lib/fetcher.ts
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, credentials: 'include' })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    
    // Manejar errores específicos
    if (response.status === 401) {
      // Redirigir a login
      window.location.href = '/login'
      throw new APIError('No autenticado', 401, 'UNAUTHORIZED')
    }
    
    if (response.status === 403) {
      throw new APIError('No tienes permisos', 403, 'FORBIDDEN')
    }
    
    if (response.status === 404) {
      throw new APIError('Recurso no encontrado', 404, 'NOT_FOUND')
    }
    
    if (response.status >= 500) {
      throw new APIError('Error del servidor', response.status, 'SERVER_ERROR')
    }
    
    throw new APIError(
      error.message || 'Error desconocido',
      response.status,
      error.code
    )
  }
  
  return response.json()
}
\`\`\`

### 3. Error Handling en Componentes

\`\`\`typescript
'use client'
import useSWR from 'swr'

export function DataComponent() {
  const { data, error, isLoading } = useSWR('/api/data')
  
  if (isLoading) return <LoadingSpinner />
  
  if (error) {
    // Error específico
    if (error.status === 404) {
      return <EmptyState message="No se encontraron datos" />
    }
    
    // Error genérico
    return (
      <ErrorState 
        message="Error al cargar los datos"
        error={error}
        onRetry={() => mutate('/api/data')}
      />
    )
  }
  
  return <DataDisplay data={data} />
}
\`\`\`

## Autenticación

### 1. Login

\`\`\`typescript
// app/login/page.tsx
'use client'
import { api } from '@/lib/fetcher'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await api.post('/api/auth/login', {
        username: formData.get('username'),
        password: formData.get('password'),
      })
      
      // Login exitoso - redirigir
      router.push('/dashboard')
    } catch (error) {
      setError('Credenciales inválidas')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" required />
      <input name="password" type="password" required />
      {error && <p className="text-red-600">{error}</p>}
      <button type="submit">Iniciar Sesión</button>
    </form>
  )
}
\`\`\`

### 2. Logout

\`\`\`typescript
'use client'
import { api } from '@/lib/fetcher'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {})
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión', error)
    }
  }
  
  return <Button onClick={handleLogout}>Cerrar Sesión</Button>
}
\`\`\`

### 3. Protected Routes

\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('JSESSIONID')
  
  // Si no hay sesión y está intentando acceder a ruta protegida
  if (!sessionCookie && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
\`\`\`

## Optimistic Updates

\`\`\`typescript
'use client'
import useSWR, { mutate } from 'swr'
import { api } from '@/lib/fetcher'

export function BatchParameterEditor({ batchId }: { batchId: string }) {
  const { data: batch } = useSWR(`/api/batches/${batchId}`)
  
  const updateTemperature = async (newTemp: number) => {
    // 1. Actualizar UI inmediatamente (optimistic)
    mutate(
      `/api/batches/${batchId}`,
      {
        ...batch,
        parametros: { ...batch.parametros, temperatura: newTemp }
      },
      false // No revalidar todavía
    )
    
    try {
      // 2. Enviar al servidor
      await api.patch(`/api/batches/${batchId}/parametros`, {
        temperatura: newTemp
      })
      
      // 3. Revalidar para confirmar
      mutate(`/api/batches/${batchId}`)
    } catch (error) {
      // 4. Revertir en caso de error
      mutate(`/api/batches/${batchId}`)
      alert('Error al actualizar temperatura')
    }
  }
  
  return (
    <div>
      <p>Temperatura: {batch?.parametros.temperatura}°C</p>
      <input
        type="number"
        onChange={(e) => updateTemperature(Number(e.target.value))}
      />
    </div>
  )
}
\`\`\`

## WebSockets (Futuro)

Para actualizaciones en tiempo real:

\`\`\`typescript
'use client'
import { useEffect } from 'react'
import { mutate } from 'swr'

export function RealtimeBatchMonitor() {
  const { data } = useSWR('/api/batches/active')
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/ws/batches')
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      
      // Actualizar cache de SWR
      mutate(
        '/api/batches/active',
        (current) => current?.map(b => 
          b.id === update.id ? { ...b, ...update } : b
        ),
        false
      )
    }
    
    return () => ws.close()
  }, [])
  
  return <BatchList batches={data} />
}
\`\`\`

## Checklist de Integración

Antes de considerar la integración completa:

- [ ] Fetcher configurado con credentials: 'include'
- [ ] SWR configurado globalmente
- [ ] Manejo de errores 401/403/404/500
- [ ] Loading states en todas las operaciones
- [ ] Optimistic updates donde aplique
- [ ] Error boundaries en rutas principales
- [ ] Revalidación configurada según necesidad
- [ ] CORS configurado en backend
- [ ] Session cookies funcionando
- [ ] Logout limpia sesión correctamente
- [ ] Protected routes implementadas
- [ ] Variables de entorno configuradas
