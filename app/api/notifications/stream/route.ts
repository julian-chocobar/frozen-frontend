import { NextRequest } from 'next/server';
import { config } from '@/lib/config';

/**
 * Proxy para Server-Sent Events (SSE)
 * EventSource no puede usar el proxy de Next.js directamente,
 * así que creamos un endpoint que hace la conexión SSE al backend
 * y la reenvía al cliente
 */
export async function GET(request: NextRequest) {
  const backendUrl = config.backend.url;
  const sseUrl = `${backendUrl}/api/notifications/stream`;

  try {
    // Obtener todas las cookies del cliente
    const cookies = request.headers.get('cookie') || '';
    
    // Hacer la petición al backend con las cookies del cliente
    const response = await fetch(sseUrl, {
      headers: {
        // Pasar las cookies del cliente al backend
        Cookie: cookies,
        // Pasar otros headers relevantes
        'Accept': 'text/event-stream',
      },
      // Incluir credenciales
      credentials: 'include',
      // No seguir redirects automáticamente para SSE
      redirect: 'manual',
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Backend responded with ${response.status}` }),
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Crear un stream que reenvíe los datos del backend al cliente
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            // Reenviar los datos al cliente
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Error en stream SSE:', error);
          controller.error(error);
        }
      },
    });

    // Retornar la respuesta con los headers correctos para SSE
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Deshabilitar buffering de nginx si está presente
      },
    });
  } catch (error) {
    console.error('Error conectando al backend SSE:', error);
    return new Response(
      JSON.stringify({ error: 'Error connecting to backend' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

