/**
 * Componente DataTable genérico reutilizable
 * Proporciona una tabla base que puede ser configurada para cualquier tipo de datos
 */

import { cn } from "@/lib/utils"

export interface ColumnDef<T> {
  key: keyof T | string
  label: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
  sortable?: boolean
}

export interface TableActions<T> {
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onView?: (item: T) => void
  onToggleStatus?: (item: T) => void
  toggleStatusIcon?: (item: T) => React.ReactNode
  customActions?: Array<{
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: (item: T) => void
    className?: string
    variant?: 'default' | 'primary' | 'danger' | 'warning'
  }>
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  actions?: TableActions<T>
  loading?: boolean
  emptyMessage?: string
  className?: string
  rowClassName?: (item: T, index: number) => string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  className,
  rowClassName
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-stroke bg-surface-secondary">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "text-left py-3 px-4 text-sm font-semibold text-primary-900",
                  column.className
                )}
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="text-right py-3 px-4 text-sm font-semibold text-primary-900">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={cn(
                "border-b border-stroke hover:bg-surface-secondary transition-colors",
                rowClassName?.(item, index)
              )}
            >
              {columns.map((column) => {
                const value = column.key === 'id' ? item[column.key] : 
                  typeof column.key === 'string' ? 
                    column.key.split('.').reduce((obj, key) => obj?.[key], item) : 
                    item[column.key as keyof T]

                return (
                  <td
                    key={String(column.key)}
                    className={cn("py-4 px-4", column.className)}
                  >
                    {column.render ? column.render(value, item) : (
                      <span className="text-sm text-primary-900">
                        {value != null ? String(value) : '-'}
                      </span>
                    )}
                  </td>
                )
              })}
              {actions && (
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {actions.onView && (
                      <button
                        onClick={() => actions.onView!(item)}
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                        aria-label={`Ver detalles`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    )}
                    {actions.onEdit && (
                      <button
                        onClick={() => actions.onEdit!(item)}
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                        aria-label={`Editar`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {actions.onToggleStatus && (
                      <button
                        onClick={() => actions.onToggleStatus!(item)}
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                        aria-label={`Cambiar estado`}
                      >
                        {actions.toggleStatusIcon ? actions.toggleStatusIcon(item) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                          </svg>
                        )}
                      </button>
                    )}
                    {actions.customActions?.map((action, actionIndex) => {
                      const IconComponent = action.icon
                      return (
                        <button
                          key={actionIndex}
                          onClick={() => action.onClick(item)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            action.variant === 'danger' && "hover:bg-red-50 text-red-600",
                            action.variant === 'warning' && "hover:bg-yellow-50 text-yellow-600",
                            action.variant === 'primary' && "hover:bg-primary-50 text-primary-600",
                            !action.variant && "hover:bg-gray-50 text-gray-600",
                            action.className
                          )}
                          aria-label={action.label}
                        >
                          <IconComponent className="w-4 h-4" />
                        </button>
                      )
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
