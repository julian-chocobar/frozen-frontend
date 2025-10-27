// components/auth/protected-route.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si NO está autenticado y NO está cargando
    if (!isLoading && !isAuthenticated) {
      console.log('🔐 Protected route - redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Mostrar loading solo si está cargando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (será redirigido)
  if (!isAuthenticated) {
    return null;
  }

  // Usuario autenticado - mostrar contenido
  return <>{children}</>;
}