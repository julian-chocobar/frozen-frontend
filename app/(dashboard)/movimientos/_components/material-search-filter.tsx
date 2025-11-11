"use client"

/**
 * Componente para buscar y seleccionar materiales en filtros
 * Usa el endpoint api/materials/id-name-list con búsqueda por nombre
 */

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMaterialsIdNameList, type MaterialIdName } from "@/lib/materials-api"
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
  const [searchTerm, setSearchTerm] = useState("")
  const [materials, setMaterials] = useState<MaterialIdName[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialIdName | null>(null)

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

  // Cargar material seleccionado cuando cambie el value
  useEffect(() => {
    if (value) {
      // Si tenemos un ID pero no el objeto completo, buscar por ID
      if (!selectedMaterial || selectedMaterial.id.toString() !== value) {
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
          } catch (error) {
            console.error('Error al cargar material:', error)
          }
        }
        findMaterial()
      }
    } else {
      setSelectedMaterial(null)
      setSearchTerm("")
    }
  }, [value])

  const handleMaterialSelect = (material: MaterialIdName) => {
    setSelectedMaterial(material)
    setSearchTerm(material.name)
    setShowDropdown(false)
    onChange(material.id.toString())
  }

  const handleClear = () => {
    setSelectedMaterial(null)
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

      {/* Material seleccionado */}
      {selectedMaterial && (
        <div className="mt-1 p-1.5 bg-primary-50 border border-primary-200 rounded text-xs">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <div className="font-medium text-primary-900 truncate">
                {selectedMaterial.name}
              </div>
              <div className="text-primary-600">
                {selectedMaterial.code}
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
