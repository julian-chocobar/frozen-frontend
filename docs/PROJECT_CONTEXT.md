# Contexto del Proyecto - Sistema de Gestión Cervecera Frozen

## Visión General

Este es un sistema de gestión de producción para una PyME cervecera artesanal llamada "Frozen". El proyecto está construido con Next.js 14 App Router y está diseñado para ser una aplicación web moderna, responsive y optimizada para rendimiento.

## Objetivo del Sistema

Proporcionar una plataforma integral para gestionar:
- **Inventario de materias primas** (maltas, lúpulos, levaduras)
- **Planificación de producción** (órdenes de producción)
- **Seguimiento de lotes** en tiempo real durante el proceso de elaboración
- **Trazabilidad completa** de cada lote desde materias primas hasta producto final
- **Reportes y análisis** de producción e inventario

## Usuario Objetivo

- **PyME cervecera artesanal** con 3-10 empleados
- **Maestros cerveceros** que necesitan monitorear parámetros críticos (temperatura, pH, densidad)
- **Administradores** que gestionan inventario y planificación
- **Usuarios con conocimientos técnicos básicos** (no expertos en software)

## Filosofía de Diseño

### 1. Mobile-First
- Diseñado para funcionar desde 320px de ancho
- Los maestros cerveceros usan tablets/móviles en la planta de producción
- Tablas se convierten en cards en móvil
- Sidebar se convierte en bottom bar en móvil

### 2. Feedback Inmediato
- Siempre mostrar estados de carga (< 100ms de respuesta)
- NavigationLoader para transiciones de ruta
- loading.tsx para carga de datos
- Animaciones suaves y transiciones

### 3. Minimalismo Funcional
- Interfaz limpia sin elementos decorativos innecesarios
- Información crítica siempre visible
- Colores con propósito (no decorativos)
- Tipografía monoespaciada para datos técnicos

### 4. Accesibilidad
- Contraste WCAG AA mínimo
- Navegación por teclado
- Screen reader friendly
- Tooltips descriptivos

## Flujo de Trabajo Principal

### 1. Gestión de Materias Primas
\`\`\`
Usuario → Materiales → Ver inventario → Identificar alertas de stock → Registrar entrada/salida
\`\`\`

### 2. Planificación de Producción
\`\`\`
Usuario → Producción → Crear orden → Asignar materiales → Asignar responsable → Iniciar producción
\`\`\`

### 3. Seguimiento de Lotes
\`\`\`
Usuario → Seguimiento → Ver lotes activos → Seleccionar lote → Actualizar parámetros → Registrar eventos
\`\`\`

### 4. Trazabilidad
\`\`\`
Usuario → Trazabilidad → Buscar lote → Ver historial completo → Generar reporte
\`\`\`

## Características Clave

### Tiempo Real
- Dashboard actualizado con datos en vivo
- Alertas automáticas cuando parámetros salen de rango
- Notificaciones de eventos críticos

### Responsive
- Adaptación automática a cualquier tamaño de pantalla
- Componentes que cambian de layout según viewport
- Optimización de contenido para móvil

### Offline-First (Futuro)
- Capacidad de trabajar sin conexión
- Sincronización automática cuando hay conexión
- Cache de datos críticos

## Integración con Backend

### Backend: Spring Boot con Spring Security
- **Autenticación**: Session cookies (no JWT)
- **API REST**: Endpoints RESTful estándar
- **CORS**: Configurado para permitir credenciales
- **Formato**: JSON para request/response

### Estrategia de Datos
- **Server Components** para datos iniciales (SSR)
- **Client Components + SWR** para datos que cambian frecuentemente
- **Optimistic Updates** para mejor UX
- **Error Boundaries** para manejo de errores

## Estructura de Datos Principal

### Material (Materia Prima)
\`\`\`typescript
{
  id: string
  codigo: string
  nombre: string
  categoria: 'Maltas' | 'Lúpulos' | 'Levaduras' | 'Otros'
  stock: number
  unidad: string
  stockMinimo: number
  proveedor: string
  estado: 'Bueno' | 'Bajo' | 'Exceso' | 'Crítico'
}
\`\`\`

### Orden de Producción
\`\`\`typescript
{
  id: string
  codigo: string
  cerveza: string
  lote: string
  estado: 'Planificada' | 'En Proceso' | 'Completada' | 'Cancelada'
  prioridad: 'Alta' | 'Media' | 'Baja'
  fechaInicio: Date
  fechaFinEstimada: Date
  responsable: string
  cantidad: number
  progreso: number
}
\`\`\`

### Lote de Producción
\`\`\`typescript
{
  id: string
  codigo: string
  orden: string
  cerveza: string
  volumen: number
  estado: 'Activo' | 'Fermentando' | 'Maduración' | 'Completado'
  etapa: string
  progreso: number
  fechaInicio: Date
  fechaFinEstimada: Date
  responsable: string
  parametros: {
    temperatura: number
    pH: number
    densidad?: number
    presion?: number
  }
  alertas: Alert[]
}
\`\`\`

## Convenciones de Código

### Nomenclatura
- **Componentes**: PascalCase (`BatchCard.tsx`)
- **Archivos**: kebab-case (`batch-card.tsx`)
- **Variables**: camelCase (`batchData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_BATCH_SIZE`)
- **CSS Classes**: kebab-case (`batch-card-header`)

### Comentarios
- **Español** para comentarios de código (usuarios hispanohablantes)
- **Inglés** para nombres de variables/funciones (estándar internacional)
- Comentarios explicativos para lógica compleja
- JSDoc para funciones públicas

### Organización de Imports
\`\`\`typescript
// 1. React y Next.js
import { useState } from 'react'
import Link from 'next/link'

// 2. Librerías externas
import { format } from 'date-fns'

// 3. Componentes internos
import { Button } from '@/components/ui/button'
import { BatchCard } from '@/components/production/batch-card'

// 4. Utilidades y tipos
import { cn } from '@/lib/utils'
import type { Batch } from '@/types'

// 5. Estilos (si aplica)
import './styles.css'
\`\`\`

## Próximos Pasos (Integración Backend)

1. **Autenticación**: Implementar login con session cookies
2. **API Client**: Crear cliente HTTP con manejo de errores
3. **Data Fetching**: Reemplazar mock data con llamadas reales
4. **Error Handling**: Implementar error boundaries y retry logic
5. **Optimistic Updates**: Actualizar UI antes de confirmar con servidor
6. **Real-time**: Considerar WebSockets para actualizaciones en tiempo real

## Recursos Adicionales

- `docs/FRONTEND_ARCHITECTURE.md` - Arquitectura técnica detallada
- `docs/COMPONENT_PATTERNS.md` - Patrones de componentes
- `docs/BACKEND_INTEGRATION_GUIDE.md` - Guía de integración con backend
- `docs/DESIGN_SYSTEM.md` - Sistema de diseño y colores
- `docs/SSR_OPTIMIZATION.md` - Estrategia de renderizado
