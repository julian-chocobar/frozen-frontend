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
        let isClosed = false;

        // Helper para cerrar el controller de forma segura
        const safeClose = () => {
          if (!isClosed) {
            try {
              controller.close();
              isClosed = true;
            } catch (error) {
              // Controller ya estaba cerrado, ignorar
              isClosed = true;
            }
          }
        };

        // Helper para enviar error de forma segura
        const safeError = (error: Error) => {
          if (!isClosed) {
            try {
              controller.error(error);
              isClosed = true;
            } catch (err) {
              // Controller ya estaba cerrado, solo loguear
              console.error('Error al cerrar controller (ya estaba cerrado):', err);
              isClosed = true;
            }
          }
        };

        if (!reader) {
          safeClose();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              safeClose();
              break;
            }

            // Solo intentar enviar datos si el controller no está cerrado
            if (!isClosed) {
              try {
                controller.enqueue(value);
              } catch (error) {
                // Cliente probablemente cerró la conexión
                console.log('Cliente cerró la conexión SSE');
                safeClose();
                break;
              }
            } else {
              // Si ya está cerrado, detener el loop
              break;
            }
          }
        } catch (error) {
          // Solo loguear errores que no sean de conexión cerrada
          if (error instanceof TypeError && error.message.includes('aborted')) {
            console.log('Conexión SSE abortada por el cliente');
          } else {
            console.error('Error en stream SSE:', error);
          }
          safeError(error as Error);
        } finally {
          // Asegurarse de liberar el reader
          try {
            if (reader) {
              await reader.cancel();
            }
          } catch (error) {
            // Ignorar errores al cancelar el reader
          }
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

