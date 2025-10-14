# Arquitectura Frontend - Sistema Frozen

## Stack Tecnológico

### Core
- **Framework**: Next.js 14.2+ (App Router)
- **React**: 18+ (Server Components + Client Components)
- **TypeScript**: 5+ (Strict mode)
- **Node**: 18+ (LTS)

### Styling
- **Tailwind CSS**: 4.0+ (CSS-first configuration)
- **CSS Variables**: Para theming dinámico
- **Responsive**: Mobile-first approach

### Data Fetching
- **SWR**: Para client-side data fetching y cache
- **Server Components**: Para initial data loading (SSR)
- **Fetch API**: Con credentials para session cookies

### UI Components
- **shadcn/ui**: Componentes base (Button, Card, etc.)
- **Recharts**: Gráficos y visualizaciones
- **Lucide React**: Iconos

## Estructura de Carpetas

\`\`\`
frozen-brewery-system/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Grupo de rutas con layout compartido
│   │   ├── layout.tsx            # Layout del dashboard (Sidebar + Header)
│   │   ├── page.tsx              # Dashboard principal (/)
│   │   ├── loading.tsx           # Loading UI para dashboard
│   │   ├── materiales/           # Gestión de materias primas
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── produccion/           # Planificación de producción
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── seguimiento/          # Seguimiento de lotes
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── [id]/             # Detalle de lote (ruta dinámica)
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── reportes/             # Reportes y análisis
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   └── configuracion/        # Configuración del sistema
│   │       ├── page.tsx
│   │       └── loading.tsx
│   ├── layout.tsx                # Root layout (fuentes, providers)
│   ├── globals.css               # Estilos globales y variables CSS
│   └── globals-green-backup.css  # Backup del esquema de colores verde
│
├── components/                   # Componentes React
│   ├── ui/                       # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── empty-state.tsx
│   │   └── page-loader.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── sidebar.tsx           # Sidebar desktop (72px, expandible)
│   │   ├── bottom-bar.tsx        # Bottom bar móvil
│   │   ├── header.tsx            # Header con título y acciones
│   │   ├── nav-link.tsx          # Link con loading state
│   │   └── navigation-loader.tsx # Barra de progreso global
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── stat-card.tsx         # Tarjeta de estadística
│   │   ├── inventory-chart.tsx   # Gráfico de inventario
│   │   ├── usage-trends-chart.tsx # Gráfico de tendencias
│   │   ├── stock-alerts.tsx      # Panel de alertas
│   │   └── materials-summary.tsx # Resumen de materiales
│   ├── materials/                # Componentes de materiales
│   │   ├── materials-table.tsx   # Tabla desktop
│   │   ├── materials-cards.tsx   # Cards móvil
│   │   └── materials-filters.tsx # Filtros y búsqueda
│   └── production/               # Componentes de producción
│       ├── order-card.tsx        # Tarjeta de orden
│       ├── batch-card.tsx        # Tarjeta de lote
│       └── batch-stats.tsx       # Estadísticas de lote
│
├── lib/                          # Utilidades y helpers
│   ├── utils.ts                  # Utilidades generales (cn, formatters)
│   ├── fetcher.ts                # Cliente HTTP con session cookies
│   └── mock-data.ts              # Datos de ejemplo (temporal)
│
├── types/                        # Definiciones de TypeScript
│   └── index.ts                  # Tipos principales (Material, Orden, Lote, etc.)
│
├── providers/                    # Context providers
│   └── navigation-provider.tsx   # Provider para loading state global
│
├── docs/                         # Documentación
│   ├── PROJECT_CONTEXT.md
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── COMPONENT_PATTERNS.md
│   ├── BACKEND_INTEGRATION_GUIDE.md
│   ├── DESIGN_SYSTEM.md
│   ├── SSR_OPTIMIZATION.md
│   ├── NAVIGATION_LOADING.md
│   ├── DEPLOYMENT.md
│   └── MOBILE_GUIDE.md
│
├── public/                       # Archivos estáticos
│   └── (imágenes, iconos, etc.)
│
├── .env.example                  # Variables de entorno de ejemplo
├── package.json                  # Dependencias
├── tsconfig.json                 # Configuración TypeScript
├── next.config.mjs               # Configuración Next.js
└── README.md                     # Documentación principal
\`\`\`

## Patrones de Arquitectura

### 1. Server Components vs Client Components

**Server Components (por defecto)**
- Páginas que solo muestran datos
- Componentes sin interactividad
- Fetching inicial de datos
- Mejor para SEO y rendimiento

\`\`\`typescript
// app/(dashboard)/materiales/page.tsx
// Server Component (sin 'use client')
export default async function MaterialesPage() {
  // Puede hacer fetch directamente en el servidor
  const materials = await fetchMaterials()
  
  return <MaterialsTable materials={materials} />
}
\`\`\`

**Client Components (cuando se necesita)**
- Interactividad (onClick, onChange, etc.)
- Hooks de React (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)
- Context providers

\`\`\`typescript
// components/materials/materials-filters.tsx
'use client' // ← Marca como Client Component

import { useState } from 'react'

export function MaterialsFilters() {
  const [search, setSearch] = useState('')
  // ... lógica interactiva
}
\`\`\`

### 2. Data Fetching Strategy

**Patrón 1: Server Component + Initial Data**
\`\`\`typescript
// Mejor para: Datos que no cambian frecuentemente
// app/(dashboard)/page.tsx
export default async function DashboardPage() {
  const stats = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stats`, {
    credentials: 'include', // ← Importante para session cookies
    cache: 'no-store' // o 'force-cache' según necesidad
  }).then(res => res.json())
  
  return <DashboardStats stats={stats} />
}
\`\`\`

**Patrón 2: Client Component + SWR**
\`\`\`typescript
// Mejor para: Datos que cambian frecuentemente, necesitan revalidación
'use client'
import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export function LiveBatchMonitor() {
  const { data, error, isLoading } = useSWR(
    '/api/batches/active',
    fetcher,
    { refreshInterval: 5000 } // Revalidar cada 5s
  )
  
  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState />
  
  return <BatchList batches={data} />
}
\`\`\`

**Patrón 3: Hybrid (Server + Client)**
\`\`\`typescript
// Server Component (página)
export default async function BatchDetailPage({ params }) {
  const initialData = await fetchBatch(params.id)
  
  // Pasa datos iniciales al Client Component
  return <BatchDetailClient initialData={initialData} />
}

// Client Component (interactividad)
'use client'
export function BatchDetailClient({ initialData }) {
  const { data } = useSWR(`/api/batches/${initialData.id}`, fetcher, {
    fallbackData: initialData, // ← Usa datos iniciales del servidor
    refreshInterval: 10000
  })
  
  return <BatchDetails batch={data} />
}
\`\`\`

### 3. Loading States (Suspense Boundaries)

Next.js App Router usa Suspense automáticamente con `loading.tsx`:

\`\`\`
app/(dashboard)/seguimiento/
├── page.tsx          → Contenido principal
└── loading.tsx       → Se muestra mientras page.tsx carga

// Next.js hace esto automáticamente:
<Suspense fallback={<LoadingComponent />}>
  <Page />
</Suspense>
\`\`\`

**Jerarquía de Loading:**
1. **NavigationLoader** (barra verde superior) → Transición de ruta
2. **loading.tsx** → Carga de datos en Server Component
3. **Component loading state** → Carga específica de componente

### 4. Error Handling

**Error Boundaries (error.tsx)**
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
    <div>
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  )
}
\`\`\`

**Try-Catch en Server Components**
\`\`\`typescript
export default async function Page() {
  try {
    const data = await fetchData()
    return <Content data={data} />
  } catch (error) {
    return <ErrorState error={error} />
  }
}
\`\`\`

**SWR Error Handling**
\`\`\`typescript
const { data, error } = useSWR('/api/data', fetcher)

if (error) return <ErrorState error={error} />
if (!data) return <LoadingState />

return <Content data={data} />
\`\`\`

## Routing y Navegación

### App Router File Conventions

\`\`\`typescript
// Archivos especiales de Next.js
layout.tsx      // Layout compartido
page.tsx        // Contenido de la ruta
loading.tsx     // UI de carga (Suspense fallback)
error.tsx       // UI de error (Error Boundary)
not-found.tsx   // UI de 404
route.ts        // API Route Handler

// Rutas dinámicas
[id]/           // Parámetro dinámico (params.id)
[...slug]/      // Catch-all route
[[...slug]]/    // Optional catch-all
\`\`\`

### Navegación con Loading State

**Usar NavLink en lugar de Link:**
\`\`\`typescript
import { NavLink } from '@/components/layout/nav-link'

// ✅ Correcto - Activa NavigationLoader
<NavLink href="/seguimiento/LOTE-001">
  Ver Detalle
</NavLink>

// ❌ Evitar - No activa loading state
<Link href="/seguimiento/LOTE-001">
  Ver Detalle
</Link>
\`\`\`

## Responsive Design

### Breakpoints (Tailwind)
\`\`\`css
/* Mobile first */
sm: 640px   /* Tablet pequeña */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
\`\`\`

### Patrones Responsive

**Sidebar → Bottom Bar**
\`\`\`typescript
// Desktop: Sidebar vertical (72px)
<aside className="hidden lg:flex">
  <Sidebar />
</aside>

// Móvil: Bottom bar horizontal
<nav className="lg:hidden">
  <BottomBar />
</nav>
\`\`\`

**Table → Cards**
\`\`\`typescript
// Desktop: Tabla
<div className="hidden md:block">
  <MaterialsTable />
</div>

// Móvil: Cards apiladas
<div className="md:hidden">
  <MaterialsCards />
</div>
\`\`\`

**Texto Responsive**
\`\`\`typescript
// Título que se adapta
<h1 className="text-lg md:text-xl lg:text-2xl">
  Gestión de Materias Primas
</h1>

// Ocultar en móvil
<p className="hidden md:block text-sm">
  Administra tu inventario de insumos cerveceros
</p>
\`\`\`

## Performance Optimization

### 1. Code Splitting Automático
Next.js hace code splitting automático por ruta.

### 2. Image Optimization
\`\`\`typescript
import Image from 'next/image'

<Image
  src="/logo.png"
  alt="Frozen Brewery"
  width={100}
  height={100}
  priority // Para imágenes above-the-fold
/>
\`\`\`

### 3. Dynamic Imports
\`\`\`typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Si no necesita SSR
})
\`\`\`

### 4. Memoization
\`\`\`typescript
import { memo, useMemo, useCallback } from 'react'

// Memoizar componentes pesados
export const BatchCard = memo(function BatchCard({ batch }) {
  // ...
})

// Memoizar cálculos costosos
const sortedBatches = useMemo(() => {
  return batches.sort((a, b) => a.priority - b.priority)
}, [batches])

// Memoizar callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependencies])
\`\`\`

## Seguridad

### 1. Environment Variables
\`\`\`typescript
// Públicas (accesibles en cliente)
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

// Privadas (solo servidor)
DATABASE_URL=postgresql://...
API_SECRET_KEY=...
\`\`\`

### 2. CSRF Protection
El backend maneja CSRF con session cookies.

### 3. XSS Prevention
React escapa automáticamente el contenido.

### 4. Input Validation
\`\`\`typescript
// Validar en cliente Y servidor
import { z } from 'zod'

const materialSchema = z.object({
  nombre: z.string().min(1).max(100),
  stock: z.number().positive(),
  // ...
})
\`\`\`

## Testing Strategy (Futuro)

### Unit Tests
- Vitest para lógica de negocio
- React Testing Library para componentes

### Integration Tests
- Playwright para flujos E2E
- MSW para mock de API

### Visual Regression
- Chromatic o Percy para cambios visuales

## Deployment

### Vercel (Recomendado)
- Deploy automático desde GitHub
- Preview deployments para PRs
- Edge Functions para mejor rendimiento

### Docker (Alternativa)
- Dockerfile incluido
- Compatible con cualquier hosting

## Monitoreo y Analytics

### Performance
- Next.js Analytics (Vercel)
- Web Vitals tracking

### Errors
- Error boundaries capturan errores
- Logs enviados a backend

### User Analytics
- Eventos de navegación
- Acciones críticas (crear orden, actualizar lote)
