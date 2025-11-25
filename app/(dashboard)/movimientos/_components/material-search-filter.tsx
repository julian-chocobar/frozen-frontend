"use client"

/**
 * Componente para buscar y seleccionar materiales en filtros
 * Usa el endpoint api/materials/id-name-list con búsqueda por nombre
 */

import { useState, useEffect, useRef } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMaterialsIdNameList, type MaterialIdName } from "@/lib/materials/api"
import type { Phase } from "@/types"

interface MaterialSearchFilterProps {
  value: string
  onChange: (materialId: string) => void
  placeholder?: string
  className?: string
  phase?: Phase
}

export function MaterialSearchFilter({ 
  value, 
  onChange, 
  placeholder = "Buscar material por nombre...",
  className,
  phase
}: MaterialSearchFilterProps) {
  // Función para obtener el estado persistido desde sessionStorage
  const getPersistedState = () => {
    if (typeof window === 'undefined') return null
    try {
      const stored = sessionStorage.getItem('material-search-filter-selected')
      if (stored) {
        return JSON.parse(stored) as MaterialIdName
      }
    } catch {
      return null
    }
    return null
  }

  // Función para persistir el estado
  const persistSelectedMaterial = (material: MaterialIdName | null) => {
    if (typeof window === 'undefined') return
    try {
      if (material) {
        sessionStorage.setItem('material-search-filter-selected', JSON.stringify(material))
      } else {
        sessionStorage.removeItem('material-search-filter-selected')
      }
    } catch (e) {
      console.warn('Error al guardar material seleccionado:', e)
    }
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [materials, setMaterials] = useState<MaterialIdName[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  // Inicializar desde sessionStorage si existe, sino desde value
  const [selectedMaterial, setSelectedMaterialState] = useState<MaterialIdName | null>(() => {
    const persisted = getPersistedState()
    return persisted || null
  })

  // Wrapper para setSelectedMaterial que también persiste
  const setSelectedMaterial = (material: MaterialIdName | null) => {
    setSelectedMaterialState(material)
    persistSelectedMaterial(material)
  }

  // Buscar materiales cuando cambie el término de búsqueda
  useEffect(() => {
    const searchMaterials = async () => {
      if (!searchTerm.trim()) {
        setMaterials([])
        return
      }

      setLoading(true)
      try {
        // Buscar materiales con filtros específicos
        const materialsList = await getMaterialsIdNameList({
          name: searchTerm,
          active: true,
          phase: phase
        })
        setMaterials(materialsList)
      } catch (error) {
        console.error('Error al buscar materiales:', error)
        setMaterials([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce la búsqueda
    const timeoutId = setTimeout(searchMaterials, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Ref para evitar cargas innecesarias y mantener el último valor procesado
  const lastValueRef = useRef<string>("")
  const isLoadingRef = useRef<boolean>(false)
  const selectedMaterialRef = useRef<MaterialIdName | null>(null)

  // Sincronizar ref con estado
  useEffect(() => {
    selectedMaterialRef.current = selectedMaterial
  }, [selectedMaterial])

  // Cargar material seleccionado cuando cambie el value o al montar
  useEffect(() => {
    // Si el value no cambió, no hacer nada (excepto en el primer render si está vacío)
    if (lastValueRef.current === value && lastValueRef.current !== "") {
      return
    }
    
    // Si el value está vacío pero hay un material persistido, restaurarlo y notificar al padre
    if (!value) {
      const persisted = getPersistedState()
      if (persisted) {
        // Restaurar el material persistido y notificar al padre
        setSelectedMaterial(persisted)
        setSearchTerm(persisted.name)
        onChange(persisted.id.toString())
        lastValueRef.current = persisted.id.toString()
        return
      }
    }
    
    // Si hay un material persistido y el value coincide, restaurarlo
    if (value) {
      const persisted = getPersistedState()
      if (persisted && persisted.id.toString() === value && (!selectedMaterialRef.current || selectedMaterialRef.current.id.toString() !== value)) {
        setSelectedMaterial(persisted)
        setSearchTerm(persisted.name)
        lastValueRef.current = value
        return
      }
    }
    
    lastValueRef.current = value
    
    if (value) {
      // Si tenemos un ID pero no el objeto completo, buscar por ID
      // Solo buscar si el material seleccionado no coincide con el value
      const currentMaterial = selectedMaterialRef.current
      if (!currentMaterial || currentMaterial.id.toString() !== value) {
        // Evitar múltiples cargas simultáneas
        if (isLoadingRef.current) return
        isLoadingRef.current = true
        
        const findMaterial = async () => {
          try {
            const materialsList = await getMaterialsIdNameList({
              // Buscar sin filtros para encontrar por ID
            })
            const material = materialsList.find(m => m.id.toString() === value)
            if (material) {
              setSelectedMaterial(material)
              setSearchTerm(material.name)
            }
            // Si no se encuentra, mantener el estado actual (no limpiar)
          } catch (error) {
            console.error('Error al cargar material:', error)
          } finally {
            isLoadingRef.current = false
          }
        }
        findMaterial()
      }
    } else {
      // Solo limpiar si realmente no hay value Y no hay material persistido
      const persisted = getPersistedState()
      if (!persisted) {
        setSelectedMaterial(null)
        setSearchTerm("")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]) // Solo depender de value, no de selectedMaterial

  const handleMaterialSelect = (material: MaterialIdName) => {
    setSelectedMaterial(material)
    setSearchTerm(material.name)
    setShowDropdown(false)
    onChange(material.id.toString())
    // También persistir en sessionStorage con la key del componente padre
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('usage-trends-chart-materialId', material.id.toString())
      } catch (e) {
        console.warn('Error al guardar materialId:', e)
      }
    }
  }

  const handleClear = () => {
    setSelectedMaterial(null)
    setSearchTerm("")
    setShowDropdown(false)
    onChange("")
    // Limpiar sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('usage-trends-chart-materialId')
      } catch (e) {
        console.warn('Error al limpiar materialId:', e)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setShowDropdown(true)
    
    // Si el usuario está escribiendo algo diferente al material seleccionado, limpiar la selección
    if (selectedMaterial && newValue !== selectedMaterial.name) {
      setSelectedMaterial(null)
      onChange("")
    }
  }

  return (
    <div className={cn("relative max-w-xs", className)}>
      {/* Campo de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-600" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 border border-stroke rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600",
            "text-sm text-primary-900 placeholder:text-primary-600",
            selectedMaterial && "bg-primary-50"
          )}
        />
        {loading && !selectedMaterial && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
        {selectedMaterial && !loading && (
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

      {/* Dropdown de resultados */}
      {showDropdown && searchTerm && !selectedMaterial && (
        <div className="absolute z-50 w-full mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
          {materials.length === 0 && !loading ? (
            <div className="px-3 py-2 text-sm text-primary-600">
              No se encontraron materiales
            </div>
          ) : (
            materials.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => handleMaterialSelect(material)}
                className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-primary-100 last:border-b-0"
              >
                <div className="font-medium text-primary-900 text-sm">{material.name}</div>
                <div className="text-xs text-primary-600">Código: {material.code}</div>
              </button>
            ))
          )}
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
