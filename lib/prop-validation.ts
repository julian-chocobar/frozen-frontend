/**
 * Utilidades para validación de props en desarrollo
 * Solo se ejecutan en modo desarrollo para no impactar el rendimiento en producción
 */

/**
 * Valida que un valor no sea null o undefined
 * 
 * @param value - Valor a validar
 * @param propName - Nombre de la prop para el mensaje de error
 * @param componentName - Nombre del componente para el mensaje de error
 * @throws Error en desarrollo si el valor es null o undefined
 */
export function validateRequired<T>(
  value: T | null | undefined,
  propName: string,
  componentName: string
): asserts value is T {
  if (process.env.NODE_ENV === 'development') {
    if (value === null || value === undefined) {
      console.warn(
        `[${componentName}] Prop '${propName}' es requerida pero no se proporcionó`
      )
    }
  }
}

/**
 * Valida que un valor esté en un conjunto de valores permitidos
 * 
 * @param value - Valor a validar
 * @param allowedValues - Array de valores permitidos
 * @param propName - Nombre de la prop para el mensaje de error
 * @param componentName - Nombre del componente para el mensaje de error
 * @throws Error en desarrollo si el valor no está en allowedValues
 */
export function validateOneOf<T extends string | number>(
  value: T,
  allowedValues: readonly T[],
  propName: string,
  componentName: string
): void {
  if (process.env.NODE_ENV === 'development') {
    if (!allowedValues.includes(value)) {
      console.warn(
        `[${componentName}] Prop '${propName}' debe ser uno de: ${allowedValues.join(', ')}. ` +
        `Recibido: ${value}`
      )
    }
  }
}

/**
 * Valida que un valor sea un número positivo
 * 
 * @param value - Valor a validar
 * @param propName - Nombre de la prop para el mensaje de error
 * @param componentName - Nombre del componente para el mensaje de error
 */
export function validatePositiveNumber(
  value: number,
  propName: string,
  componentName: string
): void {
  if (process.env.NODE_ENV === 'development') {
    if (typeof value !== 'number' || value < 0) {
      console.warn(
        `[${componentName}] Prop '${propName}' debe ser un número positivo. ` +
        `Recibido: ${value}`
      )
    }
  }
}

/**
 * Valida que un valor sea un array no vacío
 * 
 * @param value - Valor a validar
 * @param propName - Nombre de la prop para el mensaje de error
 * @param componentName - Nombre del componente para el mensaje de error
 */
export function validateNonEmptyArray<T>(
  value: T[],
  propName: string,
  componentName: string
): void {
  if (process.env.NODE_ENV === 'development') {
    if (!Array.isArray(value) || value.length === 0) {
      console.warn(
        `[${componentName}] Prop '${propName}' debe ser un array no vacío. ` +
        `Recibido: ${Array.isArray(value) ? 'array vacío' : typeof value}`
      )
    }
  }
}

/**
 * Valida props de un componente (solo en desarrollo)
 * 
 * @param props - Props a validar
 * @param validations - Objeto con validaciones a aplicar
 * @param componentName - Nombre del componente
 * 
 * @example
 * ```ts
 * validateProps(props, {
 *   color: (value) => validateOneOf(value, ['blue', 'orange', 'red'], 'color', 'ChartLoadingState'),
 *   unit: (value) => validateOneOf(value, ['L', 'kg'], 'unit', 'ChartTooltip'),
 * }, 'MyComponent')
 * ```
 */
export function validateProps<P extends Record<string, any>>(
  props: P,
  validations: Partial<Record<keyof P, (value: any) => void>>,
  componentName: string
): void {
  if (process.env.NODE_ENV === 'development') {
    Object.entries(validations).forEach(([propName, validateFn]) => {
      if (propName in props && validateFn) {
        try {
          validateFn(props[propName as keyof P])
        } catch (error) {
          console.warn(`[${componentName}] Error validando prop '${propName}':`, error)
        }
      }
    })
  }
}

