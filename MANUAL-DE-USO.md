# Manual de Uso - Sistema de Gestión de Producción Cervecera

## Índice

1. [Dashboard](#dashboard)
2. [Materiales](#materiales)
3. [Movimientos](#movimientos)
4. [Productos](#productos)
5. [Órdenes de Producción](#órdenes-de-producción)
6. [Seguimiento de Lotes](#seguimiento-de-lotes)
7. [Configuración](#configuración)
8. [Notificaciones](#notificaciones)
9. [Perfil de Usuario](#perfil-de-usuario)
10. [Gestión de Usuarios](#gestión-de-usuarios)
11. [Resumen de Permisos por Rol](#resumen-de-permisos-por-rol)

---

## Dashboard

### Descripción

Página principal que muestra estadísticas generales de producción, consumo de materiales y desperdicios en tiempo real.

### Funcionalidades

#### Visualización de Estadísticas

- **Lotes en Progreso**: Cantidad de lotes actualmente en producción
- **Lotes Completados**: Total de lotes finalizados en el mes
- **Lotes Cancelados**: Total de lotes cancelados en el mes
- **Total Producido**: Volumen total producido en litros (mes actual)
- **Desperdicios**: Volumen total de desperdicios en litros (mes actual)
- **Materiales Usados**: Cantidad total de materiales consumidos en kg (mes actual)
- **Órdenes Rechazadas**: Total de órdenes rechazadas (si aplica)

#### Análisis de Datos

- **Gráficos disponibles**:
  - **Producción**: Inventario y producción por período
  - **Consumo**: Tendencias de consumo de materiales
  - **Desperdicios**: Análisis de desperdicios y mermas

#### Vistas Disponibles

1. **Vista de Cuadrícula**: Muestra todos los gráficos en una cuadrícula (2 columnas en desktop)
2. **Vista de Pestañas**: Organiza los gráficos en pestañas (Producción, Consumo, Desperdicios)
3. **Vista de Lista**: Muestra los gráficos en formato vertical uno debajo del otro

#### Filtros

- **Período**: Filtro por rango de fechas
- **Fase**: Filtrar por fase de producción
- **Material**: Filtrar por material específico
- **Producto**: Filtrar por producto

### Permisos por Rol

- ✅ **Todos los roles**: Acceso de lectura a estadísticas y gráficos
- ❌ **Ningún rol**: Modificación de datos desde el dashboard

---

## Materiales

### Descripción

Gestión completa del inventario de materias primas (maltas, lúpulos, levaduras y otros insumos) y sus ubicaciones en el almacén.

### Funcionalidades

#### Visualización

- Lista paginada de todos los materiales
- Vista de tabla (desktop) y cards (mobile)
- Información mostrada:
  - ID, Nombre, Tipo, Proveedor
  - Stock disponible
  - Estado (Activo/Inactivo)
  - Ubicaciones en almacén

#### Filtros

- **Tipo**: Filtrar por tipo de material (MALTA, LUPULO, LEVADURA, OTRO)
- **Estado**: Filtrar por estado (Activo/Inactivo)
- **Nombre**: Búsqueda por nombre
- **Proveedor**: Filtrar por proveedor

#### Gestión de Materiales

- **Crear**: Agregar nuevos materiales al inventario
- **Editar**: Modificar información de materiales existentes
- **Activar/Desactivar**: Cambiar estado de materiales
- **Ver Detalles**: Visualizar información completa del material

#### Panel de Almacén

- Visualización de ubicaciones de materiales
- Gestión de ubicaciones en almacén
- Validación de ubicaciones

### Permisos por Rol

#### SUPERVISOR_DE_ALMACEN

- ✅ CRUD completo de materiales
- ✅ Gestión de ubicaciones
- ✅ Validación de ubicaciones
- ✅ Visualización de movimientos

#### OPERARIO_DE_ALMACEN

- ✅ Visualización de materiales
- ✅ Creación de movimientos
- ✅ Validación de ubicaciones
- ❌ Crear/Editar materiales

#### ADMIN

- ✅ Acceso total a todas las funcionalidades

#### Otros Roles

- ✅ Visualización de materiales
- ❌ Modificación de materiales

---

## Movimientos

### Descripción

Gestión del historial de entradas y salidas de stock de materiales (movimientos de inventario).

### Funcionalidades

#### Visualización

- Lista paginada de todos los movimientos
- Vista de tabla (desktop) y cards (mobile)
- Información mostrada:
  - ID, Fecha, Tipo (ENTRADA/SALIDA)
  - Material relacionado
  - Cantidad, Motivo
  - Estado del movimiento
  - Usuario que realizó el movimiento

#### Filtros

- **Tipo**: Filtrar por tipo de movimiento (ENTRADA/SALIDA)
- **Material**: Filtrar por material específico
- **Fecha Desde/Hasta**: Filtrar por rango de fechas
- **Motivo**: Filtrar por motivo del movimiento

#### Gestión de Movimientos

- **Crear**: Registrar nuevos movimientos de stock
- **Ver Detalles**: Visualizar información completa del movimiento
- **Marcar Estado**: Cambiar estado del movimiento (En proceso/Completado)
- **Editar**: Modificar movimientos pendientes (según permisos)

### Permisos por Rol

#### SUPERVISOR_DE_ALMACEN

- ✅ Crear movimientos
- ✅ Visualizar todos los movimientos
- ✅ Editar movimientos
- ✅ Validar movimientos

#### OPERARIO_DE_ALMACEN

- ✅ Crear movimientos
- ✅ Visualizar movimientos
- ✅ Marcar movimientos (en proceso/completado)
- ✅ Validar ubicaciones
- ❌ Editar movimientos de otros usuarios

#### GERENTE_DE_PLANTA

- ✅ Visualización de movimientos
- ✅ Descarga de reportes
- ❌ Crear/Editar movimientos

#### ADMIN

- ✅ Acceso total a todas las funcionalidades

#### Otros Roles

- ✅ Visualización de movimientos
- ❌ Crear/Editar movimientos

---

## Productos

### Descripción

Gestión de productos cerveceros, incluyendo la configuración de sus fases de producción y recetas asociadas.

### Funcionalidades

#### Visualización

- Lista paginada de todos los productos
- Vista de tabla (desktop) y cards (mobile)
- Información mostrada:
  - ID, Nombre, Tipo (Alcohólico/No alcohólico)
  - Estado (Activo/Inactivo)
  - Estado de preparación (Listo/No listo)
  - Cantidad de fases configuradas

#### Filtros

- **Nombre**: Búsqueda por nombre
- **Tipo Alcohólico**: Filtrar por productos alcohólicos/no alcohólicos
- **Estado**: Filtrar por estado (Activo/Inactivo)
- **Listo**: Filtrar por estado de preparación

#### Gestión de Productos

- **Crear**: Agregar nuevos productos
- **Editar**: Modificar información de productos
- **Activar/Desactivar**: Cambiar estado de productos
- **Ver Detalles**: Acceder a la página de detalle del producto

#### Página de Detalle de Producto

- **Información General**: Datos básicos del producto
- **Gestión de Fases**:
  - Ver todas las fases del producto
  - Agregar nuevas fases
  - Editar fases existentes
  - Eliminar fases
  - Reordenar fases
- **Gestión de Recetas**:
  - Configurar recetas para cada fase
  - Agregar materiales a las recetas
  - Definir cantidades de materiales por fase
  - Editar recetas existentes

### Permisos por Rol

#### SUPERVISOR_DE_PRODUCCION

- ✅ CRUD completo de productos
- ✅ CRUD de fases de producción
- ✅ CRUD de recetas
- ✅ Configuración completa de productos

#### ADMIN

- ✅ Acceso total a todas las funcionalidades

#### Otros Roles

- ✅ Visualización de productos
- ✅ Visualización de fases y recetas
- ❌ Crear/Editar productos, fases o recetas

---

## Órdenes de Producción

### Descripción

Planificación y gestión de órdenes de producción de cerveza, incluyendo aprobación, rechazo y cancelación.

### Funcionalidades

#### Visualización

- Lista paginada de todas las órdenes
- Vista de tabla (desktop) y cards (mobile)
- Estadísticas en tarjetas:
  - Total de órdenes
  - Pendientes (esperando aprobación)
  - Aprobadas (listas para producción)
  - Rechazadas
  - Canceladas
  - Cantidad total planificada

#### Filtros

- **Estado**: Filtrar por estado (PENDIENTE, APROBADA, RECHAZADA, CANCELADA)
- **Producto**: Filtrar por producto específico

#### Gestión de Órdenes

- **Crear**: Crear nuevas órdenes de producción
  - Seleccionar producto
  - Definir cantidad
  - Seleccionar packaging
  - Establecer fecha planificada
- **Ver Detalles**: Visualizar información completa de la orden
- **Aprobar**: Aprobar órdenes pendientes (genera lotes)
- **Rechazar**: Rechazar órdenes pendientes
- **Cancelar**: Cancelar órdenes (solo si no están aprobadas)

#### Estados de Órdenes

- **PENDIENTE**: Esperando aprobación
- **APROBADA**: Aprobada y lista para producción (genera lotes)
- **RECHAZADA**: Rechazada por gerente
- **CANCELADA**: Cancelada por supervisor

### Permisos por Rol

#### SUPERVISOR_DE_PRODUCCION

- ✅ Crear órdenes de producción
- ✅ Visualizar todas las órdenes
- ✅ Cancelar órdenes propias
- ✅ Descargar trazabilidad
- ❌ Aprobar/Rechazar órdenes

#### GERENTE_DE_PLANTA

- ✅ Aprobar órdenes pendientes
- ✅ Rechazar órdenes pendientes
- ✅ Visualizar todas las órdenes
- ✅ Descargar reportes de trazabilidad
- ❌ Crear órdenes

#### ADMIN

- ✅ Acceso total a todas las funcionalidades

#### Otros Roles

- ✅ Visualización de órdenes
- ❌ Crear/Aprobar/Rechazar órdenes

---

## Seguimiento de Lotes

### Descripción

Monitoreo en tiempo real del progreso de los lotes de producción, gestión de parámetros de calidad y generación de reportes.

### Funcionalidades

#### Visualización

- Lista paginada de todos los lotes
- Vista de grid (desktop) y cards (mobile)
- Estadísticas en tarjetas:
  - Total de lotes
  - Pendientes (esperando inicio)
  - En Producción (activos)
  - En Espera (pausados)
  - Completados
  - Volumen total en proceso

#### Filtros

- **Estado**: Filtrar por estado del lote
- **Producto**: Filtrar por producto específico

#### Gestión de Lotes

- **Ver Detalles**: Acceder a la página de detalle del lote
- **Iniciar Producción Hoy**: Procesar lotes programados para hoy (solo gerentes)
- **Cancelar Lote**: Cancelar lotes en proceso (según permisos)

#### Página de Detalle de Lote

- **Información del Lote**:
  - Código, Orden de Producción, Producto
  - Packaging, Cantidad, Estado
  - Fechas (creación, planificada, inicio, fin estimado, fin real)
- **Fases de Producción**:
  - Visualización de todas las fases del lote
  - Estado de cada fase (Pendiente, En Proceso, Completada)
  - Progreso de cada fase
- **Parámetros de Calidad**:
  - Ingresar valores de parámetros de calidad por fase
  - Editar parámetros registrados
  - Aprobar/Desaprobar parámetros (supervisores)
  - Ver historial de parámetros
- **Reportes**:
  - Descargar reporte PDF de trazabilidad
  - Ver información completa del lote

### Permisos por Rol

#### OPERARIO_DE_PRODUCCION / OPERARIO_DE_PLANTA

- ✅ Visualización de lotes
- ✅ Visualización de órdenes
- ✅ Acceso a información de producción
- ❌ Ingresar parámetros de calidad
- ❌ Cancelar lotes

#### OPERARIO_DE_CALIDAD

- ✅ Visualización de lotes
- ✅ Crear registros de calidad
- ✅ Modificar registros de calidad propios
- ✅ Visualización de parámetros
- ❌ Aprobar/Desaprobar parámetros

#### SUPERVISOR_DE_PRODUCCION

- ✅ Visualización de lotes
- ✅ Revisión de lotes (si es supervisor del sector)
- ✅ Descarga de trazabilidad
- ✅ Cancelar lotes
- ❌ Ingresar parámetros de calidad

#### SUPERVISOR_DE_CALIDAD

- ✅ Visualización de lotes
- ✅ Crear registros de calidad
- ✅ Modificar registros de calidad
- ✅ Aprobar/Desaprobar parámetros de calidad
- ✅ Acceso a trazabilidad
- ✅ Revisión de fases de producción

#### GERENTE_DE_PLANTA

- ✅ Visualización de lotes
- ✅ Cancelar lotes
- ✅ Procesar lotes programados (Iniciar Producción Hoy)
- ✅ Descarga de reportes de trazabilidad
- ❌ Ingresar parámetros de calidad

#### ADMIN

- ✅ Acceso total a todas las funcionalidades

---

## Configuración

### Descripción

Configuración general del sistema, incluyendo días laborales, sectores, parámetros de calidad base y packagings.

### Funcionalidades

#### Días Laborales

- **Visualización**: Ver todos los días de la semana con su configuración
- **Editar**: Modificar días laborales individuales
  - Marcar/desmarcar como día laborable
  - Configurar hora de apertura
  - Configurar hora de cierre
- **Información mostrada**:
  - Día de la semana
  - Estado (Laborable/No laborable)
  - Hora de apertura
  - Hora de cierre

#### Sectores

- **Visualización**: Lista de todos los sectores
- **Crear**: Agregar nuevos sectores
- **Editar**: Modificar sectores existentes
- **Información gestionada**:
  - Nombre del sector
  - Supervisor asignado
  - Tipo (PRODUCCION, CALIDAD, ALMACEN)
  - Fase asociada (opcional)
  - Capacidad de producción (opcional)
  - Estado de tiempo activo

#### Parámetros de Calidad

- **Visualización**: Lista de parámetros de calidad base
- **Crear**: Agregar nuevos parámetros de calidad
- **Editar**: Modificar parámetros existentes
- **Activar/Desactivar**: Cambiar estado de parámetros
- **Información gestionada**:
  - Nombre del parámetro
  - Fase asociada
  - Indicador de crítico
  - Descripción
  - Unidad de medida
  - Información adicional

#### Packagings

- **Visualización**: Lista de todos los packagings
- **Crear**: Agregar nuevos packagings
- **Editar**: Modificar packagings existentes
- **Activar/Desactivar**: Cambiar estado de packagings
- **Información gestionada**:
  - Nombre
  - Material de envasado
  - Material de etiquetado
  - Unidad de medida
  - Cantidad

### Permisos por Rol

#### ADMIN

- ✅ Acceso total a todas las configuraciones
- ✅ CRUD completo de días laborales
- ✅ CRUD completo de sectores
- ✅ CRUD completo de parámetros de calidad
- ✅ CRUD completo de packagings

#### GERENTE_DE_PLANTA

- ✅ Gestión de sectores
- ✅ Visualización de días laborales
- ✅ Visualización de parámetros de calidad
- ✅ Visualización de packagings
- ❌ Modificar días laborales
- ❌ Crear parámetros de calidad base
- ❌ Modificar packagings

#### SUPERVISOR_DE_CALIDAD

- ✅ CRUD de parámetros de calidad
- ✅ Visualización de sectores
- ✅ Visualización de días laborales
- ✅ Visualización de packagings
- ❌ Modificar días laborales
- ❌ Modificar sectores
- ❌ Modificar packagings

#### SUPERVISOR_DE_ALMACEN

- ✅ Visualización de packagings
- ✅ Visualización de sectores
- ✅ Visualización de días laborales
- ✅ Visualización de parámetros de calidad
- ❌ Modificar configuraciones

#### Otros Roles

- ✅ Visualización de configuraciones
- ❌ Modificar cualquier configuración

---

## Notificaciones

### Descripción

Centro de notificaciones del sistema que muestra todos los eventos y alertas relevantes para el usuario.

### Funcionalidades

#### Visualización

- Lista paginada de todas las notificaciones
- Estadísticas:
  - Total de notificaciones
  - Notificaciones no leídas
  - Notificaciones leídas

#### Filtros

- **Todas**: Mostrar todas las notificaciones
- **No leídas**: Mostrar solo notificaciones sin leer
- **Leídas**: Mostrar solo notificaciones leídas

#### Gestión de Notificaciones

- **Marcar como leída**: Marcar notificaciones individuales como leídas
- **Marcar todas como leídas**: Marcar todas las notificaciones como leídas
- **Navegación**: Las notificaciones pueden incluir enlaces a secciones relacionadas
- **Actualizar**: Refrescar la lista de notificaciones

#### Tipos de Notificaciones

- Órdenes de producción (aprobadas, rechazadas, etc.)
- Lotes (iniciados, completados, cancelados)
- Movimientos de stock
- Alertas de calidad
- Y otros eventos del sistema

### Permisos por Rol

- ✅ **Todos los roles**: Acceso a sus propias notificaciones
- ✅ **Todos los roles**: Marcar notificaciones como leídas
- ❌ **Ningún rol**: Eliminar notificaciones (solo lectura y marcado)

---

## Perfil de Usuario

### Descripción

Gestión de la información personal del usuario, incluyendo datos de contacto y seguridad.

### Funcionalidades

#### Información Personal

- **Ver**: Visualizar información del perfil
  - Nombre completo
  - Username
  - Email
  - Teléfono
  - Roles asignados
- **Editar**: Modificar información personal
  - Actualizar nombre completo
  - Actualizar email (opcional)
  - Actualizar teléfono (opcional)
  - **Nota**: Los roles son asignados por el administrador y no se pueden modificar

#### Seguridad

- **Cambiar Contraseña**:
  - Ingresar contraseña actual
  - Definir nueva contraseña (mínimo 8 caracteres)
  - Confirmar nueva contraseña
  - Validación de coincidencia

### Permisos por Rol

- ✅ **Todos los roles**: Acceso a su propio perfil
- ✅ **Todos los roles**: Editar su información personal
- ✅ **Todos los roles**: Cambiar su contraseña
- ❌ **Todos los roles**: Modificar sus propios roles (solo ADMIN puede hacerlo)

---

## Gestión de Usuarios

### Descripción

Administración completa de usuarios del sistema, incluyendo creación, edición, activación/desactivación y asignación de roles.

### Funcionalidades

#### Visualización

- Lista paginada de todos los usuarios
- Vista de tabla (desktop) y cards (mobile)
- Información mostrada:
  - ID, Nombre, Username
  - Email, Teléfono
  - Roles asignados
  - Estado (Activo/Inactivo)

#### Gestión de Usuarios

- **Crear**: Agregar nuevos usuarios al sistema
  - Definir username
  - Establecer contraseña
  - Asignar nombre completo
  - Asignar email (opcional)
  - Asignar teléfono (opcional)
  - Asignar roles
- **Editar**: Modificar información de usuarios
  - Actualizar nombre
  - Actualizar email
  - Actualizar teléfono
  - Modificar roles
- **Activar/Desactivar**: Cambiar estado de usuarios
- **Ver Detalles**: Visualizar información completa del usuario

### Permisos por Rol

#### ADMIN

- ✅ CRUD completo de usuarios
- ✅ Asignar/Quitar roles
- ✅ Activar/Desactivar usuarios
- ✅ Modificar cualquier información de usuario

#### Otros Roles

- ❌ Acceso a gestión de usuarios (solo ADMIN)

---

## Resumen de Permisos por Rol

### ADMIN (Administrador)

✅ **Acceso Total al Sistema**

- **Dashboard**: Visualización completa de estadísticas
- **Materiales**: CRUD completo, gestión de almacén
- **Movimientos**: CRUD completo
- **Productos**: CRUD completo, gestión de fases y recetas
- **Órdenes**: Crear, visualizar, aprobar, rechazar, cancelar
- **Seguimiento**: Acceso completo a lotes, parámetros de calidad, reportes
- **Configuración**: CRUD completo de todas las configuraciones
- **Packagings**: CRUD completo
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: CRUD completo de usuarios

---

### GERENTE_GENERAL

✅ **Visualización y Monitoreo**

- **Dashboard**: Visualización completa de estadísticas y gráficos
- **Materiales**: Solo lectura
- **Movimientos**: Solo lectura
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**: Solo lectura de lotes
- **Configuración**: Solo lectura
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### GERENTE_DE_PLANTA

✅ **Gestión de Producción y Aprobaciones**

- **Dashboard**: Visualización completa
- **Materiales**: Solo lectura
- **Movimientos**: Visualización y descarga de reportes
- **Productos**: Solo lectura
- **Órdenes**:
  - ✅ Aprobar órdenes pendientes
  - ✅ Rechazar órdenes pendientes
  - ✅ Visualizar todas las órdenes
  - ✅ Descargar reportes de trazabilidad
  - ❌ Crear órdenes
- **Seguimiento**:
  - ✅ Visualización de lotes
  - ✅ Cancelar lotes
  - ✅ Procesar lotes programados (Iniciar Producción Hoy)
  - ✅ Descargar reportes de trazabilidad
  - ❌ Ingresar parámetros de calidad
- **Configuración**:
  - ✅ Gestión de sectores
  - ✅ Visualización de días laborales, parámetros, packagings
  - ❌ Modificar días laborales
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### SUPERVISOR_DE_PRODUCCION

✅ **Gestión de Producción**

- **Dashboard**: Visualización completa
- **Materiales**: Solo lectura
- **Movimientos**: Solo lectura
- **Productos**:
  - ✅ CRUD completo de productos
  - ✅ CRUD de fases de producción
  - ✅ CRUD de recetas
- **Órdenes**:
  - ✅ Crear órdenes de producción
  - ✅ Visualizar todas las órdenes
  - ✅ Cancelar órdenes propias
  - ✅ Descargar trazabilidad
  - ❌ Aprobar/Rechazar órdenes
- **Seguimiento**:
  - ✅ Visualización de lotes
  - ✅ Revisión de lotes (si es supervisor del sector)
  - ✅ Descargar trazabilidad
  - ✅ Cancelar lotes
  - ❌ Ingresar parámetros de calidad
- **Configuración**: Solo lectura
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### SUPERVISOR_DE_ALMACEN

✅ **Gestión de Almacén**

- **Dashboard**: Visualización completa
- **Materiales**:
  - ✅ CRUD completo de materiales
  - ✅ Gestión de ubicaciones
  - ✅ Validación de ubicaciones
- **Movimientos**:
  - ✅ Crear movimientos
  - ✅ Visualizar todos los movimientos
  - ✅ Editar movimientos
  - ✅ Validar movimientos
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**: Solo lectura
- **Configuración**:
  - ✅ Visualización de packagings
  - ✅ Visualización de otras configuraciones
  - ❌ Modificar configuraciones
- **Packagings**:
  - ✅ CRUD completo de packagings
  - ✅ Activar/Desactivar packagings
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### SUPERVISOR_DE_CALIDAD

✅ **Gestión de Calidad**

- **Dashboard**: Visualización completa
- **Materiales**: Solo lectura
- **Movimientos**: Solo lectura
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**:
  - ✅ Visualización de lotes
  - ✅ Crear registros de calidad
  - ✅ Modificar registros de calidad
  - ✅ Aprobar/Desaprobar parámetros de calidad
  - ✅ Acceso a trazabilidad
  - ✅ Revisión de fases de producción
- **Configuración**:
  - ✅ CRUD de parámetros de calidad
  - ✅ Visualización de otras configuraciones
  - ❌ Modificar días laborales, sectores, packagings
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### OPERARIO_DE_PRODUCCION / OPERARIO_DE_PLANTA

✅ **Operaciones de Producción**

- **Dashboard**: Visualización completa
- **Materiales**: Solo lectura
- **Movimientos**: Solo lectura
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**:
  - ✅ Visualización de lotes
  - ✅ Visualización de órdenes
  - ✅ Acceso a información de producción
  - ❌ Ingresar parámetros de calidad
  - ❌ Cancelar lotes
- **Configuración**: Solo lectura
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### OPERARIO_DE_ALMACEN

✅ **Operaciones de Almacén**

- **Dashboard**: Visualización completa
- **Materiales**:
  - ✅ Visualización de materiales
  - ✅ Creación de movimientos
  - ✅ Validación de ubicaciones
  - ❌ Crear/Editar materiales
- **Movimientos**:
  - ✅ Crear movimientos
  - ✅ Visualizar movimientos
  - ✅ Marcar movimientos (en proceso/completado)
  - ✅ Validar ubicaciones
  - ❌ Editar movimientos de otros usuarios
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**: Solo lectura
- **Configuración**: Solo lectura
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

### OPERARIO_DE_CALIDAD

✅ **Operaciones de Calidad**

- **Dashboard**: Visualización completa
- **Materiales**: Solo lectura
- **Movimientos**: Solo lectura
- **Productos**: Solo lectura
- **Órdenes**: Solo lectura
- **Seguimiento**:
  - ✅ Visualización de lotes
  - ✅ Crear registros de calidad
  - ✅ Modificar registros de calidad propios
  - ✅ Visualización de parámetros
  - ✅ Acceso a información de lotes
  - ❌ Aprobar/Desaprobar parámetros (requiere supervisor)
  - ❌ Crear parámetros de calidad base
- **Configuración**: Solo lectura
- **Packagings**: Solo lectura
- **Notificaciones**: Acceso completo
- **Perfil**: Gestión de su propio perfil
- **Usuarios**: Sin acceso

---

## Notas Importantes

1. **Permisos de Lectura**: Todos los roles tienen acceso de lectura a la mayoría de las secciones para mantener la transparencia del sistema.

2. **Permisos de Escritura**: Los permisos de creación, edición y eliminación están restringidos según el rol y la responsabilidad del usuario.

3. **Supervisión por Sector**: Algunos supervisores solo pueden gestionar lotes de su sector asignado.

4. **Aprobaciones**: Las acciones de aprobación/rechazo requieren roles de gerencia o supervisión.

5. **Reportes**: La descarga de reportes y trazabilidad está disponible para roles de gestión y supervisión.

6. **Configuración del Sistema**: Solo el ADMIN puede modificar configuraciones críticas del sistema.

7. **Gestión de Usuarios**: Exclusivamente el ADMIN puede crear, editar y gestionar usuarios del sistema.

---

## Glosario de Términos

- **CRUD**: Create (Crear), Read (Leer), Update (Actualizar), Delete (Eliminar)
- **Lote**: Unidad de producción que representa una cantidad específica de producto
- **Orden de Producción**: Solicitud de producción que debe ser aprobada antes de generar lotes
- **Fase de Producción**: Etapa del proceso de fabricación (Molienda, Maceración, Filtración, etc.)
- **Receta**: Lista de materiales y cantidades necesarias para una fase específica
- **Parámetro de Calidad**: Medición o control de calidad que se registra durante la producción
- **Packaging**: Envase o empaque utilizado para el producto final
- **Movimiento de Stock**: Registro de entrada o salida de materiales del inventario
- **Trazabilidad**: Capacidad de rastrear el historial completo de un lote desde su origen hasta el producto final

---
