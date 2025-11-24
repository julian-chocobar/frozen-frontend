/**
 * Componente DataCards genérico reutilizable
 * Proporciona cards responsivos que pueden ser configurados para cualquier tipo de datos
 */

import { cn } from "@/lib/utils"
import type { TableActions } from "./data-table"

// Re-export TableActions for convenience
export type { TableActions } from "./data-table"

export interface CardField<T> {
  key: keyof T | string
  label?: string
  render?: (value: any, item: T) => React.ReactNode
  className?: string
  showLabel?: boolean
}

export interface CardLayout<T> {
  header: CardField<T>[]
  content: CardField<T>[]
  footer?: CardField<T>[]
}

interface DataCardsProps<T> {
  data: T[]
  layout: CardLayout<T>
  actions?: TableActions<T>
  loading?: boolean
  emptyMessage?: string
  className?: string
  cardClassName?: (item: T, index: number) => string
}

export function DataCards<T extends Record<string, any>>({
  data,
  layout,
  actions,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  className,
  cardClassName
}: DataCardsProps<T>) {
  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-stroke rounded-lg p-4 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="text-gray-400 text-lg mb-2">📋</div>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  const renderField = (field: CardField<T>, item: T) => {
    const value = field.key === 'id' ? item[field.key] : 
      typeof field.key === 'string' ? 
        field.key.split('.').reduce((obj, key) => obj?.[key], item) : 
        item[field.key as keyof T]

    const content = field.render ? field.render(value, item) : (
      <span className="text-sm text-primary-900">
        {value != null ? String(value) : '-'}
      </span>
    )

    if (field.showLabel === false) {
      return content
    }

    return (
      <div className={cn("space-y-1", field.className)}>
        {field.label && (
          <label className="text-xs text-primary-700 font-medium">
            {field.label}
          </label>
        )}
        <div className="text-sm text-primary-900">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className={cn(
            "bg-white border border-stroke rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
            cardClassName?.(item, index)
          )}
        >
          {/* Header */}
          {layout.header.length > 0 && (
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {layout.header.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    {renderField(field, item)}
                  </div>
                ))}
              </div>
              {actions && (
                <div className="flex items-center gap-2 ml-4">
                  {actions.onView && (
                    <button
                      onClick={() => actions.onView!(item)}
                      className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                      aria-label="Ver detalles"
                      data-tour="products-view-button"
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
                      aria-label="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {layout.content.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {layout.content.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  {renderField(field, item)}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {layout.footer && layout.footer.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-stroke">
              <div className="flex items-center gap-4">
                {layout.footer.map((field, fieldIndex) => (
                  <div key={fieldIndex}>
                    {renderField(field, item)}
                  </div>
                ))}
              </div>
              {actions && (
                <div className="flex items-center gap-2">
                  {actions.onToggleStatus && (
                    <button
                      onClick={() => actions.onToggleStatus!(item)}
                      className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                      aria-label="Cambiar estado"
                    >
                      {actions.toggleStatusIcon ? actions.toggleStatusIcon(item) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                      )}
                    </button>
                  )}
                  {(typeof actions.customActions === 'function' 
                    ? actions.customActions(item) 
                    : actions.customActions)?.map((action, actionIndex) => {
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
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
