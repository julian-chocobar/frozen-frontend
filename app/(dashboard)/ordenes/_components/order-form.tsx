"use client"

/**
 * Formulario para crear y editar órdenes de producción
 */

import { useState, useEffect } from "react"
import { getProducts } from "@/lib/products-api"
import { getPackagings } from "@/lib/packagings-api"
import type { 
  ProductionOrderResponse, 
  ProductionOrderCreateRequest, 
  ProductResponse, 
  PackagingResponse 
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
    productId: order?.productName || "",
    packagingId: order?.packagingName || "",
    quantity: order?.quantity || "",
    plannedDate: order?.plannedDate ? new Date(order.plannedDate).toISOString().split('T')[0] : ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [packagings, setPackagings] = useState<PackagingResponse[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, packagingsData] = await Promise.all([
          getProducts({ estado: 'Activo', ready: 'Listo' }),
          getPackagings({ isActive: true })
        ])
        
        setProducts(productsData.products)
        setPackagings(packagingsData.packagings)
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [])

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
        productId: formData.productId,
        packagingId: formData.packagingId,
        quantity: Number(formData.quantity),
        plannedDate: new Date(formData.plannedDate).toISOString()
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

  if (loadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-6 rounded-lg h-full flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Producto */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Producto *
          </label>
          <select
            value={formData.productId}
            onChange={(e) => handleChange("productId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.productId ? "border-red-500" : "border-stroke"
            }`}
          >
            <option value="">Seleccionar producto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
          {errors.productId && <p className="text-red-500 text-sm mt-1">{errors.productId}</p>}
        </div>

        {/* Empaque */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Empaque *
          </label>
          <select
            value={formData.packagingId}
            onChange={(e) => handleChange("packagingId", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.packagingId ? "border-red-500" : "border-stroke"
            }`}
          >
            <option value="">Seleccionar empaque</option>
            {packagings.map((packaging) => (
              <option key={packaging.id} value={packaging.id}>
                {packaging.name}
              </option>
            ))}
          </select>
          {errors.packagingId && <p className="text-red-500 text-sm mt-1">{errors.packagingId}</p>}
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
