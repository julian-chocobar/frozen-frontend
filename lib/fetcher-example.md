# Fetcher API - Guía de Uso

## Configuración Actual

El fetcher está configurado para usar las credenciales por defecto de Spring Security:

- **Username**: `user`
- **Password**: `1234`

## Uso Básico

```typescript
import { api } from "@/lib/fetcher";

// Usar con credenciales por defecto
const materials = await api.get("/api/materials");
const newMaterial = await api.post("/api/materials", materialData);
```

## Uso con Credenciales Personalizadas

```typescript
import { api } from "@/lib/fetcher";

// Usar con credenciales específicas
const materials = await api.get(
  "/api/materials",
  {},
  {
    username: "admin",
    password: "admin123",
  }
);
```

## Usar Cliente API Personalizado

```typescript
import { createApiClient } from "@/lib/fetcher";

// Crear cliente con credenciales específicas
const adminApi = createApiClient("admin", "admin123");

// Usar el cliente
const materials = await adminApi.get("/api/materials");
const newMaterial = await adminApi.post("/api/materials", materialData);
```

## Configuración de Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

## Cambiar Credenciales por Defecto

Si necesitas cambiar las credenciales por defecto, modifica las constantes en `lib/fetcher.ts`:

```typescript
const DEFAULT_USERNAME = "tu_usuario";
const DEFAULT_PASSWORD = "tu_contraseña";
```

## Notas Importantes

1. **Seguridad**: Las credenciales están hardcodeadas por ahora. En producción, deberías usar variables de entorno o un sistema de autenticación más robusto.

2. **CORS**: Asegúrate de que tu backend Spring Boot tenga CORS configurado correctamente:

   ```java
   @CrossOrigin(origins = "http://localhost:3000")
   ```

3. **Spring Security**: Las credenciales `user:1234` son las que vienen por defecto con Spring Boot Security. Puedes cambiarlas en tu `application.properties`:
   ```properties
   spring.security.user.name=tu_usuario
   spring.security.user.password=tu_contraseña
   ```
