# Frozen - Gestión de Producción Cervecera

Sistema de gestión de producción para cervecería artesanal.

## 🚀 Requisitos Previos

- Node.js 18.0.0 o superior
- pnpm (recomendado) o npm

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd frozen-frontend
   ```

2. **Instalar dependencias**

   Recomendamos usar pnpm para un manejo más rápido y eficiente de paquetes:
   ```bash
   # Si no tienes pnpm instalado
   npm install -g pnpm

   # Instalar dependencias
   pnpm install
   ```

   Alternativa con npm:
   ```bash
   npm install
   ```

## 🖥️ Desarrollo

Para iniciar el servidor de desarrollo:

```bash
# Con pnpm (recomendado)
pnpm dev

# O con npm
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🛠️ Comandos útiles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Crea una versión de producción
- `pnpm start` - Inicia la aplicación en producción
- `pnpm lint` - Ejecuta el linter

## 🌟 Características

- Gestión de lotes de producción
- Seguimiento en tiempo real
- Panel de control intuitivo
- Interfaz responsiva

## Ventajas de usar pnpm sobre npm:

1. **Más rápido**: pnpm es significativamente más rápido que npm al instalar paquetes.
2. **Eficiencia de espacio**: Los paquetes se almacenan una sola vez en el disco, ahorrando espacio.
3. **Seguridad mejorada**: Crea una estructura de node_modules plana que es más predecible.
4. **Estricto**: Previene el acceso a paquetes no declarados.
