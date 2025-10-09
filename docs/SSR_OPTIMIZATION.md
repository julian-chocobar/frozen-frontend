# Optimización SSR/CSR en Frozen

## Estrategia de Renderizado

### Server Components (Por Defecto)
Todos los componentes son Server Components por defecto en Next.js 14 App Router. Esto significa:

- **Renderizado en el servidor**: El HTML se genera en el servidor
- **Menor bundle de JavaScript**: Solo se envía el HTML al cliente
- **Mejor SEO**: Los motores de búsqueda pueden indexar el contenido
- **Datos frescos**: Se obtienen datos directamente en el servidor

**Componentes que son Server Components:**
- `app/(dashboard)/page.tsx` - Dashboard principal
- `app/(dashboard)/materiales/page.tsx` - Página de materiales
- `app/(dashboard)/produccion/page.tsx` - Página de producción
- `app/(dashboard)/seguimiento/page.tsx` - Página de seguimiento
- Todos los componentes de visualización de datos

### Client Components ("use client")
Solo los componentes que necesitan interactividad son Client Components:

- **Sidebar** (`components/layout/sidebar.tsx`) - Necesita `usePathname` para rutas activas
- **BottomBar** (`components/layout/bottom-bar.tsx`) - Necesita `usePathname`
- **Header** (`components/layout/header.tsx`) - Tiene dropdown interactivo
- **NavigationLoader** (`components/layout/navigation-loader.tsx`) - Monitorea cambios de ruta

**Cuándo usar "use client":**
- Hooks de React (useState, useEffect, useContext)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Hooks de Next.js (useRouter, usePathname, useSearchParams)

## Estados de Carga

### 1. Loading.tsx (Automático)
Next.js muestra automáticamente `loading.tsx` mientras se carga una página:

\`\`\`
app/
  (dashboard)/
    loading.tsx          # Se muestra para todas las rutas del dashboard
    materiales/
      loading.tsx        # Se muestra solo para /materiales
    produccion/
      loading.tsx        # Se muestra solo para /produccion
\`\`\`

**Ventajas:**
- Automático, no requiere código adicional
- Se muestra instantáneamente al navegar
- Streaming SSR: el contenido se renderiza progresivamente

### 2. NavigationLoader (Global)
Barra de progreso en la parte superior que se muestra al cambiar de ruta:

- Feedback visual inmediato (< 100ms)
- No bloquea la UI
- Se oculta automáticamente cuando la página carga

### 3. Suspense Boundaries (Opcional)
Para cargas granulares dentro de una página:

\`\`\`tsx
import { Suspense } from 'react'

<Suspense fallback={<SkeletonCard />}>
  <DataComponent />
</Suspense>
\`\`\`

## Flujo de Navegación

1. **Usuario hace clic en un enlace**
   - NavigationLoader aparece inmediatamente (barra verde superior)
   - El usuario ve feedback visual instantáneo

2. **Next.js comienza la navegación**
   - Se muestra el `loading.tsx` correspondiente
   - El usuario ve el logo de Frozen y un spinner

3. **Servidor renderiza la página**
   - Se obtienen los datos del backend
   - Se genera el HTML en el servidor
   - Se envía al cliente

4. **Página se muestra**
   - NavigationLoader desaparece
   - Contenido aparece con animación fade-in
   - La página es completamente interactiva

## Optimizaciones Implementadas

### 1. Prefetching Automático
Next.js precarga automáticamente las páginas visibles en el viewport:

\`\`\`tsx
<Link href="/materiales">  {/* Se precarga automáticamente */}
  Materiales
</Link>
\`\`\`

### 2. Streaming SSR
El servidor envía HTML progresivamente:
- Header y layout se muestran primero
- Contenido principal se renderiza después
- Componentes pesados se cargan al final

### 3. Caché Inteligente
Next.js cachea automáticamente:
- Rutas estáticas
- Datos de fetch con `cache: 'force-cache'`
- Componentes Server

### 4. Code Splitting
Cada ruta carga solo el JavaScript necesario:
- `/materiales` solo carga el código de materiales
- `/produccion` solo carga el código de producción
- Componentes compartidos se cargan una vez

## Integración con Backend

### Fetch en Server Components
\`\`\`tsx
// app/(dashboard)/materiales/page.tsx
export default async function MaterialesPage() {
  // Esto se ejecuta en el servidor
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/materiales`, {
    credentials: 'include', // Incluye cookies de sesión
    cache: 'no-store', // Siempre datos frescos
  })
  
  const materiales = await response.json()
  
  return <MaterialesTable data={materiales} />
}
\`\`\`

**Ventajas:**
- Las cookies de sesión se envían automáticamente
- No se exponen credenciales al cliente
- Mejor seguridad
- Datos siempre frescos

### Fetch en Client Components
\`\`\`tsx
// Para datos que cambian frecuentemente
"use client"

import useSWR from 'swr'

export function LiveBatchStatus() {
  const { data, error } = useSWR('/api/batches/live', fetcher, {
    refreshInterval: 5000, // Actualizar cada 5 segundos
  })
  
  if (error) return <ErrorState />
  if (!data) return <LoadingSpinner />
  
  return <BatchCards data={data} />
}
\`\`\`

## Métricas de Rendimiento

### Objetivos
- **FCP (First Contentful Paint)**: < 1.5s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **TTI (Time to Interactive)**: < 3.5s
- **CLS (Cumulative Layout Shift)**: < 0.1

### Monitoreo
Usar Vercel Analytics o Web Vitals para monitorear:

\`\`\`tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

## Mejores Prácticas

1. **Mantener Server Components por defecto**
   - Solo usar "use client" cuando sea necesario
   - Mover la interactividad a componentes pequeños

2. **Usar loading.tsx para cada ruta**
   - Proporciona feedback inmediato
   - Mejora la percepción de velocidad

3. **Implementar error.tsx**
   - Manejo de errores graceful
   - Permite recuperación sin recargar

4. **Optimizar imágenes**
   - Usar next/image para lazy loading
   - Especificar width y height

5. **Minimizar JavaScript del cliente**
   - Revisar bundle size regularmente
   - Lazy load componentes pesados

## Troubleshooting

### "Página tarda mucho en cargar"
1. Verificar tiempo de respuesta del backend
2. Revisar si hay fetch bloqueantes
3. Considerar usar Suspense para cargas paralelas

### "Loading no aparece"
1. Verificar que loading.tsx esté en el directorio correcto
2. Asegurar que la navegación use <Link> de Next.js
3. Revisar que no haya errores en la consola

### "Datos desactualizados"
1. Usar `cache: 'no-store'` en fetch
2. Implementar revalidación con `revalidatePath`
3. Considerar usar SWR para datos en tiempo real
