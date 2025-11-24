import type { DriverStep } from '@/hooks/use-driver'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * Pasos del tour para explicar la navegación
 */
export const navigationSteps: DriverStep[] = [
  {
    element: '[data-tour="navigation-sidebar"], [data-tour="navigation-bottom-bar"]',
    popover: {
      title: 'Navegación del Sistema',
      description: 'Usa el menú lateral (desktop) o la barra inferior (móvil) para navegar entre las diferentes secciones del sistema. Cada icono representa una sección diferente.',
      side: 'right',
      align: 'start',
    },
  },
]

/**
 * Pasos del tour para el Dashboard
 */
export const dashboardSteps: DriverStep[] = [
  {
    element: '[data-tour="dashboard-stats"]',
    popover: {
      title: 'Estadísticas Principales',
      description: 'Aquí puedes ver las estadísticas principales: lotes en progreso, completados, producción total y desperdicios.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="dashboard-charts"]',
    popover: {
      title: 'Análisis de Datos',
      description: 'Los gráficos muestran análisis de producción, consumo de materiales y desperdicios. Puedes cambiar entre vista de cuadrícula, pestañas o lista.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Materiales
 */
export const materialsSteps: DriverStep[] = [
  {
    element: '[data-tour="materials-header"]',
    popover: {
      title: 'Inventario de Materiales',
      description: 'En esta sección gestionas el inventario de materias primas: maltas, lúpulos, levaduras y otros insumos.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="materials-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Usa los filtros para buscar materiales por tipo, estado, nombre o proveedor.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="materials-create"]',
    popover: {
      title: 'Crear Material',
      description: 'Haz clic aquí para agregar nuevos materiales al inventario.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="materials-table"]',
    popover: {
      title: 'Lista de Materiales',
      description: 'La tabla muestra todos los materiales con su información: stock, ubicación en almacén y estado.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="materials-warehouse"]',
    popover: {
      title: 'Panel de Almacén',
      description: 'El panel lateral muestra las ubicaciones de materiales en el almacén. Selecciona un material para ver sus ubicaciones.',
      side: 'left',
    },
  },
]

/**
 * Pasos del tour para Movimientos
 */
export const movementsSteps: DriverStep[] = [
  {
    element: '[data-tour="movements-header"]',
    popover: {
      title: 'Movimientos de Stock',
      description: 'Aquí gestionas el historial de entradas y salidas de stock de materiales.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="movements-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra los movimientos por tipo (entrada/salida), material, fecha o motivo.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="movements-create"]',
    popover: {
      title: 'Crear Movimiento',
      description: 'Crea nuevos movimientos de stock para registrar entradas o salidas de materiales.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="movements-table"]',
    popover: {
      title: 'Historial de Movimientos',
      description: 'Visualiza todos los movimientos con detalles como fecha, material, cantidad y usuario responsable.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Productos
 */
export const productsSteps: DriverStep[] = [
  {
    element: '[data-tour="products-header"]',
    popover: {
      title: 'Gestión de Productos',
      description: 'Gestiona tus productos cerveceros y configura sus fases de producción y recetas.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="products-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra productos por nombre, tipo alcohólico, estado o preparación.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="products-create"]',
    popover: {
      title: 'Crear Producto',
      description: 'Crea nuevos productos y configura sus características.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="products-table"]',
    popover: {
      title: 'Lista de Productos',
      description: 'La tabla muestra todos los productos. Haz clic en el botón "Ver" (👁️) de cualquier producto para acceder a su página de detalle y configurar sus fases y recetas.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="products-view-button"]',
    popover: {
      title: 'Ver Detalle de Producto',
      description: 'Haz clic en este botón para acceder a la página de detalle del producto, donde podrás ver y configurar sus fases de producción y recetas.',
      side: 'left',
    },
  },
]

/**
 * Pasos del tour para Órdenes
 */
export const ordersSteps: DriverStep[] = [
  {
    element: '[data-tour="orders-stats"]',
    popover: {
      title: 'Estadísticas de Órdenes',
      description: 'Estadísticas de órdenes: totales, pendientes, aprobadas, rechazadas y canceladas.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="orders-header"]',
    popover: {
      title: 'Órdenes de Producción',
      description: 'Gestiona las órdenes de producción. Los supervisores crean órdenes y los gerentes las aprueban.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="orders-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra órdenes por estado o producto para encontrar rápidamente lo que buscas.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="orders-create"]',
    popover: {
      title: 'Crear Orden',
      description: 'Crea nuevas órdenes de producción. Una vez aprobadas, se generan lotes automáticamente.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="orders-table"]',
    popover: {
      title: 'Lista de Órdenes',
      description: 'Visualiza todas las órdenes. Las pendientes pueden ser aprobadas o rechazadas por gerentes.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Seguimiento de Lotes
 */
export const batchesSteps: DriverStep[] = [
  {
    element: '[data-tour="batches-stats"]',
    popover: {
      title: 'Estadísticas de Lotes',
      description: 'Estadísticas de lotes: totales, pendientes, en producción, completados y volumen total.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="batches-header"]',
    popover: {
      title: 'Seguimiento de Lotes',
      description: 'Monitorea el progreso de los lotes en tiempo real y gestiona los parámetros de calidad.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="batches-process"]',
    popover: {
      title: 'Iniciar Producción',
      description: 'Los gerentes pueden iniciar la producción de lotes programados para hoy.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="batches-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra lotes por estado o producto para un seguimiento más eficiente.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="batches-grid"]',
    popover: {
      title: 'Lotes en Producción',
      description: 'Visualiza todos los lotes. Haz clic en el botón "Ver Detalle" de cualquier lote para acceder a su página de detalle con información completa, fases, parámetros de calidad y opciones para generar reportes.',
      side: 'top',
    },
  },
  {
    element: '[data-tour="batches-view-button"]',
    popover: {
      title: 'Ver Detalle de Lote',
      description: 'Haz clic en este botón para acceder a la página de detalle del lote, donde podrás ver información completa, fases de producción, parámetros de calidad y generar reportes.',
      side: 'left',
    },
  },
]

/**
 * Pasos del tour para Configuración
 */
export const configurationSteps: DriverStep[] = [
  {
    element: '[data-tour="config-tabs"]',
    popover: {
      title: 'Configuración del Sistema',
      description: 'La configuración del sistema se organiza en 4 pestañas principales.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="config-working-days"]',
    popover: {
      title: 'Días Laborales',
      description: 'Configura qué días son laborables y sus horarios de trabajo.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="config-sectors"]',
    popover: {
      title: 'Sectores',
      description: 'Gestiona los sectores de producción, calidad y almacén con sus supervisores.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="config-quality-params"]',
    popover: {
      title: 'Parámetros de Calidad',
      description: 'Define los parámetros base que se usarán en el control de calidad.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="config-packagings"]',
    popover: {
      title: 'Packagings',
      description: 'Administra los envases disponibles (latas, botellas, etc.) para los productos.',
      side: 'bottom',
    },
  },
]

/**
 * Pasos del tour para Notificaciones
 */
export const notificationsSteps: DriverStep[] = [
  {
    element: '[data-tour="notifications-header"]',
    popover: {
      title: 'Centro de Notificaciones',
      description: 'Centro de notificaciones: mantente al día con todos los eventos del sistema.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="notifications-stats"]',
    popover: {
      title: 'Estadísticas',
      description: 'Estadísticas rápidas: total de notificaciones, no leídas y leídas.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="notifications-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra notificaciones por estado: todas, no leídas o leídas.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="notifications-list"]',
    popover: {
      title: 'Lista de Notificaciones',
      description: 'Lista de notificaciones. Haz clic en una para ver detalles o navegar a la sección relacionada.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Perfil
 */
export const profileSteps: DriverStep[] = [
  {
    element: '[data-tour="profile-identity"]',
    popover: {
      title: 'Información de Identidad',
      description: 'Tu información de identidad: nombre, username y avatar.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="profile-info"]',
    popover: {
      title: 'Información Personal',
      description: 'Edita tu información personal: nombre, email y teléfono. Los roles son asignados por el administrador.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="profile-security"]',
    popover: {
      title: 'Seguridad',
      description: 'Cambia tu contraseña cuando lo necesites. Asegúrate de usar una contraseña segura.',
      side: 'bottom',
    },
  },
]

/**
 * Pasos del tour para Usuarios (solo ADMIN)
 */
export const usersSteps: DriverStep[] = [
  {
    element: '[data-tour="users-header"]',
    popover: {
      title: 'Gestión de Usuarios',
      description: 'Gestión de usuarios: administra todos los usuarios del sistema, sus roles y permisos.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="users-create"]',
    popover: {
      title: 'Crear Usuario',
      description: 'Crea nuevos usuarios asignándoles username, contraseña, información personal y roles.',
      side: 'left',
    },
  },
  {
    element: '[data-tour="users-table"]',
    popover: {
      title: 'Lista de Usuarios',
      description: 'Visualiza todos los usuarios. Puedes editar, activar/desactivar y gestionar sus roles.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Detalle de Producto
 */
export const productDetailSteps: DriverStep[] = [
  {
    element: '[data-tour="product-detail-info"]',
    popover: {
      title: 'Información del Producto',
      description: 'Aquí puedes ver la información completa del producto: nombre, tipo (alcohólico/no alcohólico), estado y si está listo para producción.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="product-detail-phases"]',
    popover: {
      title: 'Fases y Recetas',
      description: 'En esta sección puedes ver y gestionar las fases de producción del producto. Puedes editar fases, agregar ingredientes a cada fase y marcar fases como listas.',
      side: 'top',
    },
  },
]

/**
 * Pasos del tour para Detalle de Lote
 */
export const batchDetailSteps: DriverStep[] = [
  {
    element: '[data-tour="batch-detail-info"]',
    popover: {
      title: 'Información del Lote',
      description: 'Aquí puedes ver la información completa del lote: código, orden de producción, producto, empaque, cantidad y estado. También puedes descargar reportes y cancelar el lote si es necesario.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="batch-detail-timeline"]',
    popover: {
      title: 'Cronología del Lote',
      description: 'Visualiza las fechas importantes del lote: creación, planificada, inicio, fin estimada y fin real.',
      side: 'bottom',
    },
  },
  {
    element: '[data-tour="batch-detail-phases"]',
    popover: {
      title: 'Fases de Producción',
      description: 'En esta sección puedes ver el progreso de cada fase de producción, registrar parámetros de calidad y gestionar el estado de cada fase.',
      side: 'top',
    },
  },
]

/**
 * Obtener pasos según la ruta actual
 */
export function getStepsForRoute(route: string): DriverStep[] {
  // Rutas dinámicas (con parámetros)
  if (route.startsWith('/productos/') && route !== '/productos') {
    return productDetailSteps
  }
  if (route.startsWith('/seguimiento/') && route !== '/seguimiento') {
    return batchDetailSteps
  }

  const routeMap: Record<string, DriverStep[]> = {
    '/': dashboardSteps,
    '/materiales': materialsSteps,
    '/movimientos': movementsSteps,
    '/productos': productsSteps,
    '/ordenes': ordersSteps,
    '/seguimiento': batchesSteps,
    '/configuracion': configurationSteps,
    '/notificaciones': notificationsSteps,
    '/perfil': profileSteps,
    '/usuarios': usersSteps,
  }

  return routeMap[route] || []
}

/**
 * Generar pasos del tour completo con navegación
 * Este tour muestra primero la navegación, luego el dashboard, y luego guía al usuario
 * a navegar a otras páginas mostrando sus tours respectivos
 */
export function getFullTourSteps(
  currentPath: string,
  router: AppRouterInstance
): DriverStep[] {
  const steps: DriverStep[] = []

  // Paso 1: Bienvenida
  steps.push({
    element: 'body',
    popover: {
      description: '¡Bienvenido al sistema de gestión de producción cervecera! Este tour te guiará por las principales funcionalidades. Puedes omitirlo en cualquier momento.',
      side: 'bottom',
      align: 'center',
    },
  })

  // Paso 2: Explicar navegación
  steps.push({
    element: '[data-tour="navigation-sidebar"], [data-tour="navigation-bottom-bar"]',
    popover: {
      title: 'Navegación del Sistema',
      description: 'Usa el menú lateral (desktop) o la barra inferior (móvil) para navegar entre las diferentes secciones. Cada icono representa una sección diferente. Te guiaré por las principales secciones.',
      side: 'right',
      align: 'start',
    },
  })

  // Paso 3-4: Dashboard (si no estamos ya ahí)
  if (currentPath !== '/') {
    steps.push({
      element: 'body',
      popover: {
        title: 'Navegando al Dashboard',
        description: 'Ahora navegaremos al Dashboard para ver las estadísticas principales. Haz clic en "Siguiente" para continuar.',
        side: 'bottom',
        align: 'center',
      },
      route: '/',
    })
  }

  // Pasos del dashboard
  steps.push(...dashboardSteps)

  // Paso: Navegar a Materiales
  steps.push({
    element: '[data-tour="navigation-sidebar"], [data-tour="navigation-bottom-bar"]',
    popover: {
      title: 'Navegar a Materiales',
      description: 'Ahora navegaremos a la sección de Materiales. Haz clic en el icono de "Materias" en el menú, o presiona "Siguiente" para navegar automáticamente.',
      side: 'right',
      align: 'start',
    },
    route: '/materiales',
  })

  // Pasos de materiales (solo los primeros 2 para no hacer el tour muy largo)
  steps.push(...materialsSteps.slice(0, 2))

  // Paso: Navegar a Productos
  steps.push({
    element: '[data-tour="navigation-sidebar"], [data-tour="navigation-bottom-bar"]',
    popover: {
      title: 'Navegar a Productos',
      description: 'Ahora veremos la sección de Productos. Haz clic en el icono de "Productos" en el menú, o presiona "Siguiente" para navegar automáticamente.',
      side: 'right',
      align: 'start',
    },
    route: '/productos',
  })

  // Pasos de productos (solo los primeros 2)
  steps.push(...productsSteps.slice(0, 2))

  // Paso: Navegar a Órdenes
  steps.push({
    element: '[data-tour="navigation-sidebar"], [data-tour="navigation-bottom-bar"]',
    popover: {
      title: 'Navegar a Órdenes',
      description: 'Ahora veremos la sección de Órdenes de Producción. Haz clic en el icono de "Ordenes" en el menú, o presiona "Siguiente" para navegar automáticamente.',
      side: 'right',
      align: 'start',
    },
    route: '/ordenes',
  })

  // Pasos de órdenes (solo los primeros 2)
  steps.push(...ordersSteps.slice(0, 2))

  // Paso final
  steps.push({
    element: 'body',
    popover: {
      title: '¡Tour Completado!',
      description: 'Has completado el tour básico. Puedes explorar las demás secciones usando el menú de navegación. Cada sección tiene su propio tour que puedes iniciar desde el botón de ayuda en el header.',
      side: 'bottom',
      align: 'center',
    },
  })

  return steps
}
