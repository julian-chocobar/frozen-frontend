'use client'

import 'leaflet/dist/leaflet.css'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import L, { type ImageOverlay, type Map as LeafletMap, type Marker } from 'leaflet'
import { ChevronLeft, ChevronRight, Crosshair, MapPinned, RefreshCcw, Search, ZoomIn, ZoomOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  getDynamicWarehouseLayout,
  getMaterialsWarehouseMap,
  getWarehouseInfo,
  getWarehouseLayout,
} from '@/lib/warehouse-api'
import type { MaterialWarehouseLocation, WarehouseInfoResponse } from '@/types'

const WAREHOUSE_WIDTH = 1000
const WAREHOUSE_HEIGHT = 600
const INITIAL_ZOOM = 0
const MIN_ZOOM = -1.5
const MAX_ZOOM = 2.5

const warehouseBounds: L.LatLngBoundsExpression = [
  [0, 0],
  [WAREHOUSE_HEIGHT, WAREHOUSE_WIDTH],
]

const zonePalette: Record<string, string> = { 
  ZONA_MALTA: '#2563eb',
  MALTA: '#2563eb',

  ZONA_LUPULO: '#7c3aed',
  LUPULO: '#7c3aed',

  ZONA_LEVADURA: '#f43f5e',
  LEVADURA: '#f43f5e',

  ZONA_AGUA: '#38bdf8',
  AGUA: '#38bdf8',

  ZONA_ENVASE: '#22c55e',
  ENVASE: '#22c55e',

  ZONA_ETIQUETADO: '#fb923c',
  ETIQUETADO: '#fb923c',

  ZONA_OTROS: '#94a3b8',
  OTROS: '#94a3b8',
}

const fallbackZoneColor = '#2563eb'

let markerIconGradientId = 0

const normalizeZoneKey = (zone?: string | null) => zone?.replace(/\s+/g, '_').toUpperCase() ?? ''

const getZoneColor = (zone?: string | null) => {
  const key = normalizeZoneKey(zone)
  return zonePalette[key] ?? fallbackZoneColor
}

const formatZoneLabel = (zone?: string | null) => {
  if (!zone) return 'Zona desconocida'
  const cleaned = zone.replace(/^ZONA[_-]?/i, '').replace(/_/g, ' ').trim()
  if (!cleaned) {
    return zone
  }
  const titled = cleaned
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
  return titled
}

const hexToRgba = (hex: string, alpha: number) => {
  const fallback = `rgba(37, 99, 235, ${alpha})`
  if (!hex) return fallback
  let normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    normalized = normalized
      .split('')
      .map((char) => char + char)
      .join('')
  }
  if (normalized.length !== 6) return fallback
  const bigint = Number.parseInt(normalized, 16)
  if (Number.isNaN(bigint)) return fallback
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const projectPoint = (x?: number | null, y?: number | null) => {
  if (x == null || y == null) return null
  return [WAREHOUSE_HEIGHT - y, x] as [number, number]
}

const buildMarkerIcon = (color: string, isSelected: boolean) => {
  const ring = hexToRgba(color, 0.18)
  const shadow = hexToRgba(color, 0.24)
  const gradientId = `warehouse-marker-gradient-${markerIconGradientId++}`
  return L.divIcon({
    className: 'warehouse-marker-icon',
    html: `
      <span class="warehouse-marker warehouse-marker--pin ${isSelected ? 'warehouse-marker--pin-active' : ''}"
        style="--marker-color:${color}; --marker-ring:${ring}; --marker-shadow:${shadow};">
        <span class="warehouse-marker__glow"></span>
        <span class="warehouse-marker__sheen"></span>
        <span class="warehouse-marker__body">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="${gradientId}" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stop-color="${color}" stop-opacity="0.95" />
                <stop offset="1" stop-color="${color}" stop-opacity="0.65" />
              </linearGradient>
            </defs>
            <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.7822 10.4026 20.4523 11.3408 21.5686C11.7054 22.0018 12.2946 22.0018 12.6592 21.5686C13.5974 20.4523 19 13.7822 19 9C19 5.13401 15.866 2 12 2Z" fill="url(#${gradientId})" stroke="rgba(15,23,42,0.28)" stroke-width="1.4"/>
            <circle cx="12" cy="9" r="3.4" fill="white" />
          </svg>
        </span>
      </span>
    `,
    iconSize: [28, 34],
    iconAnchor: [14, 22],
    tooltipAnchor: [0, -18],
  })
}

interface ZoneOption {
  value: string
  label: string
  color: string
}

interface MaterialsWarehousePanelProps {
  selectedMaterialId?: string | null
  onSelectMaterial?: (materialId: string) => void
}

export function MaterialsWarehousePanel({ selectedMaterialId, onSelectMaterial }: MaterialsWarehousePanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [loadingLayout, setLoadingLayout] = useState(false)
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [layoutSvg, setLayoutSvg] = useState<string>('')
  const [allMaterials, setAllMaterials] = useState<MaterialWarehouseLocation[]>([])
  const [zoneFilter, setZoneFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [warehouseInfo, setWarehouseInfo] = useState<WarehouseInfoResponse | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [zoneSummaries, setZoneSummaries] = useState<Array<{ zone: string; total: number; occupied: number; free: number }>>([])

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const overlayRef = useRef<ImageOverlay | null>(null)
  const overlayUrlRef = useRef<string | null>(null)
  const markersRef = useRef<Map<string, { marker: Marker; material: MaterialWarehouseLocation }>>(new Map())
  const selectedMarkerIdRef = useRef<string | null>(selectedMaterialId ?? null)

  useEffect(() => {
    selectedMarkerIdRef.current = selectedMaterialId ?? null
  }, [selectedMaterialId])

  const initializeMap = useCallback(() => {
    if (mapRef.current || !mapContainerRef.current) return

    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      zoomControl: false,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: warehouseBounds,
      maxBoundsViscosity: 1.0,
      preferCanvas: true,
      attributionControl: false,
      scrollWheelZoom: true,
    })

    map.fitBounds(warehouseBounds)
    map.setZoom(INITIAL_ZOOM)
    mapRef.current = map

    setTimeout(() => map.invalidateSize(), 120)
  }, [])

  useEffect(() => {
    if (isOpen) {
      initializeMap()
    } else {
      markersRef.current.forEach(({ marker }) => marker.remove())
      markersRef.current.clear()
      if (overlayRef.current) {
        overlayRef.current.remove()
        overlayRef.current = null
      }
      if (overlayUrlRef.current) {
        URL.revokeObjectURL(overlayUrlRef.current)
        overlayUrlRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [initializeMap, isOpen])

  useEffect(() => {
    return () => {
      if (overlayUrlRef.current) {
        URL.revokeObjectURL(overlayUrlRef.current)
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  const loadLayout = useCallback(async () => {
    if (!isOpen) return
    try {
      setLoadingLayout(true)
      setIsRefreshing(true)
      const svg = await getDynamicWarehouseLayout()
      setLayoutSvg(svg)
    } catch (error) {
      console.error('Error al cargar layout del almacén', error)
    } finally {
      setLoadingLayout(false)
      setIsRefreshing(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadLayout()
    }
  }, [isOpen, loadLayout])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !layoutSvg || !isOpen) return

    if (overlayRef.current) {
      map.removeLayer(overlayRef.current)
      overlayRef.current = null
    }
    if (overlayUrlRef.current) {
      URL.revokeObjectURL(overlayUrlRef.current)
      overlayUrlRef.current = null
    }

    const url = URL.createObjectURL(new Blob([layoutSvg], { type: 'image/svg+xml' }))
    overlayUrlRef.current = url
    const overlay = L.imageOverlay(url, warehouseBounds, { interactive: false, opacity: 1 })
    overlay.addTo(map)
    overlayRef.current = overlay

    setTimeout(() => map.invalidateSize(), 100)
  }, [isOpen, layoutSvg])

  const loadMaterials = useCallback(async () => {
    if (!isOpen) return
    try {
      setLoadingMaterials(true)
      const materials = await getMaterialsWarehouseMap({
        zone: zoneFilter === 'all' ? undefined : zoneFilter,
        activeOnly: undefined,
      })
      setAllMaterials(materials)
    } catch (error) {
      console.error('Error al cargar materiales del almacén', error)
    } finally {
      setLoadingMaterials(false)
    }
  }, [isOpen, zoneFilter])

  useEffect(() => {
    if (isOpen) {
      loadMaterials()
    }
  }, [isOpen, loadMaterials])

  useEffect(() => {
    const fetchWarehouseContext = async () => {
      try {
        const info = await getWarehouseInfo()
        setWarehouseInfo(info)
      } catch (error) {
        console.error('Error al obtener información del almacén', error)
      }
    }

    fetchWarehouseContext()
  }, [])

  const zoneOptions = useMemo<ZoneOption[]>(() => {
    if (!warehouseInfo?.availableZones) return []
    return warehouseInfo.availableZones
      .map((zone, index) => {
        if (typeof zone === 'string') {
          const value = zone
          const color = getZoneColor(value)
          return { value, label: formatZoneLabel(value), color }
        }
        const value = zone?.name ?? `zone-${index}`
        const color = getZoneColor(zone?.name)
        return { value, label: formatZoneLabel(zone?.name ?? `Zona ${index + 1}`), color }
      })
      .filter((option) => Boolean(option.value))
  }, [warehouseInfo?.availableZones])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredMaterials = useMemo(() => {
    return allMaterials.filter((material) => {
      const materialName = (material.name ?? material.materialName ?? '').toLowerCase()
      const materialCode = (material.code ?? material.materialCode ?? '').toLowerCase()
      const matchesZone =
        zoneFilter === 'all' || normalizeZoneKey(material.warehouseZone) === normalizeZoneKey(zoneFilter)
      const matchesSearch =
        normalizedSearch.length === 0 ||
        materialName.includes(normalizedSearch) ||
        materialCode.includes(normalizedSearch)
      return matchesZone && matchesSearch
    })
  }, [allMaterials, normalizedSearch, zoneFilter])

  useEffect(() => {
    if (!warehouseInfo?.sectionsByZone) return
    const summaries: Array<{ zone: string; total: number; occupied: number; free: number }> = []

    if (Array.isArray(warehouseInfo.sectionsByZone)) {
      warehouseInfo.sectionsByZone.forEach((entry: any) => {
        const zoneName = entry.zone
        const total = Array.isArray(entry.sections) ? entry.sections.length : 0
        const occupied = filteredMaterials.filter((material) => normalizeZoneKey(material.warehouseZone) === normalizeZoneKey(zoneName)).length
        summaries.push({ zone: formatZoneLabel(zoneName), total, occupied, free: Math.max(total - occupied, 0) })
      })
    } else {
      Object.entries(warehouseInfo.sectionsByZone).forEach(([zoneName, sections]) => {
        const sectionsArray = Array.isArray(sections) ? sections : []
        const total = sectionsArray.length
        const occupied = filteredMaterials.filter((material) => normalizeZoneKey(material.warehouseZone) === normalizeZoneKey(zoneName)).length
        summaries.push({ zone: formatZoneLabel(zoneName), total, occupied, free: Math.max(total - occupied, 0) })
      })
    }

    setZoneSummaries(summaries)
  }, [filteredMaterials, warehouseInfo?.sectionsByZone])

  const populateMarkers = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current.clear()

    filteredMaterials.forEach((material) => {
      const markerId = material.id ?? material.materialId
      const position = projectPoint(material.warehouseX, material.warehouseY)
      if (markerId == null || !position) return

      const markerKey = String(markerId)
      const isSelected = selectedMaterialId ? markerKey === selectedMaterialId : false
      const zoneColor = getZoneColor(material.warehouseZone as string | undefined)
      const icon = buildMarkerIcon(zoneColor, isSelected)

      const marker = L.marker(position, {
        icon,
        riseOnHover: true,
      })

      marker.setZIndexOffset(isSelected ? 1400 : 0)

      const materialZone = material.warehouseZone || 'Sin zona'
      const materialSection = material.warehouseSection ?? '—'
      const materialLevel = material.warehouseLevel ?? '—'
      const currentStock = material.stock ?? material.currentStock ?? '—'
      const reservedStock = material.reservedStock ?? '—'

      const tooltipHtml = `
        <div class="warehouse-tooltip-content">
          <strong>${material.name ?? material.materialName ?? 'Material'}</strong>
          <div>${materialZone} · ${materialSection} · Nivel ${materialLevel}</div>
          <div>Stock ${currentStock} | Reservado ${reservedStock}</div>
        </div>
      `

      marker
        .on('add', () => {
          const element = marker.getElement()
          if (element) {
            element.classList.add('warehouse-marker--interactive')
          }
        })
        .on('mouseover', () => {
          marker.setZIndexOffset(2000)
          const element = marker.getElement()
          if (element) {
            element.classList.add('warehouse-marker--hover')
          }
        })
        .on('mouseout', () => {
          const element = marker.getElement()
          if (element) {
            element.classList.remove('warehouse-marker--hover')
          }
          const shouldStayRaised = selectedMarkerIdRef.current === markerKey
          marker.setZIndexOffset(shouldStayRaised ? 1600 : 0)
        })
        .on('click', () => {
          onSelectMaterial?.(markerKey)
          const element = marker.getElement()
          if (element) {
            element.classList.add('warehouse-marker--pop')
            setTimeout(() => {
              element.classList.remove('warehouse-marker--pop')
            }, 220)
          }
          marker.setZIndexOffset(1600)
        })
        .bindTooltip(tooltipHtml, {
          direction: 'top',
          sticky: true,
          opacity: 0.95,
          className: 'warehouse-tooltip',
          offset: L.point(0, -8),
        })
        .addTo(map)

      markersRef.current.set(markerKey, { marker, material })
    })
  }, [filteredMaterials, onSelectMaterial, selectedMaterialId])

  const updateMarkerIcons = useCallback(() => {
    const map = mapRef.current
    if (!map || markersRef.current.size === 0) return
    markersRef.current.forEach(({ marker, material }, key) => {
      const zoneColor = getZoneColor(material.warehouseZone as string | undefined)
      const isSelected = selectedMaterialId ? key === selectedMaterialId : false
      marker.setIcon(buildMarkerIcon(zoneColor, isSelected))
      marker.setZIndexOffset(isSelected ? 1600 : 0)
    })
  }, [selectedMaterialId])

  useEffect(() => {
    if (!isOpen) return
    populateMarkers()
    updateMarkerIcons()
  }, [isOpen, populateMarkers, updateMarkerIcons])

  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      const map = mapRef.current
      if (map) {
        map.invalidateSize()
        populateMarkers()
        updateMarkerIcons()
      }
    }, 120)
    return () => clearTimeout(timer)
  }, [isOpen, populateMarkers, layoutSvg, updateMarkerIcons])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.on('zoomend', updateMarkerIcons)
    return () => {
      map.off('zoomend', updateMarkerIcons)
    }
  }, [updateMarkerIcons])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedMaterialId) return

    const selected = filteredMaterials.find((material) => String(material.id ?? material.materialId) === selectedMaterialId)
    if (selected) {
      const point = projectPoint(selected.warehouseX, selected.warehouseY)
      if (point) {
        map.flyTo(point, Math.max(map.getZoom(), 0), {
          animate: true,
          duration: 0.6,
        })
      }
    }
  }, [filteredMaterials, selectedMaterialId])

  const legendOptions = useMemo(() => zoneOptions, [zoneOptions])

  const selectedZoneSummary = useMemo(() => {
    if (zoneSummaries.length === 0) {
      return null
    }
    const matching = zoneSummaries.find(
      (summary) => normalizeZoneKey(summary.zone) === normalizeZoneKey(zoneFilter)
    )

    if (matching) {
      return {
        label: matching.zone,
        total: matching.total,
        occupied: matching.occupied,
        free: matching.free,
      }
    }

    return null
  }, [zoneFilter, zoneSummaries])

  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const map = mapRef.current
    if (!map) return
    direction === 'in' ? map.zoomIn() : map.zoomOut()
  }, [])

  const handleFitToView = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    map.flyToBounds(warehouseBounds, {
      maxZoom: INITIAL_ZOOM + 0.5,
      duration: 0.35,
      easeLinearity: 0.18,
    })
  }, [])

  const containerClasses = cn(
    'relative w-full transition-all duration-300 ease-in-out',
    isOpen ? 'lg:w-[520px]' : 'lg:w-14'
  )

  return (
    <div className={containerClasses}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'hidden lg:flex absolute -left-3 top-4 z-30 size-8 items-center justify-center rounded-full border border-primary-200 bg-white text-primary-600 shadow-md transition hover:bg-primary-50',
          !isOpen && 'text-primary-700'
        )}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Ocultar mapa del almacén' : 'Mostrar mapa del almacén'}
      >
        {isOpen ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
      </button>

      <div
        className={cn(
          'card border-2 border-primary-600 overflow-hidden transition-all duration-300',
          isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'lg:translate-x-full lg:opacity-0 lg:pointer-events-none'
        )}
      >
        <div className="flex flex-col gap-4 px-4 py-4 border-b border-stroke bg-primary-50/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3 sm:items-center">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-primary-800 md:text-lg">
                <MapPinned className="size-5 text-primary-600" />
                Mapa del almacén
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border border-stroke bg-background hover:bg-primary-50/70"
              onClick={() => {
                loadLayout()
                loadMaterials()
              }}
              disabled={isRefreshing}
            >
              <RefreshCcw className="size-4 mr-1.5" />
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="p-4 space-y-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Select value={zoneFilter} onValueChange={(value) => setZoneFilter(value)}>
                  <SelectTrigger className="w-[112px] border border-stroke bg-background text-sm text-primary-600 focus:ring-2 focus:ring-primary-300 focus:border-primary-600">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Todas</SelectItem>
                    {zoneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative w-[140px] sm:w-full sm:max-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary-600" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar"
                  className="w-full pl-10 pr-4 py-2 border border-stroke rounded-lg text-sm text-primary-900 placeholder:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600"
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border border-stroke bg-background transition-all hover:-translate-y-0.5 hover:bg-primary-50/70"
                  onClick={handleFitToView}
                  aria-label="Ajustar vista"
                >
                  <Crosshair className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border border-stroke bg-background transition-all hover:-translate-y-0.5 hover:bg-primary-50/70"
                  onClick={() => handleZoom('out')}
                  aria-label="Alejar"
                >
                  <ZoomOut className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border border-stroke bg-background transition-all hover:-translate-y-0.5 hover:bg-primary-50/70"
                  onClick={() => handleZoom('in')}
                  aria-label="Acercar"
                >
                  <ZoomIn className="size-4" />
                </Button>
              </div>
            </div>

            {selectedZoneSummary && (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary-100 bg-white/70 p-3 shadow-sm shadow-primary-900/5">
                <Badge className="bg-primary-100 text-primary-800">{selectedZoneSummary.label}</Badge>
                <Badge variant="outline" className="border-primary-100 bg-primary-50/60 text-primary-700">
                  Capacidad {selectedZoneSummary.total}
                </Badge>
                <Badge variant="outline" className="border-primary-100 bg-orange-50/80 text-orange-700">
                  Ocupado {selectedZoneSummary.occupied}
                </Badge>
                <Badge variant="outline" className="border-primary-100 bg-emerald-50/80 text-emerald-700">
                  Libre {selectedZoneSummary.free}
                </Badge>
              </div>
            )}

            <div className="warehouse-map-container relative h-[260px] w-full overflow-hidden rounded-2xl border border-primary-100 bg-surface shadow-md md:h-[360px]">
              <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_20%_25%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(30,64,175,0.12),transparent_60%)]" />
              <div ref={mapContainerRef} className="absolute inset-0 z-[1] overflow-hidden rounded-[inherit]" />

              {(loadingLayout || loadingMaterials) && (
                <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-secondary/80 backdrop-blur-sm">
                  <LoadingSpinner />
                  <p className="text-sm text-primary-600">Sincronizando mapa del almacén…</p>
                </div>
              )}
            </div>

            <div className="hidden md:flex md:flex-wrap md:items-center md:gap-2">
              {legendOptions.map((option) => (
                <span
                  key={option.value}
                  className="warehouse-marker warehouse-marker--legend"
                  style={{
                    '--marker-color': option.color,
                    '--marker-bg': hexToRgba(option.color, 0.18),
                    '--marker-border': hexToRgba(option.color, 0.38),
                    '--marker-ring': hexToRgba(option.color, 0.22),
                    '--marker-shadow': hexToRgba(option.color, 0.2),
                    '--marker-text': '#0f172a',
                  } as CSSProperties}
                >
                  <span className="warehouse-marker__dot" />
                  <span className="warehouse-marker__label">{option.label}</span>
                </span>
              ))}
            </div>

            {zoneSummaries.length > 0 && (
              <div className="hidden gap-3 md:grid md:grid-cols-2">
                {zoneSummaries.map((summary) => (
                  <div key={summary.zone} className="flex flex-col rounded-xl border border-primary-100 bg-primary-50/30 p-4 shadow-sm">
                    <span className="text-sm font-semibold text-primary-800">{summary.zone}</span>
                    <div className="mt-2 flex justify-between text-xs text-primary-700">
                      <span>Total</span>
                      <span className="font-semibold">{summary.total}</span>
                    </div>
                    <div className="flex justify-between text-xs text-primary-700">
                      <span>Ocupado</span>
                      <span className="font-semibold text-orange-600">{summary.occupied}</span>
                    </div>
                    <div className="flex justify-between text-xs text-primary-700">
                      <span>Libre</span>
                      <span className="font-semibold text-green-600">{summary.free}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
