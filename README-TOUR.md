# Guía de Uso Interactiva - Driver.js

## 📋 Resumen

Se ha implementado un sistema completo de tours guiados usando **Driver.js** (compatible con React 19) que permite a los usuarios aprender a usar la aplicación de forma interactiva.

## 🎯 Características Implementadas

### 1. Hook Personalizado (`hooks/use-driver.ts`)
- Gestión del estado del tour usando Driver.js
- Funciones para iniciar y detener tours
- Configuración personalizable (showProgress, overlayOpacity, etc.)
- Compatible con React 19

### 2. Context Provider (`contexts/tour-context.tsx`)
- Context global para acceder al tour desde cualquier componente
- Integración con Driver.js
- Funciones:
  - `startTour(route?)`: Inicia el tour para una ruta específica
  - `startFullTour()`: Inicia el tour completo del sistema
  - `stopTour()`: Detiene el tour actual

### 3. Pasos de Tour (`lib/tour-steps.ts`)
Tours definidos para cada sección principal:
- **Dashboard**: Estadísticas y gráficos
- **Materiales**: Inventario, filtros, creación, tabla, almacén
- **Movimientos**: Historial de entradas/salidas
- **Productos**: Gestión de productos y recetas
- **Órdenes**: Planificación y aprobación
- **Seguimiento**: Monitoreo de lotes
- **Configuración**: Días laborales, sectores, parámetros, packagings
- **Packagings**: Gestión de envases
- **Notificaciones**: Centro de notificaciones
- **Perfil**: Información del usuario
- **Usuarios**: Gestión de usuarios (solo ADMIN)

### 4. Componente de Notificación (`components/tour/tour-notification.tsx`)
- Diálogo que aparece automáticamente para nuevos usuarios
- Opciones:
  - "Iniciar Tour": Comienza el tour completo
  - "Ahora no": Descarta temporalmente (vuelve a sugerir en 7 días)
  - "No volver a mostrar": Descarta permanentemente
- Persistencia en localStorage por usuario
- No molesta a usuarios que ya completaron o descartaron el tour

### 5. Botón de Tour (`components/tour/tour-button.tsx`)
- Botón reutilizable para iniciar tours
- Integrado en el Header de la aplicación
- Responsive (solo icono en mobile, con texto en desktop)

## 🚀 Uso

### Iniciar un Tour desde un Componente

```tsx
import { useTour } from '@/contexts/tour-context'

function MyComponent() {
  const { startTour, startFullTour } = useTour()
  
  return (
    <button onClick={() => startTour('/materiales')}>
      Tour de Materiales
    </button>
  )
}
```

### Usar Driver.js Directamente

```tsx
import { useDriver } from '@/hooks/use-driver'
import { materialsSteps } from '@/lib/tour-steps'

function MyComponent() {
  const { startTour } = useDriver()
  
  return (
    <button onClick={() => startTour(materialsSteps)}>
      Iniciar Tour
    </button>
  )
}
```

### Agregar Atributos data-tour a Componentes

Para que los pasos del tour encuentren los elementos, agrega el atributo `data-tour`:

```tsx
<div data-tour="materials-header">
  <h1>Materiales</h1>
</div>
```

### Personalizar Pasos del Tour

Edita `lib/tour-steps.ts` para agregar o modificar pasos:

```tsx
export const mySectionSteps: Step[] = [
  {
    target: '[data-tour="my-element"]',
    content: 'Descripción del elemento',
    placement: 'bottom',
  },
]
```

## 📍 Atributos data-tour Implementados

### Dashboard
- `data-tour="dashboard-stats"`: Tarjetas de estadísticas
- `data-tour="dashboard-charts"`: Sección de gráficos

### Materiales
- `data-tour="materials-header"`: Encabezado de la sección
- `data-tour="materials-filters"`: Filtros
- `data-tour="materials-create"`: Botón de crear
- `data-tour="materials-table"`: Tabla de materiales
- `data-tour="materials-warehouse"`: Panel de almacén

## 🔧 Configuración

### Personalizar Estilos

Edita los estilos en `contexts/tour-context.tsx`:

```tsx
styles={{
  options: {
    primaryColor: '#2563eb', // Color principal
    zIndex: 10000,
  },
  // ... más estilos
}}
```

### Cambiar Textos

Modifica el `locale` en `contexts/tour-context.tsx`:

```tsx
locale={{
  back: 'Atrás',
  close: 'Cerrar',
  last: 'Finalizar',
  next: 'Siguiente',
  skip: 'Omitir'
}}
```

## 📝 Notas Importantes

1. **Selectores CSS**: Los pasos del tour usan selectores CSS (`[data-tour="..."]`). Asegúrate de que los elementos existan en el DOM cuando se inicie el tour.

2. **Navegación**: Si un paso requiere navegar a otra página, el tour se detendrá. Considera crear tours separados por página.

3. **Persistencia**: El estado del tour (completado/descartado) se guarda en `localStorage` por usuario usando su ID.

4. **Responsive**: El tour funciona en mobile y desktop, pero algunos elementos pueden no estar visibles en ciertos breakpoints.

## 🐛 Troubleshooting

### El tour no encuentra un elemento
- Verifica que el atributo `data-tour` esté presente
- Asegúrate de que el elemento esté renderizado cuando se inicia el tour
- Usa las DevTools para verificar que el selector CSS sea correcto

### El tour no se inicia
- Verifica que `TourProvider` esté envolviendo tu aplicación
- Asegúrate de que los pasos estén definidos en `lib/tour-steps.ts`
- Revisa la consola del navegador para errores

### La notificación aparece repetidamente
- Limpia el localStorage: `localStorage.clear()`
- Verifica que el ID del usuario sea consistente

## 📚 Recursos

- [Driver.js Documentation](https://driverjs.com/)
- [Driver.js GitHub](https://github.com/kamranahmedse/driver.js)
- [Driver.js Examples](https://driverjs.com/examples)

