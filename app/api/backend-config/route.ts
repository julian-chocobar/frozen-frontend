import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

/**
 * API route que devuelve la configuración del backend
 * Permite que el cliente obtenga la URL del backend sin exponer variables de entorno
 */
export async function GET() {
  return NextResponse.json({
    backendUrl: config.backend.url,
  });
}
