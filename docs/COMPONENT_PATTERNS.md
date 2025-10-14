# Patrones de Componentes - Sistema Frozen

## Principios de Diseño de Componentes

### 1. Single Responsibility
Cada componente debe tener una única responsabilidad clara.

\`\`\`typescript
// ✅ Correcto - Responsabilidad única
export function BatchCard({ batch }: { batch: Batch }) {
  return <Card>...</Card>
}

export function BatchList({ batches }: { batches: Batch[] }) {
  return batches.map(batch => <BatchCard key={batch.id} batch={batch} />)
}

// ❌ Evitar - Múltiples responsabilidades
export function BatchManagement() {
  // Fetching, filtering, sorting, rendering todo en un componente
}
\`\`\`

### 2. Composition over Inheritance
Usar composición de componentes en lugar de herencia.

\`\`\`typescript
// ✅ Correcto - Composición
<Card>
  <CardHeader>
    <CardTitle>Lote 001</CardTitle>
  </CardHeader>
  <CardContent>
    <BatchDetails />
  </CardContent>
</Card>

// ❌ Evitar - Herencia
class BatchCard extends Card {
  // ...
}
\`\`\`

### 3. Props Explícitas
Definir props claramente con TypeScript.

\`\`\`typescript
// ✅ Correcto - Props tipadas
interface BatchCardProps {
  batch: Batch
  onUpdate?: (batch: Batch) => void
  showActions?: boolean
  className?: string
}

export function BatchCard({ 
  batch, 
  onUpdate, 
  showActions = true,
  className 
}: BatchCardProps) {
  // ...
}

// ❌ Evitar - Props sin tipar
export function BatchCard(props: any) {
  // ...
}
\`\`\`

## Patrones de Componentes

### 1. Presentational vs Container Components

**Presentational (Dumb Components)**
- Solo reciben props y renderizan UI
- No tienen estado propio (o estado UI mínimo)
- No hacen fetching de datos
- Reutilizables

\`\`\`typescript
// components/production/batch-card.tsx
interface BatchCardProps {
  batch: Batch
  onViewDetails: (id: string) => void
}

export function BatchCard({ batch, onViewDetails }: BatchCardProps) {
  return (
    <Card className="border-2 border-primary-600">
      <CardHeader>
        <CardTitle>{batch.codigo}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{batch.cerveza}</p>
        <Button onClick={() => onViewDetails(batch.id)}>
          Ver Detalle
        </Button>
      </CardContent>
    </Card>
  )
}
\`\`\`

**Container (Smart Components)**
- Manejan lógica de negocio
- Hacen fetching de datos
- Manejan estado
- Pasan datos a presentational components

\`\`\`typescript
// app/(dashboard)/seguimiento/page.tsx
'use client'
import useSWR from 'swr'
import { BatchCard } from '@/components/production/batch-card'

export default function SeguimientoPage() {
  const { data: batches, isLoading } = useSWR('/api/batches', fetcher)
  
  const handleViewDetails = (id: string) => {
    router.push(`/seguimiento/${id}`)
  }
  
  if (isLoading) return <LoadingSpinner />
  
  return (
    <div className="grid gap-4">
      {batches.map(batch => (
        <BatchCard 
          key={batch.id} 
          batch={batch}
          onViewDetails={handleViewDetails}
        />
      ))}
    </div>
  )
}
\`\`\`

### 2. Compound Components

Componentes que trabajan juntos para formar una API cohesiva.

\`\`\`typescript
// components/ui/card.tsx
export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-card", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold", className)}>
      {children}
    </h3>
  )
}

// Uso
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
\`\`\`

### 3. Render Props Pattern

Pasar funciones como children para mayor flexibilidad.

\`\`\`typescript
interface DataListProps<T> {
  data: T[]
  isLoading: boolean
  renderItem: (item: T) => React.ReactNode
  renderEmpty?: () => React.ReactNode
}

export function DataList<T>({ 
  data, 
  isLoading, 
  renderItem,
  renderEmpty 
}: DataListProps<T>) {
  if (isLoading) return <LoadingSpinner />
  if (data.length === 0) return renderEmpty?.() ?? <EmptyState />
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  )
}

// Uso
<DataList
  data={batches}
  isLoading={isLoading}
  renderItem={(batch) => <BatchCard batch={batch} />}
  renderEmpty={() => <p>No hay lotes activos</p>}
/>
\`\`\`

### 4. Custom Hooks Pattern

Extraer lógica reutilizable en hooks personalizados.

\`\`\`typescript
// hooks/use-batches.ts
export function useBatches(status?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    status ? `/api/batches?status=${status}` : '/api/batches',
    fetcher
  )
  
  const updateBatch = async (id: string, updates: Partial<Batch>) => {
    // Optimistic update
    mutate(
      data?.map(b => b.id === id ? { ...b, ...updates } : b),
      false
    )
    
    try {
      await fetch(`/api/batches/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
        credentials: 'include'
      })
      mutate() // Revalidar
    } catch (error) {
      mutate() // Revertir en caso de error
      throw error
    }
  }
  
  return {
    batches: data,
    isLoading,
    error,
    updateBatch
  }
}

// Uso
function BatchList() {
  const { batches, isLoading, updateBatch } = useBatches('active')
  
  // ...
}
\`\`\`

### 5. Higher-Order Components (HOC)

Envolver componentes para agregar funcionalidad.

\`\`\`typescript
// hoc/with-auth.tsx
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    
    if (isLoading) return <LoadingSpinner />
    if (!user) redirect('/login')
    
    return <Component {...props} />
  }
}

// Uso
const ProtectedPage = withAuth(DashboardPage)
\`\`\`

## Patrones de Estado

### 1. Local State (useState)

Para estado que solo afecta al componente.

\`\`\`typescript
export function MaterialsFilters() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  
  return (
    <div>
      <input 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      <select 
        value={category} 
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="all">Todas</option>
        <option value="maltas">Maltas</option>
      </select>
    </div>
  )
}
\`\`\`

### 2. URL State (searchParams)

Para estado que debe persistir en la URL.

\`\`\`typescript
'use client'
import { useSearchParams, useRouter } from 'next/navigation'

export function MaterialsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const category = searchParams.get('category') ?? 'all'
  
  const setCategory = (newCategory: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('category', newCategory)
    router.push(`?${params.toString()}`)
  }
  
  return <MaterialsFilters category={category} onCategoryChange={setCategory} />
}
\`\`\`

### 3. Global State (Context)

Para estado compartido entre múltiples componentes.

\`\`\`typescript
// providers/navigation-provider.tsx
const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  
  return (
    <NavigationContext.Provider value={{ isNavigating, setIsNavigating }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used within NavigationProvider')
  return context
}

// Uso
function NavLink({ href, children }: NavLinkProps) {
  const { setIsNavigating } = useNavigation()
  
  const handleClick = () => {
    setIsNavigating(true)
  }
  
  return <Link href={href} onClick={handleClick}>{children}</Link>
}
\`\`\`

### 4. Server State (SWR)

Para datos del servidor con cache y revalidación.

\`\`\`typescript
import useSWR from 'swr'

export function BatchMonitor() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/batches/active',
    fetcher,
    {
      refreshInterval: 5000, // Revalidar cada 5s
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  )
  
  // Forzar revalidación manual
  const refresh = () => mutate()
  
  return (
    <div>
      <Button onClick={refresh}>Actualizar</Button>
      {data?.map(batch => <BatchCard key={batch.id} batch={batch} />)}
    </div>
  )
}
\`\`\`

## Patrones de Styling

### 1. Utility-First con Tailwind

\`\`\`typescript
// ✅ Correcto - Utilities de Tailwind
<div className="flex items-center justify-between p-4 bg-background border-2 border-primary-600 rounded-lg">
  <h2 className="text-lg font-semibold text-primary-600">Título</h2>
  <Button className="bg-primary-600 hover:bg-primary-700">Acción</Button>
</div>

// ❌ Evitar - CSS inline
<div style={{ display: 'flex', padding: '16px' }}>
  ...
</div>
\`\`\`

### 2. Conditional Classes con cn()

\`\`\`typescript
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant: 'success' | 'warning' | 'error'
  children: React.ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={cn(
      "px-2 py-1 rounded text-xs font-medium",
      {
        "bg-green-100 text-green-700": variant === 'success',
        "bg-yellow-100 text-yellow-700": variant === 'warning',
        "bg-red-100 text-red-700": variant === 'error',
      }
    )}>
      {children}
    </span>
  )
}
\`\`\`

### 3. Responsive Classes

\`\`\`typescript
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4 
  p-4 
  md:p-6 
  lg:p-8
">
  {/* Contenido */}
</div>
\`\`\`

### 4. CSS Variables para Theming

\`\`\`typescript
// globals.css
@theme inline {
  --color-primary-600: #2563eb;
  --color-background: #faf9f6;
}

// Uso en componentes
<div className="bg-background text-primary-600">
  {/* El color se adapta al theme */}
</div>
\`\`\`

## Patrones de Formularios

### 1. Controlled Components

\`\`\`typescript
export function MaterialForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    stock: 0,
    categoria: 'Maltas'
  })
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMaterial(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.nombre}
        onChange={(e) => handleChange('nombre', e.target.value)}
      />
      {/* ... más campos */}
      <Button type="submit">Guardar</Button>
    </form>
  )
}
\`\`\`

### 2. Form Validation

\`\`\`typescript
import { z } from 'zod'

const materialSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  stock: z.number().positive('El stock debe ser positivo'),
  categoria: z.enum(['Maltas', 'Lúpulos', 'Levaduras'])
})

export function MaterialForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validated = materialSchema.parse(formData)
      await createMaterial(validated)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message
          return acc
        }, {} as Record<string, string>)
        setErrors(fieldErrors)
      }
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input {...} />
      {errors.nombre && <span className="text-red-600">{errors.nombre}</span>}
    </form>
  )
}
\`\`\`

## Patrones de Performance

### 1. Lazy Loading

\`\`\`typescript
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./heavy-chart'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

export function Dashboard() {
  return (
    <div>
      <Stats />
      <HeavyChart /> {/* Solo se carga cuando es visible */}
    </div>
  )
}
\`\`\`

### 2. Virtualization (Listas Largas)

\`\`\`typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function MaterialsList({ materials }: { materials: Material[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: materials.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  })
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <MaterialCard material={materials[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
\`\`\`

### 3. Debouncing

\`\`\`typescript
import { useDebouncedCallback } from 'use-debounce'

export function SearchInput() {
  const [search, setSearch] = useState('')
  
  const debouncedSearch = useDebouncedCallback(
    (value: string) => {
      // Hacer búsqueda en API
      fetchResults(value)
    },
    500 // 500ms delay
  )
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSearch(value)
  }
  
  return <input value={search} onChange={handleChange} />
}
\`\`\`

## Convenciones de Nomenclatura

### Componentes
\`\`\`typescript
// PascalCase para componentes
export function BatchCard() {}
export function MaterialsTable() {}

// Archivos: kebab-case
// batch-card.tsx
// materials-table.tsx
\`\`\`

### Props
\`\`\`typescript
// camelCase para props
interface BatchCardProps {
  batchId: string
  showActions: boolean
  onUpdate: (batch: Batch) => void
}
\`\`\`

### Handlers
\`\`\`typescript
// Prefijo "handle" para event handlers
const handleClick = () => {}
const handleSubmit = () => {}
const handleChange = () => {}

// Prefijo "on" para props de callback
<Button onClick={handleClick} />
<Form onSubmit={handleSubmit} />
\`\`\`

### Boolean Props
\`\`\`typescript
// Prefijos is/has/should
interface ComponentProps {
  isLoading: boolean
  hasError: boolean
  shouldShowDetails: boolean
}
\`\`\`

## Checklist de Componente

Antes de considerar un componente "completo":

- [ ] TypeScript types definidos
- [ ] Props documentadas (JSDoc si es público)
- [ ] Manejo de loading state
- [ ] Manejo de error state
- [ ] Manejo de empty state
- [ ] Responsive (mobile-first)
- [ ] Accesible (ARIA, keyboard navigation)
- [ ] Comentarios en español para lógica compleja
- [ ] Usa design tokens (no colores hardcodeados)
- [ ] Optimizado (memo si es necesario)
