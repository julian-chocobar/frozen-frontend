"use client"

/**
 * Componente para buscar y seleccionar productos en filtros
 * Usa el endpoint api/products/id-name-list con búsqueda por nombre
 */

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProductsIdNameList } from "@/lib/products-api"

interface ProductSearchFilterProps {
  value: string
  onChange: (productId: string) => void
  placeholder?: string
  className?: string
}

export function ProductSearchFilter({ 
  value, 
  onChange, 
  placeholder = "Buscar producto por nombre...",
  className
}: ProductSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null)

  // Buscar productos cuando cambie el término de búsqueda
  useEffect(() => {
    const searchProducts = async () => {
      if (!searchTerm.trim()) {
        setProducts([])
        return
      }

      setLoading(true)
      try {
        // Buscar productos activos y listos para órdenes
        const productsList = await getProductsIdNameList({
          name: searchTerm,
          active: true,
          ready: true
        })
        setProducts(productsList)
      } catch (error) {
        console.error('Error al buscar productos:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce la búsqueda
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Cargar producto seleccionado cuando cambie el value
  useEffect(() => {
    if (value) {
      // Si tenemos un ID pero no el objeto completo, buscar por ID
      if (!selectedProduct || selectedProduct.id !== value) {
        const findProduct = async () => {
          try {
            const productsList = await getProductsIdNameList({
              active: true,
              ready: true
            })
            const product = productsList.find(p => p.id === value)
            if (product) {
              setSelectedProduct(product)
              setSearchTerm(product.name)
            }
          } catch (error) {
            console.error('Error al cargar producto:', error)
          }
        }
        findProduct()
      }
    } else {
      setSelectedProduct(null)
      setSearchTerm("")
    }
  }, [value])

  const handleProductSelect = (product: { id: string; name: string }) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowDropdown(false)
    onChange(product.id)
  }

  const handleClear = () => {
    setSelectedProduct(null)
    setSearchTerm("")
    setShowDropdown(false)
    onChange("")
  }

  return (
    <div className={cn("relative", className)}>
      {/* Campo de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 placeholder:text-primary-600",
          )}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showDropdown && searchTerm && (
        <div className="absolute z-50 w-full mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
          {products.length === 0 && !loading ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No se encontraron productos
            </div>
          ) : (
            products.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleProductSelect(product)}
                className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-primary-900 text-sm">{product.name}</div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Producto seleccionado */}
      {selectedProduct && (
        <div className="mt-1 p-1.5 bg-primary-50 border border-primary-200 rounded text-xs">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <div className="font-medium text-primary-900 truncate">
                {selectedProduct.name}
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-primary-500 hover:text-primary-700 ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}
