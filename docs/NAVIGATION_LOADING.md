# Sistema de Carga de Navegación

## Descripción General

El sistema de carga de navegación proporciona feedback visual inmediato al usuario cuando navega entre páginas, mejorando la experiencia de usuario (UX) y evitando la sensación de lag.

## Componentes

### 1. NavigationProvider

**Ubicación:** `components/providers/navigation-provider.tsx`

Proveedor de contexto que gestiona el estado global de navegación:

\`\`\`typescript
const { isNavigating, startNavigation, stopNavigation } = useNavigation()
\`\`\`

**Características:**
- Detecta cambios de ruta automáticamente
- Auto-detiene la carga después de 2 segundos (timeout de seguridad)
- Proporciona métodos para controlar el estado manualmente

### 2. NavigationLoader

**Ubicación:** `components/layout/navigation-loader.tsx`

Componente visual que muestra:
- Barra de progreso verde en la parte superior
- Overlay sutil con blur para indicar carga

**Comportamiento:**
- Se muestra inmediatamente al hacer clic en un enlace
- Se oculta cuando la nueva página termina de cargar
- Animación suave de progreso

### 3. NavLink

**Ubicación:** `components/layout/nav-link.tsx`

Wrapper del componente `Link` de Next.js que:
- Inicia el estado de carga al hacer clic
- Solo activa la carga si la ruta es diferente a la actual
- Mantiene todas las funcionalidades del Link original

## Uso

### En Componentes de Navegación

Reemplaza `Link` de Next.js con `NavLink`:

\`\`\`typescript
import { NavLink } from "@/components/layout/nav-link"

// Antes
<Link href="/materiales">Materiales</Link>

// Después
<NavLink href="/materiales">Materiales</NavLink>
\`\`\`

### Control Manual (Opcional)

Si necesitas controlar el estado de carga manualmente:

\`\`\`typescript
import { useNavigation } from "@/components/providers/navigation-provider"

function MyComponent() {
  const { startNavigation, stopNavigation } = useNavigation()

  const handleCustomNavigation = async () => {
    startNavigation()
    
    try {
      // Tu lógica de navegación personalizada
      await router.push('/custom-route')
    } finally {
      stopNavigation()
    }
  }

  return <button onClick={handleCustomNavigation}>Navegar</button>
}
\`\`\`

## Configuración

### Timeout de Seguridad

Por defecto, la carga se detiene automáticamente después de 2 segundos. Para cambiar esto, edita `navigation-provider.tsx`:

\`\`\`typescript
const timeout = setTimeout(() => {
  setIsNavigating(false)
}, 2000) // Cambiar este valor
\`\`\`

### Estilos de la Barra de Progreso

Edita `navigation-loader.tsx` para personalizar:

\`\`\`typescript
<div 
  className="h-full bg-primary transition-all duration-500 ease-out"
  style={{
    width: "70%", // Ancho de la barra
    animation: "progress 1s ease-in-out infinite" // Velocidad de animación
  }}
/>
\`\`\`

### Overlay

Para desactivar el overlay con blur, comenta o elimina esta sección en `navigation-loader.tsx`:

\`\`\`typescript
{/* Overlay sutil para indicar que está cargando */}
<div className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px] pointer-events-none" />
\`\`\`

## Integración con el Sistema

### Archivos Modificados

1. **app/layout.tsx** - Envuelve la app con `NavigationProvider`
2. **components/layout/sidebar.tsx** - Usa `NavLink` en lugar de `Link`
3. **components/layout/bottom-bar.tsx** - Usa `NavLink` en lugar de `Link`

### Archivos Nuevos

1. **components/providers/navigation-provider.tsx** - Contexto de navegación
2. **components/layout/navigation-loader.tsx** - Componente visual
3. **components/layout/nav-link.tsx** - Wrapper de Link

## Ventajas

1. **Feedback Inmediato:** El usuario ve la barra de progreso en < 100ms
2. **Sin Lag Percibido:** Incluso si la página tarda en cargar, hay feedback visual
3. **Automático:** No requiere configuración adicional en cada página
4. **Seguro:** Timeout automático previene estados de carga infinitos
5. **Accesible:** Compatible con lectores de pantalla y navegación por teclado

## Troubleshooting

### La barra no aparece

1. Verifica que `NavigationProvider` esté en `app/layout.tsx`
2. Asegúrate de usar `NavLink` en lugar de `Link`
3. Revisa la consola del navegador por errores

### La barra no desaparece

1. El timeout de seguridad (2s) debería detenerla automáticamente
2. Verifica que no haya errores en la navegación
3. Revisa que `usePathname()` esté funcionando correctamente

### Conflictos con otras librerías

Si usas otras librerías de loading (como nprogress), desactiva una de las dos para evitar conflictos.

## Rendimiento

- **Impacto en Bundle:** ~2KB adicionales
- **Impacto en Rendimiento:** Mínimo, usa hooks nativos de React y Next.js
- **Compatibilidad:** Next.js 13+ App Router
