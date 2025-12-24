import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { geoContains } from 'd3-geo'
import gsap from 'gsap'

const RADIUS = 2
const POINT_COUNT = 18000 // temporarily reduced for debugging
const MIN_POINTS_PER_POLYGON = 12

function CameraDollyIntro({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree()

  useEffect(() => {
    // ---- INDIA GEO ANCHOR ----
    const INDIA_LAT = 20.5937
    const INDIA_LNG = 78.9629

    // ---- Distances ----
    const startDistance = RADIUS * 1.6   // very close to surface
    const endDistance = isMobile ? 12 : 7 // full globe view

    // ---- START POSITION (zoomed into India) ----
    const startPos = latLngToCameraPosition(
      INDIA_LAT,
      INDIA_LNG,
      startDistance
    )

    // ---- END POSITION (global view) ----
    const endPos = latLngToCameraPosition(
      INDIA_LAT,
      INDIA_LNG,
      endDistance
    )

    camera.position.copy(startPos)
    if ('fov' in camera) {
      camera.fov = 42
    }
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    // ---- CINEMATIC DOLLY OUT ----
    gsap.to(camera.position, {
      x: endPos.x,
      y: endPos.y,
      z: endPos.z,
      duration: 3.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.lookAt(0, 0, 0)
      },
    })

    // ---- SUBTLE FOV OPENING ----
    if ('fov' in camera) {
      gsap.to(camera, {
        fov: isMobile ? 48 : 45,
        duration: 2.6,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      })
    }
  }, [camera, isMobile])

  return null
}

function latLngToVec3(lat: number, lng: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -RADIUS * Math.sin(phi) * Math.cos(theta),
     RADIUS * Math.cos(phi),
     RADIUS * Math.sin(phi) * Math.sin(theta)
  )
}

function latLngToCameraPosition(
  lat: number,
  lng: number,
  distance: number
) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -distance * Math.sin(phi) * Math.cos(theta),
     distance * Math.cos(phi),
     distance * Math.sin(phi) * Math.sin(theta)
  )
}

function getBBox(feature: any) {
  let minLat = 90
  let maxLat = -90
  let minLon = 180
  let maxLon = -180

  const walk = (coords: any) => {
    if (typeof coords[0] === 'number') {
      const [lon, lat] = coords
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
    } else {
      coords.forEach(walk)
    }
  }

  walk(feature.geometry.coordinates)

  return { minLat, maxLat, minLon, maxLon }
}

function polygonArea(feature: any): number {
  let area = 0

  const walk = (coords: any) => {
    if (typeof coords[0] === 'number') return
    if (typeof coords[0][0] === 'number') {
      // ring
      area += Math.abs(
        coords.reduce((sum: number, [x1, y1]: number[], i: number) => {
          const [x2, y2] = coords[(i + 1) % coords.length]
          return sum + (x1 * y2 - x2 * y1)
        }, 0)
      )
    } else {
      coords.forEach(walk)
    }
  }

  walk(feature.geometry.coordinates)
  return area
}

function GlobeBase({ isMobile }: { isMobile: boolean }) {
  const positionY = isMobile ? -0.45 : -0.35

  return (
    <mesh position={[0, positionY, 0]}>
      <sphereGeometry args={[RADIUS * 0.995, 64, 64]} />
      <meshBasicMaterial
        color="#2a2a2a"
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  )
}

function GlobePoints({
  features,
  scale = 1,
  isMobile,
}: {
  features: any[]
  scale?: number
  isMobile: boolean
}) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    console.log(features.length)
    
    const land = features
      .filter(f => f.properties?.NAME !== 'Antarctica')
      .map(feature => ({
        feature,
        bbox: getBBox(feature)
      }))
    
    console.log('Land features:', land.length)

    const pts: number[] = []

    const totalArea = land.reduce((sum, l) => sum + polygonArea(l.feature), 0)

    land.forEach(({ feature }) => {
      const geometry = feature.geometry

      const polygons =
        geometry.type === 'Polygon'
          ? [geometry.coordinates]
          : geometry.coordinates

      polygons.forEach((rings: number[][][]) => {
        // Use outer ring only for sampling
        const outerRing = rings[0]
        if (!outerRing || outerRing.length < 3) return

        // Compute bbox for THIS polygon
        let minLat = 90, maxLat = -90, minLon = 180, maxLon = -180
        outerRing.forEach(([lng, lat]) => {
          minLat = Math.min(minLat, lat)
          maxLat = Math.max(maxLat, lat)
          minLon = Math.min(minLon, lng)
          maxLon = Math.max(maxLon, lng)
        })

        const polyArea = Math.abs(
          outerRing.reduce((sum, [x1, y1], i) => {
            const [x2, y2] = outerRing[(i + 1) % outerRing.length]
            return sum + (x1 * y2 - x2 * y1)
          }, 0)
        )

        let targetPoints = Math.floor((polyArea / totalArea) * POINT_COUNT)
        targetPoints = Math.max(MIN_POINTS_PER_POLYGON, targetPoints)

        let added = 0
        let safety = 0

        while (added < targetPoints && safety < targetPoints * 80) {
          safety++

          const lat = minLat + Math.random() * (maxLat - minLat)
          const lng = minLon + Math.random() * (maxLon - minLon)

          if (!geoContains(feature, [lng, lat])) continue

          const v = latLngToVec3(lat, lng)
          pts.push(v.x, v.y, v.z)
          added++
        }
      })
    })

    console.log('Generated points:', pts.length / 3)

    return new Float32Array(pts)
  }, [features])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0025
    }
  })

  useEffect(() => {
    // Optional Google-level polish: Delay point visibility slightly
    if (ref.current && ref.current.material) {
      const material = ref.current.material as THREE.PointsMaterial
      material.opacity = 0
      gsap.to(material, {
        opacity: 0.88,
        duration: 1.8,
        delay: 0.6,
      })
    }
  }, [])

  const positionY = isMobile ? -0.45 : -0.35

  return (
    <points ref={ref} scale={scale} position={[0, positionY, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="BDBBBB"
        size={isMobile ? 0.032 : 0.036}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  )
}

export default function LandPointGlobe() {
  const [features, setFeatures] = useState<any[] | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    fetch('/data/countries.json')
      .then(r => r.json())
      .then(d => setFeatures(d.features))
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!features) return null

  return (
    <Canvas
      camera={{
        position: [0, 0, isMobile ? 12 : 7], // final resting value
        fov: isMobile ? 50 : 45,
      }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      style={{ background: 'transparent' }}
    >
      <CameraDollyIntro isMobile={isMobile} />

      <ambientLight intensity={0.6} />
      <GlobeBase isMobile={isMobile} />
      <GlobePoints features={features} scale={1} isMobile={isMobile} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  )
}

