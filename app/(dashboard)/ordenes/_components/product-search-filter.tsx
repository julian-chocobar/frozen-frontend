"use client"

/**
 * Componente para buscar y seleccionar productos en filtros
 * Usa el endpoint api/products/id-name-list con búsqueda por nombre
 */

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProductsIdNameList } from "@/lib/products"

interface ProductSearchFilterProps {
  value: string
  onChange: (productId: string) => void
  placeholder?: string
  className?: string
  autoRestore?: boolean // Si es true, restaura automáticamente desde sessionStorage cuando value está vacío
}

export function ProductSearchFilter({ 
  value, 
  onChange, 
  placeholder = "Buscar producto por nombre...",
  className,
  autoRestore = false
}: ProductSearchFilterProps) {
  // Función para obtener el estado persistido desde sessionStorage
  const getPersistedState = () => {
    if (typeof window === 'undefined') return null
    try {
      const stored = sessionStorage.getItem('product-search-filter-selected')
      if (stored) {
        return JSON.parse(stored) as { id: string; name: string }
      }
    } catch {
      return null
    }
    return null
  }

  // Función para persistir el estado
  const persistSelectedProduct = (product: { id: string; name: string } | null) => {
    if (typeof window === 'undefined') return
    try {
      if (product) {
        sessionStorage.setItem('product-search-filter-selected', JSON.stringify(product))
      } else {
        sessionStorage.removeItem('product-search-filter-selected')
      }
    } catch (e) {
      console.warn('Error al guardar producto seleccionado:', e)
    }
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  // Inicializar desde sessionStorage si existe, sino desde value
  const [selectedProduct, setSelectedProductState] = useState<{ id: string; name: string } | null>(() => {
    const persisted = getPersistedState()
    return persisted || null
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)

  // Wrapper para setSelectedProduct que también persiste
  const setSelectedProduct = (product: { id: string; name: string } | null) => {
    setSelectedProductState(product)
    persistSelectedProduct(product)
  }

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

  // Ref para evitar cargas innecesarias y mantener el último valor procesado
  const lastValueRef = useRef<string>("")
  const isLoadingRef = useRef<boolean>(false)
  const selectedProductRef = useRef<{ id: string; name: string } | null>(null)

  // Sincronizar ref con estado
  useEffect(() => {
    selectedProductRef.current = selectedProduct
  }, [selectedProduct])

  // Cargar producto seleccionado cuando cambie el value o al montar
  useEffect(() => {
    // Si el value no cambió, no hacer nada (excepto en el primer render si está vacío)
    if (lastValueRef.current === value && lastValueRef.current !== "") {
      return
    }
    
    // Si el value está vacío, restaurar desde sessionStorage solo si autoRestore está habilitado
    // Por defecto no restauramos para evitar aplicar filtros automáticamente cuando se abre una página sin filtros
    if (!value) {
      if (autoRestore) {
        const persisted = getPersistedState()
        if (persisted) {
          // Restaurar el producto persistido y notificar al padre
          setSelectedProduct(persisted)
          setSearchTerm(persisted.name)
          onChange(persisted.id)
          lastValueRef.current = persisted.id
          return
        }
      }
      // Limpiar el estado visual pero NO llamar a onChange para no aplicar el filtro
      setSelectedProduct(null)
      setSearchTerm("")
      lastValueRef.current = ""
      return
    }
    
    // Si hay un producto persistido y el value coincide, restaurarlo
    if (value) {
      const persisted = getPersistedState()
      if (persisted && persisted.id === value && (!selectedProductRef.current || selectedProductRef.current.id !== value)) {
        setSelectedProduct(persisted)
        setSearchTerm(persisted.name)
        lastValueRef.current = value
        return
      }
    }
    
    lastValueRef.current = value
    
    if (value) {
      // Si tenemos un ID pero no el objeto completo, buscar por ID
      // Solo buscar si el producto seleccionado no coincide con el value
      const currentProduct = selectedProductRef.current
      if (!currentProduct || currentProduct.id !== value) {
        // Evitar múltiples cargas simultáneas
        if (isLoadingRef.current) return
        isLoadingRef.current = true
        
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
            // Si no se encuentra, mantener el estado actual (no limpiar)
          } catch (error) {
            console.error('Error al cargar producto:', error)
          } finally {
            isLoadingRef.current = false
          }
        }
        findProduct()
      }
    } else {
      // Solo limpiar si realmente no hay value Y no hay producto persistido
      const persisted = getPersistedState()
      if (!persisted) {
        setSelectedProduct(null)
        setSearchTerm("")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]) // Solo depender de value, no de selectedProduct

  // Calcular posición del dropdown cuando se muestra
  useEffect(() => {
    if (showDropdown && searchTerm && inputRef.current) {
      const updatePosition = () => {
        if (!inputRef.current) return
        const rect = inputRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 4, // position: fixed usa coordenadas relativas al viewport
          left: rect.left,
          width: rect.width
        })
      }
      
      updatePosition()
      // Actualizar posición al redimensionar ventana
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
      }
    } else {
      setDropdownPosition(null)
    }
  }, [showDropdown, searchTerm])

  // Cerrar dropdown al hacer scroll
  useEffect(() => {
    if (!showDropdown) return

    const handleScroll = () => {
      setShowDropdown(false)
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [showDropdown])

  const handleProductSelect = (product: { id: string; name: string }) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowDropdown(false)
    onChange(product.id)
    // También persistir en sessionStorage con la key del componente padre
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('inventory-chart-productId', product.id)
      } catch (e) {
        console.warn('Error al guardar productId:', e)
      }
    }
  }

  const handleClear = () => {
    setSelectedProduct(null)
    setSearchTerm("")
    setShowDropdown(false)
    onChange("")
    // Limpiar sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('inventory-chart-productId')
      } catch (e) {
        console.warn('Error al limpiar productId:', e)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setShowDropdown(true)
    
    // Si el usuario está escribiendo algo diferente al producto seleccionado, limpiar la selección
    if (selectedProduct && newValue !== selectedProduct.name) {
      setSelectedProduct(null)
      onChange("")
    }
  }

  return (
    <div className={cn("relative max-w-xs", className)}>
      {/* Campo de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 placeholder:text-primary-600",
            selectedProduct && "bg-primary-50"
          )}
        />
        {loading && !selectedProduct && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
        {selectedProduct && !loading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown de resultados - usando portal para evitar overflow */}
      {showDropdown && searchTerm && !selectedProduct && dropdownPosition && typeof window !== 'undefined' && createPortal(
        <>
          {/* Overlay para cerrar dropdown */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowDropdown(false)}
          />
          {/* Dropdown posicionado fijamente calculado desde el input */}
          <div 
            className="fixed z-[9999] max-h-60 overflow-y-auto border border-stroke rounded-lg bg-white shadow-xl"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            {products.length === 0 && !loading ? (
              <div className="px-3 py-2 text-sm text-primary-600">
                No se encontraron productos
              </div>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductSelect(product)}
                  className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-primary-100 last:border-b-0 transition-colors"
                >
                  <div className="font-medium text-primary-900 text-sm">{product.name}</div>
                </button>
              ))
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  )
}
