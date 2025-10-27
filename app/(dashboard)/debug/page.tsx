import AuthTest from '@/components/debug/auth-test';

export default function DebugPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Debug - Authentication Test</h1>
        <p className="text-muted-foreground">
          Esta página te permite probar si la autenticación funciona correctamente con los endpoints.
        </p>
      </div>
      
      <AuthTest />
      
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">📋 Instrucciones:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Haz login primero en la aplicación</li>
          <li>Ve a esta página de debug</li>
          <li>Haz clic en "Test Materials API" para probar el endpoint</li>
          <li>Revisa la consola del navegador para logs detallados</li>
          <li>Si hay errores, verifica la configuración del backend</li>
        </ol>
      </div>
    </div>
  );
}
