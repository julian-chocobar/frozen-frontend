# Módulo de Materiales - Integración con Backend

## Resumen de Cambios

Se ha actualizado completamente el módulo de materiales para conectarse con el backend Spring Boot, implementando todas las funcionalidades CRUD y características de la API.

## Archivos Modificados/Creados

### 1. Tipos de Datos (`types/index.ts`)

- ✅ Actualizado tipo `Material` para coincidir con la API del backend
- ✅ Agregado tipo `MaterialUI` para la interfaz de usuario
- ✅ Agregado tipo `MaterialsPageResponse` para respuestas paginadas
- ✅ Agregado tipo `MaterialsFilters` para filtros de la API

### 2. API de Materiales (`lib/materials-api.ts`)

- ✅ Funciones para todas las operaciones CRUD
- ✅ Mapeo entre tipos de API y UI
- ✅ Manejo de filtros y paginación
- ✅ Funciones helper para tipos y unidades

### 3. Página Principal (`page.tsx`)

- ✅ Integración con datos reales del backend
- ✅ Manejo de parámetros de búsqueda en URL
- ✅ Estados de carga y error
- ✅ Paginación funcional

### 4. Componentes de UI

- ✅ `materials-table.tsx` - Actualizado con nuevos tipos y acciones
- ✅ `materials-cards.tsx` - Actualizado para móvil con nuevas funcionalidades
- ✅ `materials-filters.tsx` - Integrado con URL y navegación

### 5. Componentes Cliente (`_components/`)

- ✅ `materials-client.tsx` - Manejo de operaciones CRUD
- ✅ `material-form.tsx` - Formulario para crear/editar materiales
- ✅ `material-details.tsx` - Vista detallada de materiales
- ✅ `pagination.tsx` - Componente de paginación

## Funcionalidades Implementadas

### ✅ Operaciones CRUD Completas

- **Crear**: Formulario completo con validación
- **Leer**: Lista paginada con filtros
- **Actualizar**: Edición inline con formulario
- **Eliminar**: Confirmación antes de eliminar
- **Activar/Desactivar**: Toggle de estado activo

### ✅ Filtros y Búsqueda

- Filtro por categoría (Maltas, Lúpulos, Levaduras, Otros)
- Filtro por estado (Bueno, Bajo, Exceso, Agotado)
- Búsqueda por nombre o código
- Persistencia de filtros en URL

### ✅ Paginación

- Navegación entre páginas
- Información de página actual/total
- Botones anterior/siguiente
- Números de página con elipsis

### ✅ Responsive Design

- Tabla en desktop
- Cards en móvil
- Formularios adaptativos
- Modales responsivos

### ✅ Estados de UI

- Loading states
- Error handling
- Empty states
- Success feedback

## Mapeo de Datos

### API → UI

```typescript
// Backend API
{
  id: number,
  code: string,
  name: string,
  type: 0|1|2|3|4,
  supplier: string,
  value: number,
  stock: number,
  unitMeasurement: "KG"|"LT",
  threshold: number,
  isActive: boolean,
  creationDate: string,
  lastUpdateDate: string
}

// UI Mapping
{
  id: string,
  codigo: string,
  nombre: string,
  categoria: "Maltas"|"Lúpulos"|"Levaduras"|"Otros",
  stock: number,
  unidad: "kg"|"L",
  stockMinimo: number,
  proveedor: string,
  estado: "Bueno"|"Bajo"|"Exceso"|"Agotado",
  costoUnitario: number,
  ultimaActualizacion: string,
  activo: boolean
}
```

## Endpoints Utilizados

- `GET /api/materials` - Lista paginada con filtros
- `GET /api/materials/{id}` - Obtener material por ID
- `POST /api/materials` - Crear nuevo material
- `PUT /api/materials/{id}` - Actualizar material
- `DELETE /api/materials/{id}` - Eliminar material
- `PATCH /api/materials/{id}/toggle-active` - Activar/desactivar

## Configuración Requerida

### Variables de Entorno

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### CORS en Backend

El backend debe permitir credenciales:

```java
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
```

## Próximos Pasos

1. **Testing**: Implementar tests unitarios y de integración
2. **Optimistic Updates**: Mejorar UX con actualizaciones optimistas
3. **Real-time**: Considerar WebSockets para actualizaciones en vivo
4. **Bulk Operations**: Operaciones masivas (importar/exportar)
5. **Audit Trail**: Historial de cambios en materiales

## Notas Técnicas

- Se mantiene compatibilidad con el diseño existente
- Todos los componentes son TypeScript strict
- Manejo de errores robusto con fallbacks
- Accesibilidad mejorada con ARIA labels
- Performance optimizada con lazy loading
