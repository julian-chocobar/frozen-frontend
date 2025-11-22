# Documentación del Proyecto - Frozen Frontend

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Arquitectura y Diseño](#arquitectura-y-diseño)
4. [Flujos Principales](#flujos-principales)
5. [Sistema de Diseño](#sistema-de-diseño)
6. [Componentes Clave](#componentes-clave)
7. [APIs y Comunicación](#apis-y-comunicación)
8. [Tecnologías Utilizadas](#tecnologías-utilizadas)

---

## 🎯 Visión General

**Frozen** es una aplicación web de gestión de producción cervecera desarrollada con **Next.js 15** y **React 19**. El sistema permite gestionar materiales, productos, órdenes de producción, lotes, seguimiento de calidad y análisis de datos en tiempo real.

### Características Principales

- ✅ Autenticación con Spring Security
- ✅ Notificaciones en tiempo real (Server-Sent Events)
- ✅ Dashboard con gráficos interactivos (Recharts)
- ✅ Gestión completa de inventario
- ✅ Seguimiento de producción y calidad
- ✅ Sistema de roles y permisos
- ✅ Diseño responsive (mobile-first)
- ✅ Tema beige minimalista con tipografía monoespaciada

---

## 📁 Estructura del Proyecto

```
frozen-frontend/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Grupo de rutas protegidas
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── layout.tsx            # Layout del dashboard
│   │   ├── materiales/            # Gestión de materiales
│   │   ├── productos/            # Gestión de productos
│   │   ├── ordenes/              # Órdenes de producción
│   │   ├── seguimiento/          # Seguimiento de lotes
│   │   ├── movimientos/          # Movimientos de almacén
│   │   ├── packagings/           # Gestión de packagings
│   │   ├── usuarios/             # Gestión de usuarios
│   │   ├── configuracion/        # Configuración del sistema
│   │   ├── perfil/               # Perfil de usuario
│   │   └── ...
│   ├── login/                    # Página de login
│   ├── api/                      # API Routes (Next.js)
│   │   ├── notifications/stream/ # Proxy SSE para notificaciones
│   │   └── backend-config/       # Configuración del backend
│   ├── layout.tsx                # Layout raíz
│   └── globals.css               # Estilos globales
│
├── components/                    # Componentes React
│   ├── auth/                     # Componentes de autenticación
│   ├── dashboard/                # Componentes del dashboard
│   │   ├── inventory-chart.tsx   # Gráfico de producción (Recharts)
│   │   ├── usage-trends-chart.tsx # Gráfico de consumo (Recharts)
│   │   ├── waste-chart.tsx       # Gráfico de desperdicios (Recharts)
│   │   └── stat-card.tsx         # Tarjetas de estadísticas
│   ├── layout/                    # Componentes de layout
│   │   ├── header.tsx            # Header con navegación
│   │   ├── sidebar.tsx           # Sidebar (desktop)
│   │   ├── bottom-bar.tsx        # Barra inferior (mobile)
│   │   └── navigation.tsx        # Sistema de navegación
│   ├── materials/                # Componentes de estado (materiales)
│   │   ├── materials-loading-state.tsx
│   │   ├── materials-empty-state.tsx
│   │   └── materials-error-state.tsx
│   ├── movements/                # Componentes de estado (movimientos)
│   ├── orders/                   # Componentes de estado (órdenes)
│   ├── products/                 # Componentes de estado (productos)
│   ├── batches/                  # Componentes de estado (lotes)
│   ├── packagings/               # Componentes de estado (packagings)
│   ├── users/                    # Componentes de estado (usuarios)
│   ├── ui/                       # Componentes UI reutilizables
│   │   ├── chart.tsx             # Wrapper para Recharts
│   │   ├── tabs.tsx              # Componente de pestañas
│   │   ├── button.tsx            # Botones
│   │   └── ...                   # Otros componentes shadcn/ui
│   └── production/               # Componentes de producción
│
├── contexts/                      # React Contexts
│   ├── auth-context.tsx          # Contexto de autenticación
│   └── notifications-context.tsx # Contexto de notificaciones
│
├── hooks/                         # Custom Hooks
│   ├── use-notifications.ts      # Hook para notificaciones SSE
│   ├── use-toast.ts              # Hook para toasts
│   └── use-mobile.ts             # Hook para detección móvil
│
├── lib/                           # Utilidades y APIs (organizadas por módulo)
│   ├── config.ts                 # Configuración centralizada
│   ├── constants.ts              # Constantes centralizadas (~1350 líneas)
│   ├── utils.ts                  # Utilidades compartidas
│   ├── fetcher.ts                # Cliente HTTP para backend
│   ├── error-handler.ts          # Manejo centralizado de errores
│   ├── prop-validation.ts        # Validación de props en desarrollo
│   ├── analytics-api.ts          # API de análisis y gráficos
│   ├── materials/                # Módulo de materiales
│   │   ├── api.ts                # API con JSDoc completo
│   │   ├── utils.ts              # ~20 funciones utilitarias
│   │   └── index.ts              # Barrel export
│   ├── movements/                # Módulo de movimientos
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── orders/                   # Módulo de órdenes
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── products/                 # Módulo de productos
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── batches/                  # Módulo de lotes
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── packagings/               # Módulo de packagings
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   ├── users/                    # Módulo de usuarios
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── index.ts
│   └── ...                       # Otros módulos
│
├── types/                         # Definiciones TypeScript (organizadas por entidad)
│   ├── index.ts                  # Barrel export principal
│   ├── common.ts                 # Tipos compartidos
│   ├── materials.ts              # Tipos de materiales
│   ├── warehouse.ts              # Tipos de almacén
│   ├── movements.ts              # Tipos de movimientos
│   ├── packagings.ts             # Tipos de packagings
│   ├── products.ts               # Tipos de productos
│   ├── phases.ts                 # Tipos de fases
│   ├── recipes.ts                # Tipos de recetas
│   ├── orders.ts                 # Tipos de órdenes
│   ├── batches.ts                # Tipos de lotes
│   ├── production.ts             # Tipos de producción
│   ├── quality.ts                # Tipos de calidad
│   ├── users.ts                  # Tipos de usuarios
│   ├── notifications.ts          # Tipos de notificaciones
│   ├── sectors.ts                # Tipos de sectores
│   ├── analytics.ts              # Tipos de análisis
│   ├── config.ts                 # Tipos de configuración
│   ├── auth.ts                   # Tipos de autenticación
│   └── recharts.ts               # Tipos para Recharts
│
└── public/                        # Archivos estáticos
    └── ...                        # Imágenes y assets
```

---

## 🏗️ Arquitectura y Diseño

### Arquitectura General

```
┌────────────────────────────────────────────────────────┐
│                    Next.js Frontend                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   App Router │  │  Components  │  │   Contexts   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                │                │            │
│         └────────────────┼────────────────┘            │
│                          │                             │
│         ┌────────────────┴───────────────┐             │
│         │      API Layer (lib/)          │             │
│         └────────────────┬───────────────┘             │
└──────────────────────────┼─────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │   Next.js API Routes (Proxy)      │
         └─────────────────┬─────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         │   Spring Boot Backend (Java)      │
         └───────────────────────────────────┘
```

### Principios de Diseño

1. **Component-Based Architecture**: Componentes reutilizables y modulares
2. **Server-Side Rendering (SSR)**: Next.js App Router para mejor SEO y rendimiento
3. **Client-Side State Management**: React Context API para estado global
4. **Type Safety**: TypeScript en todo el proyecto
5. **Responsive Design**: Mobile-first con breakpoints adaptativos

---

## 🔄 Flujos Principales

### 1. Flujo de Autenticación

```
Usuario → Login Page
    ↓
Ingresa credenciales
    ↓
AuthContext.login()
    ↓
auth-api.login() → Backend (/api/auth/login)
    ↓
Backend valida → Retorna JSESSIONID cookie
    ↓
AuthContext obtiene usuario actual (/api/auth/me)
    ↓
Estado actualizado → Usuario autenticado
    ↓
Redirección a Dashboard
```

**Archivos clave:**

- `app/login/page.tsx` - Página de login
- `contexts/auth-context.tsx` - Gestión de estado de autenticación
- `lib/auth-api.ts` - Llamadas API de autenticación
- `components/auth/protected-route.tsx` - Protección de rutas

### 2. Flujo de Notificaciones en Tiempo Real

```
Cliente → Hook useNotifications
    ↓
Conecta a /api/notifications/stream (SSE)
    ↓
Next.js API Route → Proxy al backend
    ↓
Backend SSE → Envía eventos en tiempo real
    ↓
Cliente recibe eventos:
    - 'connected': Conexión establecida
    - 'initial': Notificaciones iniciales
    - 'notification': Nueva notificación
    - 'stats-update': Actualización de estadísticas
    ↓
Estado actualizado → UI refleja cambios
```

**Archivos clave:**

- `hooks/use-notifications.ts` - Hook para SSE
- `app/api/notifications/stream/route.ts` - Proxy SSE
- `components/layout/notifications-panel.tsx` - Panel de notificaciones

### 3. Flujo de Datos del Dashboard

```
Dashboard Page
    ↓
Carga estadísticas (analytics-api.getDashboardMonthly)
    ↓
Muestra StatCards (carrusel horizontal)
    ↓
Gráficos con Recharts:
    - InventoryChart (Producción - Azul)
    - UsageTrendsChart (Consumo - Naranja)
    - WasteChart (Desperdicios - Rojo)
    ↓
Vistas configurables:
    - Tabs: Pestañas individuales
    - Grid: Cuadrícula 2 columnas
    - List: Lista vertical
```

**Archivos clave:**

- `app/(dashboard)/page.tsx` - Dashboard principal
- `components/dashboard/*-chart.tsx` - Componentes de gráficos
- `lib/analytics-api.ts` - API de análisis

### 4. Flujo de Gestión de Materiales

```
Materiales Page
    ↓
Carga materiales (materials-api.getMaterials)
    ↓
Filtros y búsqueda (MaterialsFilters)
    ↓
Vista de tarjetas o tabla (MaterialsClient)
    ↓
Acciones:
    - Crear material (MaterialForm)
    - Editar material (Modal)
    - Ver detalles (Modal)
    - Panel de almacén (WarehousePanel)
```

**Archivos clave:**

- `app/(dashboard)/materiales/page.tsx`
- `app/(dashboard)/materiales/_components/*`
- `lib/materials-api.ts`

---

## 🎨 Sistema de Diseño

### Paleta de Colores

**Colores Principales:**

- **Fondo**: Beige claro (`#faf9f6`) - `--color-background`
- **Primario**: Azul índigo (`#2563eb`) - `--color-primary-600`
- **Alerta**: Rojo (`#ef4444`) - `--color-alert-500`
- **Éxito**: Verde (`#22c55e`) - `--color-success-500`

**Colores por Sección (Dashboard):**

- **Producción**: Azul (`blue-50`, `blue-600`)
- **Consumo**: Naranja (`orange-50`, `orange-600`)
- **Desperdicios**: Rojo (`red-50`, `red-600`)

### Tipografía

- **Fuente Principal**: JetBrains Mono (monoespaciada)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)
- **Tamaños**: Responsive con breakpoints móvil/tablet/desktop

### Componentes de Diseño

**Cards:**

- Fondo blanco con borde de 2px
- Sombras sutiles con hover
- Bordes redondeados (`rounded-2xl`)
- Efecto glassmorphism en algunos casos

**Gráficos:**

- Tooltips oscuros con bordes de color
- Grids sutiles (`rgba(0, 0, 0, 0.05)`)
- Colores consistentes por categoría
- Responsive con `ResponsiveContainer`

**Navegación:**

- Sidebar en desktop (fijo)
- Bottom bar en mobile (fijo)
- Header sticky con notificaciones

---

## 🧩 Componentes Clave

### Layout Components

#### `Header` (`components/layout/header.tsx`)

- Título y subtítulo dinámicos
- Botón de acción opcional
- Notificaciones con contador
- Menú de usuario con roles
- Botón de menú móvil

#### `Sidebar` (`components/layout/sidebar.tsx`)

- Navegación principal
- Iconos con Lucide React
- Indicador de ruta activa
- Solo visible en desktop

#### `BottomBar` (`components/layout/bottom-bar.tsx`)

- Navegación móvil simplificada
- Iconos principales
- Solo visible en mobile

### State Components (Componentes de Estado)

Cada módulo tiene 3 componentes de estado reutilizables siguiendo un patrón consistente:

#### Componentes de Carga (`*-loading-state.tsx`)

- Muestra skeleton loaders mientras se cargan datos
- Prop `count` para controlar cantidad de elementos
- Estilos consistentes con el módulo
- **Ejemplos**: `MaterialsLoadingState`, `OrdersLoadingState`, `UsersLoadingState`

#### Componentes Vacíos (`*-empty-state.tsx`)

- Se muestra cuando no hay datos o resultados
- Props opcionales: `title`, `description`, `onAction`, `actionLabel`
- Icono contextual del módulo
- Botón de acción opcional (ej: "Crear Material")
- **Ejemplos**: `MaterialsEmptyState`, `ProductsEmptyState`, `PackagingsEmptyState`

#### Componentes de Error (`*-error-state.tsx`)

- Muestra errores con mensajes descriptivos
- Props: `message`, `onRetry`, `isRetrying`
- Botón de reintentar con indicador de loading
- Alert con estilo destructivo
- **Ejemplos**: `MaterialsErrorState`, `BatchesErrorState`, `MovementsErrorState`

**Módulos con componentes de estado**:

- Materials (materiales)
- Movements (movimientos)
- Orders (órdenes)
- Products (productos)
- Batches (lotes)
- Packagings (packagings)
- Users (usuarios)

### Dashboard Components

#### `StatCard` (`components/dashboard/stat-card.tsx`)

- Tarjeta de estadística
- Variantes: default, primary, success, alert
- Icono opcional
- Gradiente sutil de fondo
- Hover con elevación

#### `InventoryChart` (`components/dashboard/inventory-chart.tsx`)

- Gráfico de producción mensual
- Tipos: Línea, Barras
- Filtros por producto y fechas
- Color azul (`#3b82f6`)

#### `UsageTrendsChart` (`components/dashboard/usage-trends-chart.tsx`)

- Gráfico de consumo de materiales
- Tipos: Línea, Barras
- Filtros por material y fechas
- Color naranja (`#f97316`)

#### `WasteChart` (`components/dashboard/waste-chart.tsx`)

- Gráfico de desperdicios
- Tipos: Línea, Barras, Torta
- Filtros por fase y transferOnly
- Color rojo (`#ef4444`)

### UI Components

Todos los componentes UI están basados en **shadcn/ui** y **Radix UI**:

- Accesibilidad integrada
- Temas personalizables
- TypeScript completo
- Composición flexible

---

## 🔌 APIs y Comunicación

### Cliente HTTP (`lib/fetcher.ts`)

**Características:**

- Manejo automático de cookies JSESSIONID
- Proxy Next.js para desarrollo
- Conexión directa al backend en producción
- Manejo de errores centralizado
- Logging condicional

**Uso:**

```typescript
import { api } from "@/lib/materials"; // Módulo específico

const data = await api.get<Material[]>("/api/materials", {
  page: "0",
  size: "10",
});
```

### APIs por Módulo (Estructura Modular)

Todas las APIs están organizadas en módulos con estructura consistente:

**Materiales** (`lib/materials/`):

- `getMaterials()` - Listar materiales con paginación
- `getMaterialById()` - Obtener material por ID
- `createMaterial()` - Crear nuevo material
- `updateMaterial()` - Actualizar material existente
- `toggleMaterialActive()` - Activar/desactivar material
- `getUnitMeasurements()` - Obtener unidades de medida
- **Utils**: 20 funciones (formateo, validación, filtrado, estadísticas)
- **Documentación**: JSDoc completo con ejemplos

**Movimientos** (`lib/movements/`):

- `getMovements()` - Listar movimientos con filtros
- `getMovementById()` - Obtener movimiento por ID
- `createMovement()` - Registrar nuevo movimiento
- `getMovementTypes()` - Tipos de movimiento disponibles
- **Utils**: 22 funciones (formateo de tipo/fecha, iconos, validación, estadísticas)
- **Documentación**: JSDoc completo

**Órdenes** (`lib/orders/`):

- `getProductionOrders()` - Listar órdenes de producción
- `getProductionOrderById()` - Obtener orden por ID
- `createProductionOrder()` - Crear nueva orden
- `updateProductionOrder()` - Actualizar orden
- `approveProductionOrder()` - Aprobar orden
- `rejectProductionOrder()` - Rechazar orden
- **Utils**: 18 funciones (estado, formateo de fechas, validación, estadísticas)
- **Documentación**: JSDoc completo

**Productos** (`lib/products/`):

- `getProducts()` - Listar productos con paginación
- `getProductById()` - Obtener producto por ID
- `createProduct()` - Crear nuevo producto
- `updateProduct()` - Actualizar producto
- `toggleProductActive()` - Activar/desactivar producto
- `getProductsIdNameList()` - Lista simplificada para dropdowns
- **Utils**: 25 funciones (alcoholic text, iconos, formateo, validación, filtrado, estadísticas)
- **Documentación**: JSDoc completo

**Lotes** (`lib/batches/`):

- `getBatches()` - Listar lotes con filtros
- `getBatchById()` - Obtener lote por ID
- `updateBatch()` - Actualizar información del lote
- `cancelBatch()` - Cancelar lote
- `getBatchStatusOptions()` - Opciones de estado disponibles
- **Utils**: 27 funciones (estado, iconos, formateo de fechas, validación, estadísticas, progreso)
- **Documentación**: JSDoc completo

**Packagings** (`lib/packagings/`):

- `getPackagings()` - Listar packagings con paginación
- `getPackagingById()` - Obtener packaging por ID
- `createPackaging()` - Crear nuevo packaging
- `updatePackaging()` - Actualizar packaging
- `togglePackagingActive()` - Activar/desactivar packaging
- `getPackagingsIdNameList()` - Lista simplificada
- `getUnitMeasurements()` - Unidades de medida disponibles
- **Utils**: 17 funciones (formateo, validación, filtrado, estadísticas)
- **Documentación**: JSDoc completo

**Usuarios** (`lib/users/`):

- `getUsers()` - Listar usuarios con paginación
- `getUserById()` - Obtener usuario por ID
- `createUser()` - Crear nuevo usuario
- `updateUser()` - Actualizar información de usuario
- `updateUserRoles()` - Actualizar roles
- `updateUserPassword()` - Cambiar contraseña
- `toggleUserActive()` - Activar/desactivar usuario
- `getRoles()` - Lista de roles disponibles
- **Utils**: 25 funciones (formateo de nombre, iconos por rol, badges, validación, búsqueda, estadísticas)
- **Documentación**: JSDoc completo

**Análisis** (`lib/analytics-api.ts`):

- `getDashboardMonthly()` - Estadísticas del dashboard
- `getMonthlyProduction()` - Producción mensual
- `getMonthlyMaterialConsumption()` - Consumo mensual
- `getMonthlyWaste()` - Desperdicios mensuales

**Autenticación** (`lib/auth/api.ts`):

- `login()` - Iniciar sesión
- `logout()` - Cerrar sesión
- `getCurrentUser()` - Usuario actual
- `validateSession()` - Validar sesión

### Manejo de Errores

**Sistema centralizado** (`lib/error-handler.ts`):

- Detección de tipos de error
- Mensajes amigables
- Toasts automáticos
- Logging en consola

**Componente de Error** (`components/ui/error-state.tsx`):

- Estados de error visuales
- Botones de reintento
- Detección de errores de conexión

---

## 🛠️ Tecnologías Utilizadas

### Core

- **Next.js 15.2.4** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático

### UI y Estilos

- **Tailwind CSS 4.1.9** - Framework CSS utility-first
- **Radix UI** - Componentes accesibles sin estilos
- **shadcn/ui** - Componentes UI construidos sobre Radix
- **Lucide React** - Iconos
- **Recharts** - Gráficos interactivos

### Estado y Datos

- **React Context API** - Estado global
- **React Hooks** - Lógica reutilizable
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

### Utilidades

- **date-fns** - Manipulación de fechas
- **class-variance-authority** - Variantes de componentes
- **tailwind-merge** - Merge de clases CSS

### Testing

- **Playwright** - Testing E2E

---

## 📱 Responsive Design

### Breakpoints

- **Mobile**: `< 768px` - Bottom bar, navegación simplificada
- **Tablet**: `768px - 1024px` - Sidebar colapsable
- **Desktop**: `> 1024px` - Sidebar completo, layout completo

### Estrategia Mobile-First

- Diseño base para móvil
- Mejoras progresivas para pantallas grandes
- Componentes adaptativos (cards, tablas, gráficos)
- Navegación contextual según dispositivo

---

## 🔐 Seguridad

### Autenticación

- **Spring Security** en el backend
- **Cookies JSESSIONID** para sesiones
- **Protected Routes** en el frontend
- **Validación de sesión** al cargar la app

### Protección de Rutas

```typescript
// app/(dashboard)/layout.tsx
<ProtectedRoute>{/* Contenido protegido */}</ProtectedRoute>
```

El componente `ProtectedRoute`:

- Verifica autenticación
- Redirige a login si no está autenticado
- Muestra loading durante verificación

---

## 📊 Gráficos y Visualización

### Recharts

Todos los gráficos usan **Recharts** para:

- Mejor integración con React
- Rendimiento optimizado
- Estilos personalizables
- Responsive automático

### Tipos de Gráficos

1. **LineChart**: Líneas suaves con área rellena
2. **BarChart**: Barras con bordes redondeados
3. **PieChart**: Gráfico de pastel (solo desperdicios)

### Personalización

- Tooltips personalizados con estilos oscuros
- Colores por categoría (azul/naranja/rojo)
- Grids sutiles
- Ejes con formato personalizado

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Testing
npm run lint         # Ejecuta linter
```

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`InventoryChart.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useNotifications.ts`)
- **Utilidades**: camelCase (`fetcher.ts`, `utils.ts`)
- **Tipos**: PascalCase (`Material`, `DashboardStatsDTO`)

### Estructura de Componentes

```typescript
// 1. Imports
import { ... } from '...'

// 2. Tipos e interfaces
interface ComponentProps { ... }

// 3. Componente principal
export function Component({ ... }: ComponentProps) {
  // 4. Estados
  const [state, setState] = useState(...)

  // 5. Memoización (si aplica)
  const memoizedValue = useMemo(() => { ... }, [deps])

  // 6. Callbacks
  const handleAction = useCallback(() => { ... }, [deps])

  // 7. Effects
  useEffect(() => { ... }, [deps])

  // 8. Render
  return ( ... )
}
```

### Estructura de Módulo (Patrón Establecido)

```
lib/[module]/
├── api.ts        # Funciones API con JSDoc completo
├── utils.ts      # 15-27 funciones utilitarias con JSDoc
└── index.ts      # Barrel export (re-exporta api y utils)

components/[module]/
├── [module]-loading-state.tsx   # Skeleton loaders
├── [module]-empty-state.tsx     # Estado vacío con acción
└── [module]-error-state.tsx     # Error con retry

types/
├── [module].ts   # Tipos específicos del módulo
└── index.ts      # Barrel export de todos los tipos
```

### Patrón de Constantes por Módulo

En `lib/constants.ts`, cada módulo tiene:

```typescript
// Etiquetas y configuraciones
export const [MODULE]_STATUS_LABELS: Record<string, string>
export const [MODULE]_BADGE_COLORS: Record<string, BadgeConfig>

// Paginación
export const [MODULE]_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEFAULT_PAGE: 1,
}

// Mensajes
export const [MODULE]_ERROR_MESSAGES: Record<string, string>
export const [MODULE]_SUCCESS_MESSAGES: Record<string, string>
export const [MODULE]_EMPTY_MESSAGES: Record<string, string>

// Filtros y validación
export const [MODULE]_FILTER_OPTIONS: Array<Option>
export const [MODULE]_VALIDATION_LIMITS: Record<string, number>
```

### Funciones Utilitarias Comunes por Módulo

Cada `utils.ts` típicamente incluye:

1. **Formateo**:

   - `formatXxxDate()` - Formatear fechas
   - `formatXxxQuantity()` - Formatear cantidades
   - `formatXxxStatus()` - Formatear estados

2. **Configuración Visual**:

   - `getXxxIcon()` - Obtener icono por tipo/estado
   - `getXxxBadgeConfig()` - Configuración de badges

3. **Validación**:

   - `validateXxxData()` - Validar datos del formulario

4. **Filtrado y Búsqueda**:

   - `filterXxxByStatus()` - Filtrar por estado
   - `filterXxxByType()` - Filtrar por tipo
   - `searchXxx()` - Búsqueda por texto

5. **Estadísticas**:

   - `calculateXxxStats()` - Calcular estadísticas

6. **Ordenamiento**:

   - `sortXxxByName()` - Ordenar por nombre
   - `sortXxxByDate()` - Ordenar por fecha

7. **Resumen**:
   - `getXxxSummary()` - Generar resumen de texto

---

### Organización de Archivos

- **Páginas**: `app/(dashboard)/[module]/page.tsx`
- **Componentes de página**: `app/(dashboard)/[module]/_components/*`
- **Componentes de estado**: `components/[module]/*-state.tsx`
- **Componentes compartidos**: `components/[category]/*`
- **APIs por módulo**: `lib/[module]/api.ts`
- **Utils por módulo**: `lib/[module]/utils.ts`
- **Constantes**: `lib/constants.ts` (centralizadas)
- **Tipos por entidad**: `types/[entity].ts`
- **Barrel exports**: `types/index.ts`, `lib/[module]/index.ts`

---

## 🔄 Flujos de Datos

### Flujo Típico de una Página (Patrón Actualizado)

1. Usuario navega a /materiales
2. Page component carga
3. useMemo → Memoiza parámetros de búsqueda
4. useEffect → Llama a getMaterials() desde lib/materials
5. API hace request al backend via api.get()
6. Backend responde con datos
7. Estado actualizado con setState
8. Si hay error → MaterialsErrorState con botón retry
9. Si está cargando → MaterialsLoadingState con skeletons
10. Si no hay datos → MaterialsEmptyState con acción
11. Si hay datos → MaterialsClient renderiza contenido
12. Usuario interactúa (filtros, búsqueda)
13. useCallback → Handler memoizado ejecuta acción
14. Nuevo request con parámetros actualizados
15. Ciclo se repite

### Flujo de Creación/Edición

1. Usuario hace clic en "Crear Material"
2. Modal/Formulario se abre
3. Usuario completa campos
4. Validación client-side con validateMaterialData()
5. Submit → createMaterial() desde lib/materials/api
6. Backend procesa y responde
7. handleError() maneja errores si los hay
8. showSuccess() muestra mensaje de éxito
9. useCallback → handleRefresh() actualiza lista
10. Modal se cierra

### Flujo de Notificaciones

1. Hook useNotifications se inicializa
2. Conecta a SSE endpoint
3. Backend envía eventos en tiempo real
4. Hook actualiza estado local
5. Componentes suscritos se actualizan
6. UI refleja cambios (contador, panel)

## 🎯 Mejores Prácticas (Actualizadas)

### Estructura y Organización

1. **Modularización por dominio** - Cada módulo en su carpeta con api/utils/index
2. **Barrel exports** - Usar `index.ts` para re-exportar y simplificar imports
3. **Tipos separados** - Un archivo por entidad en `types/`
4. **Componentes de estado** - Siempre incluir loading/empty/error states
5. **Constantes centralizadas** - Todo en `lib/constants.ts` siguiendo patrón [MODULE]\_\*

### TypeScript

6. **Tipos explícitos** - Evitar `any`, usar tipos específicos
7. **JSDoc completo** - Documentar todas las funciones con ejemplos
8. **Validación en desarrollo** - Usar prop-validation para mejor DX
9. **Type safety** - 0 errores TypeScript en todo el proyecto

### Performance

10. **useMemo** - Para valores calculados y parámetros de búsqueda
11. **useCallback** - Para handlers que se pasan como props
12. **Lazy loading** - Cargar componentes pesados bajo demanda
13. **Componentes puros** - Evitar re-renders innecesarios

### Manejo de Estados

14. **Estados de carga** - Siempre mostrar skeleton loaders
15. **Estados vacíos** - Componentes específicos con acciones
16. **Manejo de errores** - Sistema centralizado con retry
17. **Validación** - Client-side antes de enviar al backend

### Código Limpio

18. **Funciones pequeñas** - Una responsabilidad por función
19. **Nombres descriptivos** - Claros y específicos al dominio
20. **Comentarios útiles** - Explicar "por qué", no "qué"
21. **Consistencia** - Seguir patrones establecidos en el proyecto

### UI/UX

22. **Responsive design** - Mobile-first con breakpoints adaptativos
23. **Accesibilidad** - ARIA labels, navegación por teclado, contraste
24. **Feedback visual** - Toasts, estados, confirmaciones
25. **Mensajes amigables** - Errores comprensibles para el usuario

### Testing y Calidad

26. **Linting** - Ejecutar antes de commits
27. **Type checking** - Verificar errores TypeScript
28. **Revisar imports** - No dejar imports sin usar
29. **Verificar consola** - No dejar console.log en producción

---

## 📚 Recursos Adicionales

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **Recharts Docs**: https://recharts.org
- **Tailwind CSS**: https://tailwindcss.com
- **Radix UI**: https://www.radix-ui.com
- **shadcn/ui**: https://ui.shadcn.com

---

## 🔧 Mejoras Recientes (Noviembre 11 - 2025)

### Fase 1: Eliminación de Duplicación ✅

- **Utilidades compartidas**: `formatMonthLabel()` y `sortMonthlyData()` movidas a `lib/utils.ts`
- **Componentes compartidos**: `ChartLoadingState`, `ChartEmptyState`, `ChartTooltip`
- **Tipos TypeScript**: Tipos específicos para Recharts en `types/recharts.ts`
- **Reducción**: ~150 líneas de código duplicado eliminadas

### Fase 2: Optimización con Hooks ✅

- **Hook personalizado**: `useChartData` para lógica centralizada de carga de datos
- **Memoización**: `useMemo` y `useCallback` para mejor rendimiento
- **Refactorización**: Los 3 componentes de gráficos usan el hook compartido
- **Reducción**: ~95 líneas de código duplicado adicionales

### Fase 3: Manejo de Errores ✅

- **Error Boundary**: Componente para capturar errores de renderizado
- **Unificación**: Todos los errores usan `handleError` del sistema centralizado
- **Integración**: ErrorBoundary integrado en el layout del dashboard
- **Mejora**: Mejor experiencia de usuario con manejo robusto de errores

### Fase 4: Constantes y Documentación ✅

- **Constantes centralizadas**: `lib/constants.ts` con valores compartidos (colores, mensajes, configuraciones)
- **Documentación JSDoc**: Documentación completa en componentes y hooks
- **Validación de props**: Validación en desarrollo para mejor DX (`lib/prop-validation.ts`)
- **Mejora**: Código más mantenible y documentado

### Fase 5: Reorganización de Tipos (Noviembre 2025) ✅

- **Separación de tipos**: `types/index.ts` dividido en 17 archivos específicos por entidad
- **Archivos creados**: `common.ts`, `materials.ts`, `warehouse.ts`, `movements.ts`, `packagings.ts`, `products.ts`, `phases.ts`, `recipes.ts`, `orders.ts`, `batches.ts`, `production.ts`, `quality.ts`, `users.ts`, `notifications.ts`, `sectors.ts`, `analytics.ts`, `config.ts`
- **Barrel export**: `types/index.ts` como punto de entrada único
- **Mejora**: Mejor organización y mantenibilidad del código

### Fase 6: Reorganización de APIs en Módulos (Noviembre 2025) ✅

- **Estructura modular**: APIs organizadas en carpetas por dominio
- **Patrón establecido**: Cada módulo contiene `api.ts`, `utils.ts` e `index.ts`
- **Módulos creados**: `materials/`, `movements/`, `orders/`, `products/`, `batches/`, `packagings/`, `users/`
- **Barrel exports**: Imports simplificados desde `@/lib/[module]`
- **Mejora**: Código más organizado y escalable

### Fase 7: Refactorización Completa de Módulos (Noviembre 2025) ✅

#### Módulos Refactorizados:

**1. Materiales** ✅

- Utils: 20 funciones utilitarias (~350 líneas)
- Componentes de estado: `MaterialsLoadingState`, `MaterialsEmptyState`, `MaterialsErrorState`
- Constantes: ~100 líneas en `lib/constants.ts` (MATERIAL\_\*)
- Página: Refactorizada con 3 `useCallback`, 1 `useMemo`
- API: JSDoc completo con ejemplos
- **Resultado**: 0 errores TypeScript

**2. Movimientos** ✅

- Utils: 22 funciones utilitarias (~400 líneas)
- Componentes de estado: 3 componentes (loading/empty/error)
- Constantes: ~120 líneas (MOVEMENT\_\*)
- Páginas: Listing + Detail refactorizadas con hooks
- API: JSDoc completo
- **Resultado**: 0 errores TypeScript

**3. Notificaciones** ✅

- Utils: 15 funciones utilitarias (~250 líneas)
- Componentes: Panel optimizado con memoización
- Constantes: ~80 líneas (NOTIFICATION\_\*)
- Hook: `useNotifications` mejorado
- **Resultado**: 0 errores TypeScript

**4. Órdenes** ✅

- Utils: 18 funciones utilitarias (~300 líneas)
- Componentes de estado: 3 componentes
- Constantes: ~110 líneas (ORDER\_\*)
- Página: Refactorizada con 2 `useCallback`, 1 `useMemo`
- API: JSDoc completo
- **Resultado**: 0 errores TypeScript

**5. Productos** ✅

- Utils: 25 funciones utilitarias (~400 líneas)
- Componentes de estado: 3 componentes
- Constantes: ~180 líneas (PRODUCT\_\*)
- Páginas: Listing + Detail con hooks
- API: JSDoc completo
- **Resultado**: 0 errores TypeScript

**6. Seguimiento/Lotes** ✅

- Utils: 27 funciones utilitarias (~450 líneas)
- Componentes de estado: 3 componentes
- Constantes: ~180 líneas (BATCH\_\*)
- Páginas: Listing + Detail con hooks
- API: JSDoc completo
- Correcciones de tipos: `code` vs `batchCode`, eliminación de referencias no existentes
- **Resultado**: 0 errores TypeScript

**7. Packagings** ✅

- Utils: 17 funciones utilitarias (~200 líneas)
- Componentes de estado: 3 componentes
- Constantes: ~150 líneas (PACKAGING\_\*)
- Página: Refactorizada con 3 `useCallback`, 1 `useMemo`
- API: JSDoc completo
- **Resultado**: 0 errores TypeScript

**8. Usuarios** ✅

- Utils: 25 funciones utilitarias (~400 líneas)
- Componentes de estado: 3 componentes
- Constantes: ~140 líneas (USER\_\*)
- Página: Refactorizada con 3 `useCallback`, 1 `useMemo`
- API: JSDoc completo
- Correcciones: Ajustes para todos los roles del sistema
- **Resultado**: 0 errores TypeScript

**9. Configuración** ✅

- Página con tabs: Ya bien estructurada
- Sin necesidad de refactorización adicional
- **Resultado**: 0 errores TypeScript

**10. Perfil** ✅

- Página: Refactorizada con 2 `useCallback`
- Optimización de handlers para perfil y contraseña
- **Resultado**: 0 errores TypeScript

### Estadísticas de la Refactorización Fase 7:

- **Funciones utilitarias creadas**: 169 funciones (~2,750 líneas)
- **Componentes de estado**: 21 componentes (7 módulos × 3 componentes)
- **Constantes agregadas**: ~1,060 líneas organizadas
- **Hooks de memoización**: 24 `useCallback`, 7 `useMemo`
- **Documentación JSDoc**: Completa en 8 APIs
- **Módulos completados**: 10/10 ✅
- **Errores TypeScript totales**: **0** ❌
- **Líneas de código refactorizadas**: ~4,500+ líneas

### Patrones Establecidos:

**Estructura de Módulo**:

```

lib/[module]/
├── api.ts # API con JSDoc completo
├── utils.ts # 15-27 funciones utilitarias
└── index.ts # Barrel export

components/[module]/
├── [module]-loading-state.tsx
├── [module]-empty-state.tsx
└── [module]-error-state.tsx

```

**Constantes por Módulo** (en `lib/constants.ts`):

- `[MODULE]_STATUS_LABELS`: Etiquetas de estados
- `[MODULE]_BADGE_COLORS`: Colores para badges
- `[MODULE]_PAGINATION`: Configuración de paginación
- `[MODULE]_ERROR_MESSAGES`: Mensajes de error
- `[MODULE]_SUCCESS_MESSAGES`: Mensajes de éxito
- `[MODULE]_EMPTY_MESSAGES`: Mensajes de estado vacío
- `[MODULE]_FILTER_OPTIONS`: Opciones de filtros
- `[MODULE]_VALIDATION_LIMITS`: Límites de validación

**Funciones Utilitarias Comunes**:

- Formateo de datos (textos, fechas, cantidades)
- Configuración de iconos y badges
- Validación de datos
- Filtrado y búsqueda
- Ordenamiento
- Cálculo de estadísticas
- Generación de resúmenes

**Optimización de Páginas**:

- `useMemo` para parámetros de búsqueda
- `useCallback` para handlers (refresh, retry, acciones)
- Componentes de estado reutilizables
- Constantes centralizadas
- Manejo de errores robusto

### Beneficios de la Refactorización:

1. **Mantenibilidad**: Código más organizado y fácil de mantener
2. **Reutilización**: Componentes y utilidades compartidas
3. **Type Safety**: 0 errores TypeScript en todo el proyecto
4. **Performance**: Memoización efectiva con hooks
5. **Documentación**: JSDoc completo en todas las APIs
6. **Consistencia**: Patrones uniformes en todos los módulos
7. **Escalabilidad**: Estructura preparada para futuros módulos

---
