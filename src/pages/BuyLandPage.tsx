import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Globe } from 'lucide-react'
import StateAreasBottomSheet from '../components/StateAreasBottomSheet'

// India coordinates for zoom
const INDIA_CENTER: [number, number] = [78.9629, 22.5937]
const INDIA_ZOOM = 3.4
const MAX_ZOOM = 4.0
const INITIAL_ZOOM = 0.0
const INITIAL_CENTER: [number, number] = [0, 0]

// Mapbox style URL (same as Flutter)
const MAPBOX_STYLE = 'mapbox://styles/arhaan21/cmj4vqiqa002901s6eb5bd9k0'

export default function BuyLandPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [showViewOpenStates, setShowViewOpenStates] = useState(true)
  const [hasClickedViewOpenStates, setHasClickedViewOpenStates] = useState(false)
  const [selectedStateKey, setSelectedStateKey] = useState<string | null>(null)
  const [showStateAreas, setShowStateAreas] = useState(false)
  const openStatesGeoJson = useRef<any>(null)

  useEffect(() => {
    // Reset state on mount
    setIsMapReady(false)
    openStatesGeoJson.current = null

    if (!mapContainer.current) return

    const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || import.meta.env.MAPBOX_PUBLIC_TOKEN

    if (!mapboxToken) {
      console.error('Mapbox token not found in environment variables')
      setIsMapReady(true) // Set ready even without token to prevent infinite loading
      return
    }

    // Load open states GeoJSON
    const loadGeoJson = async () => {
      try {
        const response = await fetch('/open_states_level1.json')
        const data = await response.json()
        openStatesGeoJson.current = data
      } catch (error) {
        console.error('Failed to load open states GeoJSON:', error)
      }
    }

    // Initialize map
    mapboxgl.accessToken = mapboxToken

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_STYLE,
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      maxZoom: MAX_ZOOM,
      minZoom: 0,
    })

    const currentMap = map.current
    let isMapReadySet = false
    let timeoutId: NodeJS.Timeout | null = null

    // Function to handle map ready state
    const handleMapReady = () => {
      if (isMapReadySet) return
      isMapReadySet = true
      
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      
      if (openStatesGeoJson.current) {
        addWorldLockLayer(currentMap)
        addOpenStatesOutlineLayer(currentMap)
      }
      setIsMapReady(true)
    }

    // Check if style is already loaded (for cached styles)
    const checkStyleLoaded = () => {
      try {
        if (currentMap.isStyleLoaded()) {
          applyCustomFog(currentMap)
          addWorldLockLayer(currentMap)
          addOpenStatesOutlineLayer(currentMap)
          handleMapReady()
          return true
        }
      } catch (error) {
        console.error('Error checking style load:', error)
      }
      return false
    }

    // Set up style.load event listener
    const styleLoadHandler = () => {
      applyCustomFog(currentMap)
      addWorldLockLayer(currentMap)
      addOpenStatesOutlineLayer(currentMap)
      handleMapReady()
    }
    currentMap.on('style.load', styleLoadHandler)

    // Also listen to 'load' event as fallback
    const loadHandler = () => {
      if (!isMapReadySet) {
        handleMapReady()
      }
    }
    currentMap.once('load', loadHandler)

    // Check immediately if style is already loaded (cached styles)
    // Use a small delay to allow map to initialize
    setTimeout(() => {
      if (!isMapReadySet && checkStyleLoaded()) {
        return // Already handled by checkStyleLoaded
      }
    }, 100)

    // Load GeoJSON and check if style is already loaded
    loadGeoJson().then(() => {
      // Check if style is already loaded (might be cached)
      if (!checkStyleLoaded()) {
        // If not loaded, add timeout fallback to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (!isMapReadySet) {
            console.warn('Map style load timeout, setting ready anyway')
            handleMapReady()
          }
        }, 10000) // 10 second timeout
      }
    }).catch((error) => {
      console.error('Error loading GeoJSON:', error)
      // Still try to set map ready even if GeoJSON fails
      if (!isMapReadySet) {
        if (!checkStyleLoaded()) {
          handleMapReady()
        }
      }
    })

    // Error handling for map load failures
    const errorHandler = (e: any) => {
      console.error('Map error:', e)
      if (!isMapReadySet) {
        // Set ready even on error to prevent infinite loading
        handleMapReady()
      }
    }
    currentMap.on('error', errorHandler)

    // Enforce max zoom and check if zoomed back to default view
    const zoomHandler = () => {
      if (currentMap.isMoving()) return
      
      const currentZoom = currentMap.getZoom()
      
      // Enforce max zoom
      if (currentZoom > MAX_ZOOM) {
        currentMap.setZoom(MAX_ZOOM)
        return
      }
      
      // Show "View Open States" button if zoomed back to default/initial view
      // Check if zoom is close to initial zoom (within 0.5) and center is close to initial center
      const zoomDiff = Math.abs(currentZoom - INITIAL_ZOOM)
      const center = currentMap.getCenter()
      const centerDiff = Math.abs(center.lng - INITIAL_CENTER[0]) + Math.abs(center.lat - INITIAL_CENTER[1])
      
      // If zoomed back to default view (within threshold), show the button again
      if (zoomDiff < 0.5 && centerDiff < 5) {
        setShowViewOpenStates(true)
        setHasClickedViewOpenStates(false) // Reset so button can be clicked again
      }
    }
    currentMap.on('zoom', zoomHandler)

    // Also check on moveend (when panning/zooming completes)
    const moveEndHandler = () => {
      if (currentMap.isMoving()) return
      
      if (hasClickedViewOpenStates) {
        const currentZoom = currentMap.getZoom()
        const zoomDiff = Math.abs(currentZoom - INITIAL_ZOOM)
        const center = currentMap.getCenter()
        const centerDiff = Math.abs(center.lng - INITIAL_CENTER[0]) + Math.abs(center.lat - INITIAL_CENTER[1])
        
        // If zoomed back to default view (within threshold), show the button again
        if (zoomDiff < 0.5 && centerDiff < 5) {
          setShowViewOpenStates(true)
          setHasClickedViewOpenStates(false) // Reset so button can be clicked again
        }
      }
    }
    currentMap.on('moveend', moveEndHandler)

    // Handle map clicks for state selection
    const clickHandler = (e: mapboxgl.MapMouseEvent) => {
      handleMapClick(e.lngLat.lng, e.lngLat.lat)
    }
    currentMap.on('click', clickHandler)

    // Listen for showStateAreas event from HomePage
    const handleShowStateAreas = (event: CustomEvent) => {
      const stateKey = event.detail?.stateKey
      if (stateKey) {
        setSelectedStateKey(stateKey)
        setShowStateAreas(true)
      }
    }
    window.addEventListener('showStateAreas', handleShowStateAreas as EventListener)

    // Check for selected state from sessionStorage (from HomePage city click)
    const storedStateKey = sessionStorage.getItem('selectedStateKey')
    if (storedStateKey) {
      setTimeout(() => {
        setSelectedStateKey(storedStateKey)
        setShowStateAreas(true)
        sessionStorage.removeItem('selectedStateKey')
      }, 500)
    }

    // Re-apply fog on tab visibility change (browsers suspend WebGL when tabs go inactive)
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible' && map.current) {
        applyCustomFog(map.current)
      }
    }
    document.addEventListener('visibilitychange', visibilityHandler)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler)
      window.removeEventListener('showStateAreas', handleShowStateAreas as EventListener)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (currentMap) {
        try {
          currentMap.off('style.load', styleLoadHandler)
          currentMap.off('load', loadHandler)
          currentMap.off('error', errorHandler)
          currentMap.off('zoom', zoomHandler)
          currentMap.off('moveend', moveEndHandler)
          currentMap.off('click', clickHandler)
          currentMap.remove()
        } catch (error) {
          console.error('Error removing map:', error)
        }
      }
      map.current = null
      setIsMapReady(false)
    }
  }, [])

  // Apply custom fog/atmosphere settings (idempotent - safe to call repeatedly)
  const applyCustomFog = (mapInstance: mapboxgl.Map) => {
    try {
      if (!mapInstance.isStyleLoaded()) return

      const fogConfig = {
        range: [0.8, 8.0],
        color: 'rgba(20, 20, 30, 0.85)',
        'high-color': 'rgba(10, 10, 20, 0.9)',
        'space-color': 'rgba(5, 5, 15, 1)',
        'horizon-blend': 0.15,
        'star-intensity': 0.35,
      } as any

      // Modern API
      if (typeof (mapInstance as any).setFog === 'function') {
        mapInstance.setFog(fogConfig)
        console.log('✨ Fog + stars applied (setFog)')
        return
      }

      // Legacy fallback
      const style = mapInstance.getStyle()
      if (style) {
        style.fog = fogConfig
        mapInstance.setStyle(style)
        console.log('✨ Fog + stars applied (style.fog)')
      }
    } catch (err) {
      console.error('⚠️ Fog apply failed:', err)
    }
  }

  // Build inverse GeoJSON (world bounds with open states as holes)
  const buildInverseGeoJson = (geoJson: any) => {
    if (!geoJson) return null
    const worldBounds: number[][] = [
      [-180.0, -85.0],
      [180.0, -85.0],
      [180.0, 85.0],
      [-180.0, 85.0],
      [-180.0, -85.0],
    ]

    const holes: number[][][] = []
    const features = geoJson.features || []

    for (const feature of features) {
      const geometry = feature.geometry
      if (!geometry) continue

      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates
        if (coordinates && coordinates[0]) {
          holes.push(coordinates[0])
        }
      } else if (geometry.type === 'MultiPolygon') {
        const coordinates = geometry.coordinates
        if (coordinates) {
          for (const polygon of coordinates) {
            if (polygon && polygon[0]) {
              holes.push(polygon[0])
            }
          }
        }
      }
    }

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [worldBounds, ...holes],
      },
    }
  }

  // Add world lock layer (gray fill for locked areas)
  const addWorldLockLayer = (mapInstance: mapboxgl.Map) => {
    if (!mapInstance.isStyleLoaded()) return
    if (!openStatesGeoJson.current) return

    const sourceId = 'world-lock-source'
    const layerId = 'world-lock-fill-layer'

    try {
      const inverseGeoJson = buildInverseGeoJson(openStatesGeoJson.current)
      if (!inverseGeoJson) return

      if (mapInstance.getSource(sourceId)) {
        ;(mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(inverseGeoJson as any)
      } else {
        mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: inverseGeoJson as any,
        })
      }

      if (!mapInstance.getLayer(layerId)) {
        mapInstance.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': 'rgba(160, 160, 160, 0.55)',
          },
        })
      }

      console.log('✅ Added world-lock fill layer')
    } catch (error) {
      console.error('❌ Error adding world-lock layer:', error)
    }
  }

  // Add open states outline layer
  const addOpenStatesOutlineLayer = (mapInstance: mapboxgl.Map) => {
    if (!mapInstance.isStyleLoaded()) return
    if (!openStatesGeoJson.current) return

    const sourceId = 'open-states-source'
    const fillLayerId = 'open-states-fill-layer'
    const lineLayerId = 'open-states-outline-layer'

    try {
      if (mapInstance.getSource(sourceId)) {
        ;(mapInstance.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(openStatesGeoJson.current)
      } else {
        mapInstance.addSource(sourceId, {
          type: 'geojson',
          data: openStatesGeoJson.current,
        })
      }

      if (!mapInstance.getLayer(fillLayerId)) {
        mapInstance.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': 'rgba(0, 0, 0, 0)',
            'fill-opacity': 0,
          },
        })
      }

      if (!mapInstance.getLayer(lineLayerId)) {
        mapInstance.addLayer({
          id: lineLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': '#000000',
            'line-width': 1,
          },
        })
      }

      console.log('✅ Added open states outline layer')
    } catch (error) {
      console.error('❌ Error adding open states outline:', error)
    }
  }

  // Extract state key from feature properties
  const extractStateKey = (properties: any): string | null => {
    return properties?.stateKey || properties?.NAME_1 || null
  }

  // Handle map click - check if clicked on a state
  const handleMapClick = (lng: number, lat: number) => {
    if (!openStatesGeoJson.current) return
    const features = openStatesGeoJson.current.features || []

    for (const feature of features) {
      if (isPointInPolygon(lng, lat, feature.geometry)) {
        const stateKey = extractStateKey(feature.properties)
        if (stateKey) {
          console.log('🗺️ State polygon tapped:', stateKey)
          setSelectedStateKey(stateKey)
          setShowStateAreas(true)
          return
        }
      }
    }
  }

  // Point-in-polygon check
  const isPointInPolygon = (lng: number, lat: number, geometry: any): boolean => {
    if (!geometry || !geometry.coordinates) return false

    if (geometry.type === 'Polygon') {
      const coordinates = geometry.coordinates
      if (coordinates && coordinates[0]) {
        return pointInRing(lng, lat, coordinates[0])
      }
    } else if (geometry.type === 'MultiPolygon') {
      const coordinates = geometry.coordinates
      if (coordinates) {
        for (const polygon of coordinates) {
          if (polygon && polygon[0] && pointInRing(lng, lat, polygon[0])) {
            return true
          }
        }
      }
    }

    return false
  }

  // Ray casting algorithm
  const pointInRing = (lng: number, lat: number, ring: number[][]): boolean => {
    let inside = false
    let j = ring.length - 1

    for (let i = 0; i < ring.length; i++) {
      const xi = ring[i][0]
      const yi = ring[i][1]
      const xj = ring[j][0]
      const yj = ring[j][1]

      const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

      if (intersect) {
        inside = !inside
      }
      j = i
    }

    return inside
  }

  // Handle "View Open States" button click
  const handleViewOpenStates = () => {
    if (hasClickedViewOpenStates || !map.current) return

    setHasClickedViewOpenStates(true)
    setShowViewOpenStates(false)

    // Zoom to India
    map.current.flyTo({
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      duration: 1350,
    })
  }

  return (
    <>
      <div
        className="absolute left-0 right-0 w-screen"
        style={{
          height: 'calc(100vh - 64px)',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
        }}
      >
        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Loading overlay */}
        {!isMapReady && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading world map...</p>
            </div>
          </div>
        )}

        {/* "View Open States" floating button */}
        {showViewOpenStates && isMapReady && (
          <button
            onClick={handleViewOpenStates}
            className="absolute bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-3 bg-white/12 backdrop-blur-md rounded-full text-white font-semibold text-sm shadow-lg hover:bg-white/20 transition-all"
            style={{
              backdropFilter: 'blur(20px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <Globe className="w-4 h-4" />
            <span>View Open States</span>
          </button>
        )}
      </div>

      {/* State Areas Bottom Sheet */}
      {showStateAreas && selectedStateKey && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div
            className="absolute inset-0 bg-black/50 pointer-events-auto"
            onClick={() => setShowStateAreas(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
            <StateAreasBottomSheet
              stateKey={selectedStateKey}
              onClose={() => setShowStateAreas(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
