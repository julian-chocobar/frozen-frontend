# Sistema de Diseño - Frozen Brewery Management

## Paleta de Colores

### Esquema Actual (Azul Índigo)

**Color Primario: Azul Índigo (#4f46e5)**
- Usado para: Bordes de tarjetas, botones primarios, textos de encabezados, enlaces, iconos activos
- Variantes: 50-950 (de más claro a más oscuro)

**Fondo: Beige Claro (#faf9f6)**
- Fondo principal de la aplicación
- Proporciona contraste suave con elementos blancos

**Colores de Estado:**
- **Éxito/Verde**: #22c55e (badges de estado "Bueno", "Completado")
- **Alerta/Rojo**: #ef4444 (badges de "Alta", "Bajo", alertas críticas)
- **Advertencia/Amarillo**: #eab308 (badges de "Media", advertencias)
- **Info/Azul Claro**: #3b82f6 (badges de "Planificada", "En Proceso")

### Esquema Anterior (Verde - Respaldo)

Guardado en `app/globals-green-backup.css`

**Color Primario: Verde Oscuro (#15803d)**
- Para restaurar este esquema, reemplaza el contenido de `globals.css` con `globals-green-backup.css`

## Tipografía

**Fuente Principal: JetBrains Mono**
- Fuente monoespaciada moderna
- Pesos disponibles: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Aplicada a toda la aplicación para consistencia

**Jerarquía:**
- H1: 1.5rem (24px) - Títulos principales de página
- H2: 1.25rem (20px) - Subtítulos y secciones
- H3: 1.125rem (18px) - Títulos de tarjetas
- Body: 1rem (16px) - Texto general
- Small: 0.875rem (14px) - Texto secundario

## Componentes

### Tarjetas (Cards)
- Fondo blanco (#ffffff)
- Borde azul índigo de 2px (#4f46e5)
- Border radius: 0.5rem (8px)
- Sombra sutil
- Padding: 1.5rem (24px) en desktop, 1rem (16px) en móvil

### Badges
- Border radius: 0.375rem (6px)
- Padding: 0.25rem 0.75rem
- Font weight: 600 (semibold)
- Borde de 1px del mismo color de fondo pero más oscuro

**Variantes:**
- `badge-primary`: Azul índigo
- `badge-success`: Verde
- `badge-alert`: Rojo
- `badge-warning`: Amarillo
- `badge-status`: Azul claro

### Botones
- Primario: Fondo azul índigo (#4f46e5), texto blanco
- Secundario: Fondo transparente, borde azul índigo, texto azul índigo
- Border radius: 0.5rem (8px)
- Padding: 0.5rem 1rem
- Font weight: 600

### Inputs
- Fondo blanco
- Borde gris claro (#e0e7ff) en estado normal
- Borde azul índigo (#4f46e5) en focus
- Border radius: 0.5rem (8px)
- Padding: 0.5rem 0.75rem

## Responsive

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

### Adaptaciones Móviles
- Sidebar → Bottom Bar
- Tablas → Cards apiladas
- Grid de 4 columnas → 2 columnas (tablet) → 1 columna (móvil)
- Padding reducido en tarjetas
- Tamaños de fuente ajustados

## Accesibilidad

- Contraste mínimo WCAG AA cumplido
- Focus visible en todos los elementos interactivos
- Soporte para `prefers-reduced-motion`
- Soporte para `prefers-contrast: high`
- Textos alternativos en imágenes
- Roles ARIA apropiados

## Animaciones

- Fade-in: 0.3s ease-out
- Hover transitions: 0.2s ease
- Navigation loader: Barra de progreso azul índigo
- Todas las animaciones respetan `prefers-reduced-motion`

## Iconos

- Librería: Lucide React
- Tamaño estándar: 20px
- Color: Hereda del texto o azul índigo para estados activos
- Stroke width: 2

## Espaciado

Sistema basado en múltiplos de 4px:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## Sombras

- Card: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- Card hover: `0 2px 4px 0 rgb(0 0 0 / 0.08)`
- Modal: `0 10px 15px -3px rgb(0 0 0 / 0.1)`

## Cómo Cambiar el Esquema de Colores

### Volver al Esquema Verde

1. Renombra `globals.css` a `globals-blue-backup.css`
2. Renombra `globals-green-backup.css` a `globals.css`
3. Reinicia el servidor de desarrollo

### Crear un Nuevo Esquema

1. Copia `globals.css` a `globals-[nombre]-backup.css`
2. Modifica las variables CSS en `:root` y `@theme inline`
3. Actualiza los valores de `--color-primary-*` con tu nueva paleta
4. Ajusta `--color-border` para que coincida con tu color primario
5. Prueba el contraste de accesibilidad
