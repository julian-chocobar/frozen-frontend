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
      align: 'start',
    },
  },
  {
    element: '[data-tour="dashboard-view-selector"]',
    popover: {
      title: 'Selector de Vista',
      description: 'Cambia entre diferentes vistas de análisis: Cuadrícula (muestra todos los gráficos en una cuadrícula), Pestañas (organiza los gráficos en pestañas) o Lista (muestra los gráficos en una lista vertical).',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="dashboard-chart-type-selector"]',
    popover: {
      title: 'Tipo de Gráfico',
      description: 'Cada gráfico permite cambiar entre visualización de Líneas (ideal para ver tendencias a lo largo del tiempo) o Barras (útil para comparar valores entre períodos).',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="dashboard-date-filters"]',
    popover: {
      title: 'Filtros por Fecha',
      description: 'Filtra los datos por rango de fechas. Puedes elegir un período predefinido (Este Mes, Últimos 3 Meses, Este Año, etc.) o seleccionar "Personalizado" para elegir fechas específicas. Presiona "Buscar" para aplicar los filtros.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="dashboard-charts"]',
    popover: {
      title: 'Análisis de Datos',
      description: 'Los gráficos muestran análisis detallados de producción, consumo de materiales y desperdicios. Cada gráfico tiene sus propios controles para cambiar el tipo de visualización y filtrar datos.',
      side: 'top',
      align: 'start',
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
      align: 'start',
    },
  },
  {
    element: '[data-tour="movements-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra los movimientos por tipo (entrada/salida), material, fecha o motivo.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="movements-create"]',
    popover: {
      title: 'Crear Movimiento',
      description: 'Crea nuevos movimientos de stock para registrar entradas o salidas de materiales.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="movements-table"]',
    popover: {
      title: 'Historial de Movimientos',
      description: 'Visualiza todos los movimientos con detalles como fecha, material, cantidad y usuario responsable.',
      side: 'top',
      align: 'start',
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
      align: 'start',
    },
  },
  {
    element: '[data-tour="orders-header"]',
    popover: {
      title: 'Órdenes de Producción',
      description: 'Gestiona las órdenes de producción. Los supervisores crean órdenes y los gerentes las aprueban.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="orders-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra órdenes por estado o producto para encontrar rápidamente lo que buscas.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="orders-create"]',
    popover: {
      title: 'Crear Orden',
      description: 'Crea nuevas órdenes de producción. Una vez aprobadas, se generan lotes automáticamente.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="orders-table"]',
    popover: {
      title: 'Lista de Órdenes',
      description: 'Visualiza todas las órdenes con su información: estado, producto, cantidad, fechas y cronograma. Haz clic en el botón "Ver" (👁️) de cualquier orden para ver sus detalles completos. En el modal de detalles, los gerentes pueden aprobar o rechazar órdenes pendientes. Una vez aprobada, la orden generará lotes automáticamente para iniciar la producción.',
      side: 'top',
      align: 'start',
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
      align: 'start',
    },
  },
  {
    element: '[data-tour="batches-header"]',
    popover: {
      title: 'Seguimiento de Lotes',
      description: 'Monitorea el progreso de los lotes en tiempo real y gestiona los parámetros de calidad.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batches-process"]',
    popover: {
      title: 'Iniciar Producción',
      description: 'Los gerentes pueden iniciar la producción de lotes programados para hoy.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batches-filters"]',
    popover: {
      title: 'Filtros',
      description: 'Filtra lotes por estado o producto para un seguimiento más eficiente.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batches-grid"]',
    popover: {
      title: 'Lotes en Producción',
      description: 'Visualiza todos los lotes. Haz clic en el botón "Ver Detalle" de cualquier lote para acceder a su página de detalle con información completa, fases, parámetros de calidad y opciones para generar reportes.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batches-view-button"]',
    popover: {
      title: 'Ver Detalle de Lote',
      description: 'Haz clic en este botón para acceder a la página de detalle del lote, donde podrás ver información completa, fases de producción, parámetros de calidad y generar reportes.',
      side: 'left',
      align: 'start',
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
      description: 'La configuración del sistema se organiza en 4 pestañas principales. Cada pestaña permite gestionar un aspecto diferente de la configuración.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="config-tab-working-days"]',
    popover: {
      title: 'Días Laborales',
      description: 'Configura qué días de la semana son laborables y define los horarios de trabajo (hora de apertura y cierre) para cada día. Esta configuración se utiliza para calcular tiempos de producción y planificación.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="config-tab-sectors"]',
    popover: {
      title: 'Sectores',
      description: 'Gestiona los sectores de la empresa (producción, calidad, almacén, etc.) y asigna supervisores a cada sector. Los sectores organizan la estructura operativa y definen responsabilidades.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="config-tab-quality-params"]',
    popover: {
      title: 'Parámetros de Calidad',
      description: 'Define los parámetros base de calidad que se utilizarán en el control de calidad durante la producción. Puedes crear parámetros por fase, marcarlos como críticos y establecer unidades de medida. Estos parámetros se usarán cuando los operarios registren mediciones en las fases de producción.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="config-tab-packagings"]',
    popover: {
      title: 'Packagings',
      description: 'Administra los tipos de envases disponibles para los productos (latas, botellas, barriles, etc.). Define las características de cada packaging que luego se asociarán a los productos durante la creación de órdenes de producción.',
      side: 'bottom',
      align: 'start',
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
      side: 'top',
      align: 'start',
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
      align: 'start',
    },
  },
  {
    element: '[data-tour="product-ready-button"]',
    popover: {
      title: 'Botón Listo / No Listo',
      description: 'Este botón permite marcar el producto como "Listo" para producción o "No Listo". Solo puedes marcar un producto como listo cuando todas sus fases estén completas y marcadas como listas.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="product-detail-phases"]',
    popover: {
      title: 'Fases del Producto',
      description: 'Aquí puedes ver todas las fases de producción del producto. Cada fase muestra su estado, información de entrada/salida y los ingredientes asociados.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-edit-button"]',
    popover: {
      title: 'Editar Fase',
      description: 'Haz clic en este botón para editar los detalles de una fase: entrada, salida, unidad de salida y horas estimadas. Esto te permite ajustar los parámetros de producción de cada fase.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-add-ingredient-button"]',
    popover: {
      title: 'Agregar Ingrediente',
      description: 'Usa este botón para agregar ingredientes (materiales) a la fase. Puedes especificar qué material y en qué cantidad se necesita para esta fase de producción.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-mark-ready-button"]',
    popover: {
      title: 'Marcar Fase como Lista',
      description: 'Este botón permite marcar una fase como "Lista" cuando está completa y lista para producción, o "No lista" si necesitas hacer cambios. Una fase solo puede marcarse como lista si tiene al menos un ingrediente agregado.',
      side: 'left',
      align: 'start',
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
      description: 'Aquí puedes ver la información completa del lote: código, orden de producción, producto, empaque, cantidad y estado.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batch-report-button"]',
    popover: {
      title: 'Botón de Reporte',
      description: 'Descarga un reporte PDF con la trazabilidad completa del lote. El reporte incluye toda la información del lote, fases de producción y parámetros de calidad registrados.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batch-cancel-button"]',
    popover: {
      title: 'Botón de Cancelación',
      description: 'Cancela el lote si es necesario. Esta acción solo está disponible para lotes que no estén completados o cancelados. Una vez cancelado, el lote no puede reactivarse.',
      side: 'left',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batch-detail-timeline"]',
    popover: {
      title: 'Cronología del Lote',
      description: 'Visualiza las fechas importantes del lote: fecha de creación, fecha planificada, fecha de inicio real, fecha estimada de fin y fecha real de finalización (si está completado).',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="batch-detail-phases"]',
    popover: {
      title: 'Fases de Producción',
      description: 'En esta sección puedes ver el progreso de cada fase de producción. Cada fase muestra su estado, valores de input/output, y permite gestionar parámetros de calidad.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-send-review-button"]',
    popover: {
      title: 'Enviar a Revisión',
      description: 'Los supervisores de producción pueden enviar una fase a revisión cuando está en proceso. Debes confirmar los valores de input y output medidos antes de enviarla al equipo de calidad.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-quality-tab"]',
    popover: {
      title: 'Parámetros de Calidad',
      description: 'En esta pestaña puedes ver y gestionar los parámetros de calidad registrados para la fase. Los operarios de calidad pueden registrar nuevos parámetros y los supervisores pueden aprobarlos o desaprobarlos.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-register-parameter-button"]',
    popover: {
      title: 'Registrar Parámetro',
      description: 'Los operarios de calidad pueden registrar nuevos parámetros de calidad cuando la fase está bajo revisión. Selecciona el parámetro y registra el valor medido.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-evaluate-button"]',
    popover: {
      title: 'Evaluar Fase',
      description: 'Los supervisores de calidad pueden evaluar una fase cuando está bajo revisión. El sistema evaluará automáticamente todos los parámetros registrados y actualizará el estado de la fase (completada, rechazada o en ajuste) según los resultados.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '[data-tour="phase-info-tab"]',
    popover: {
      title: 'Información de Fase',
      description: 'En esta pestaña puedes ver la información detallada de la fase: valores estándar de input/output, horas estimadas y los ingredientes (materiales) configurados para esta fase del producto.',
      side: 'bottom',
      align: 'start',
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
      description: '¡Bienvenido al sistema de gestión de producción cervecera! Este tour te mostrará los elementos principales de navegación e interfaz.',
      side: 'bottom',
      align: 'center',
    },
  })

  // Paso 2: Explicar navegación (sidebar/bottom-bar)
  // Usar selector que priorice bottom-bar (aparece primero en el DOM en mobile)
  steps.push({
    element: '[data-tour="navigation-bottom-bar"], [data-tour="navigation-sidebar"]',
    popover: {
      title: 'Navegación del Sistema',
      description: 'Usa el menú lateral (en escritorio) o la barra inferior (en móvil) para navegar entre las diferentes secciones del sistema: Dashboard, Materiales, Movimientos, Productos, Órdenes, Seguimiento y Configuración.',
      side: 'right',
      align: 'start',
    },
  })

  // Paso 3: Panel de notificaciones
  steps.push({
    element: '[data-tour="header-notifications"]',
    popover: {
      title: 'Panel de Notificaciones',
      description: 'Haz clic en el icono de campana para ver tus notificaciones. Aquí recibirás alertas sobre cambios importantes en el sistema, actualizaciones de lotes, órdenes y más. El contador rojo indica cuántas notificaciones no leídas tienes.',
      side: 'bottom',
      align: 'start',
    },
  })

  // Paso 4: Menú de usuario
  steps.push({
    element: '[data-tour="header-user-menu"]',
    popover: {
      title: 'Menú de Usuario',
      description: 'Haz clic en tu avatar para acceder al menú de usuario. Desde aquí puedes ver tu perfil, gestionar usuarios (si eres administrador) y cerrar sesión.',
      side: 'bottom',
      align: 'start',
    },
  })

  // Paso 5: Botón de tour
  steps.push({
    element: '[data-tour="header-tour-button"]',
    popover: {
      title: 'Tour Guiado',
      description: 'Este botón está disponible en cada página del sistema. Haz clic en él para iniciar un tour específico que te mostrará las funcionalidades y características de la página actual. Úsalo cuando necesites ayuda para entender cómo funciona una sección.',
      side: 'bottom',
      align: 'start',
    },
  })

  // Paso final
  steps.push({
    element: 'body',
    popover: {
      title: '¡Tour Completado!',
      description: 'Ya conoces los elementos principales de navegación e interfaz. Explora las diferentes secciones usando el menú de navegación y usa el botón de tour en cada página para conocer sus funcionalidades específicas.',
      side: 'bottom',
      align: 'center',
    },
  })

  return steps
}
