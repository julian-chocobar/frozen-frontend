// lib/config.ts

/**
 * Configuración centralizada de la aplicación
 * Maneja variables de entorno tanto en desarrollo como producción
 */

interface AppConfig {
  backend: {
    url: string;
    protocol: string;
    host: string;
    port: string;
  };
  debug: {
    api: boolean;
  };
  env: 'development' | 'production' | 'test';
}

/**
 * Obtiene la URL completa del backend
 * - En desarrollo: usa BACKEND_URL del .env.local
 * - En producción: usa BACKEND_URL de las variables de entorno del deploy
 */
function getBackendUrl(): string {
  // Variables de entorno del servidor (tienen prioridad)
  const backendUrl = process.env.BACKEND_URL;
  
  if (backendUrl) {
    return backendUrl;
  }

  // Fallback: construir URL desde componentes individuales
  const protocol = process.env.BACKEND_PROTOCOL || 'http';
  const host = process.env.BACKEND_HOST || 'localhost';
  const port = process.env.BACKEND_PORT || '8080';
  
  return `${protocol}://${host}:${port}`;
}

/**
 * Configuración de la aplicación
 * Exportada como constante para fácil importación
 */
export const config: AppConfig = {
  backend: {
    url: getBackendUrl(),
    protocol: process.env.BACKEND_PROTOCOL || 'http',
    host: process.env.BACKEND_HOST || 'localhost',
    port: process.env.BACKEND_PORT || '8080',
  },
  debug: {
    api: process.env.DEBUG_API === 'true' || process.env.NODE_ENV === 'development',
  },
  env: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
};

/**
 * Utilidad para logging condicional basado en configuración
 */
export const logger = {
  api: (...args: any[]) => {
    if (config.debug.api) {
      console.log('🌐 API:', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('🚨 Error:', ...args);
  },
  info: (...args: any[]) => {
    console.log('ℹ️ Info:', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('⚠️ Warning:', ...args);
  },
};

export default config;