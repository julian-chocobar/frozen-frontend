"use client"

/**
 * Formulario para crear y editar órdenes de producción
 */

import { useState, useEffect } from "react"
import { getPackagingsIdNameList } from "@/lib/packagings-api"
import { ProductSearchFilter } from "./product-search-filter"
import type { 
  ProductionOrderResponse, 
  ProductionOrderCreateRequest
} from "@/types"

interface OrderFormProps {
  order?: ProductionOrderResponse
  onSubmit: (data: ProductionOrderCreateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function OrderForm({ order, onSubmit, onCancel, isLoading = false }: OrderFormProps) {
  const isEditing = !!order
  
  const [formData, setFormData] = useState({
    productId: "",
    packagingId: "",
    quantity: order?.quantity || "",
    plannedDate: order?.plannedDate ? new Date(order.plannedDate).toISOString().split('T')[0] : ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [packagings, setPackagings] = useState<{ id: number; name: string; productId: string }[]>([])
  const [packagingSearch, setPackagingSearch] = useState("")
  const [showPackagingDropdown, setShowPackagingDropdown] = useState(false)
  const [loadingPackagings, setLoadingPackagings] = useState(false)
  const [selectedPackaging, setSelectedPackaging] = useState<{ id: number; name: string; productId: string } | null>(null)

  // Buscar packagings cuando cambie el término de búsqueda y haya un producto seleccionado
  useEffect(() => {
    const searchPackagings = async () => {
      if (!packagingSearch.trim() || !formData.productId) {
        setPackagings([])
        return
      }

      setLoadingPackagings(true)
      try {
        const packagingsData = await getPackagingsIdNameList({
          name: packagingSearch,
          productId: formData.productId,
          active: true
        })
        setPackagings(packagingsData)
      } catch (error) {
        console.error('Error al buscar packagings:', error)
        setPackagings([])
      } finally {
        setLoadingPackagings(false)
      }
    }

    const timeoutId = setTimeout(searchPackagings, 300)
    return () => clearTimeout(timeoutId)
  }, [packagingSearch, formData.productId])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.productId) {
      newErrors.productId = "El producto es requerido"
    }

    if (!formData.packagingId) {
      newErrors.packagingId = "El empaque es requerido"
    }

    if (!formData.quantity || formData.quantity === "" || Number(formData.quantity) <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0"
    }

    if (!formData.plannedDate) {
      newErrors.plannedDate = "La fecha planificada es requerida"
    } else {
      const plannedDate = new Date(formData.plannedDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (plannedDate < today) {
        newErrors.plannedDate = "La fecha planificada no puede ser anterior a hoy"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const submitData: ProductionOrderCreateRequest = {
        productId: Number(formData.productId),
        packagingId: Number(formData.packagingId),
        quantity: Number(formData.quantity),
        plannedDate: toOffsetDateTimeLocal(formData.plannedDate)
      }
      
      onSubmit(submitData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleProductChange = (productId: string) => {
    setFormData(prev => ({ ...prev, productId }))
    // Limpiar packaging cuando cambie el producto
    setFormData(prev => ({ ...prev, packagingId: "" }))
    setSelectedPackaging(null)
    setPackagingSearch("")
    // Limpiar errores
    if (errors.productId) {
      setErrors(prev => ({ ...prev, productId: "" }))
    }
  }

  const handlePackagingSelect = (packaging: { id: number; name: string; productId: string }) => {
    setSelectedPackaging(packaging)
    setFormData(prev => ({ ...prev, packagingId: packaging.id.toString() }))
    setPackagingSearch(packaging.name)
    setShowPackagingDropdown(false)
    // Limpiar errores
    if (errors.packagingId) {
      setErrors(prev => ({ ...prev, packagingId: "" }))
    }
  }

  const handlePackagingSearchChange = (value: string) => {
    setPackagingSearch(value)
    setShowPackagingDropdown(true)
    // Si el usuario está escribiendo, limpiar la selección
    if (value !== packagingSearch && formData.packagingId) {
      setFormData(prev => ({ ...prev, packagingId: "" }))
      setSelectedPackaging(null)
    }
  }

  const toOffsetDateTimeLocal = (dateString: string) => {
    // dateString en formato YYYY-MM-DD; construir medianoche local con offset
    const [y, m, d] = dateString.split('-').map(Number)
    const pad = (n: number) => n.toString().padStart(2, '0')
    const local = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0)
    const tzOffsetMinutes = -local.getTimezoneOffset() // minutos al Este de UTC
    const sign = tzOffsetMinutes >= 0 ? '+' : '-'
    const abs = Math.abs(tzOffsetMinutes)
    const oh = pad(Math.floor(abs / 60))
    const om = pad(abs % 60)
    return `${y}-${pad(m || 1)}-${pad(d || 1)}T00:00:00${sign}${oh}:${om}`
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-6 rounded-lg h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Producto */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Producto *
          </label>
          
          <ProductSearchFilter
            value={formData.productId}
            onChange={handleProductChange}
            placeholder="Buscar producto por nombre..."
            className={errors.productId ? "border-red-500" : ""}
          />

          {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
        </div>

        {/* Empaque */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Empaque *
          </label>
          
          {/* Campo de búsqueda */}
          <div className="relative">
            <input
              type="text"
              value={packagingSearch}
              onChange={(e) => handlePackagingSearchChange(e.target.value)}
              onFocus={() => setShowPackagingDropdown(true)}
              placeholder={formData.productId ? "Buscar empaque por nombre..." : "Primero selecciona un producto"}
              disabled={!formData.productId}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                errors.packagingId ? "border-red-500" : "border-stroke"
              } ${!formData.productId ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {loadingPackagings && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Dropdown de resultados */}
          {showPackagingDropdown && packagingSearch && formData.productId && (
            <div className="absolute z-50 w-69 mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
              {packagings.length === 0 && !loadingPackagings ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron empaques
                </div>
              ) : (
                packagings.map((packaging) => (
                  <button
                    key={packaging.id}
                    type="button"
                    onClick={() => handlePackagingSelect(packaging)}
                    className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-primary-900 text-sm">{packaging.name}</div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Overlay para cerrar dropdown */}
          {showPackagingDropdown && (
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPackagingDropdown(false)}
            />
          )}

          {errors.packagingId && <p className="text-red-500 text-sm mt-1">{errors.packagingId}</p>}
          
          {/* Información del empaque seleccionado */}
          {selectedPackaging && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-1">Empaque Seleccionado</h4>
              <div className="text-sm text-green-700">
                <div>
                  <span className="font-medium">Nombre:</span> {selectedPackaging.name}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {selectedPackaging.id}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cantidad */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Cantidad *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.quantity ? "border-red-500" : "border-stroke"
            }`}
            placeholder="0.00"
          />
          {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
        </div>

        {/* Fecha Planificada */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Fecha Planificada *
          </label>
          <input
            type="date"
            value={formData.plannedDate}
            onChange={(e) => handleChange("plannedDate", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.plannedDate ? "border-red-500" : "border-stroke"
            }`}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.plannedDate && <p className="text-red-500 text-sm mt-1">{errors.plannedDate}</p>}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-6 border-t border-stroke mt-auto">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : order ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  )
}
