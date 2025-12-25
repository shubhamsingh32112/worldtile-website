import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { areaService, type Area } from '../services/areaService'
import GlassCard from './GlassCard'
import ErrorState from './ErrorState'
import LoadingSpinner from './LoadingSpinner'
import { X, MapPin } from 'lucide-react'

interface StateAreasBottomSheetProps {
  stateKey: string
  onClose?: () => void
}

export default function StateAreasBottomSheet({ stateKey, onClose }: StateAreasBottomSheetProps) {
  const navigate = useNavigate()
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    loadAreas()
  }, [stateKey])

  const loadAreas = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await areaService.getAreasForState(stateKey)
      if (result.success && result.areas) {
        setAreas(result.areas)
      } else {
        setErrorMessage(result.message || 'Failed to load areas')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error loading areas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAreaClick = (areaKey: string) => {
    navigate(`/area/${areaKey}`)
    if (onClose) onClose()
  }

  const formatStateKey = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gray-900/95 backdrop-blur-md rounded-t-3xl border-t border-white/20 z-50 max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">
          Areas in {formatStateKey(stateKey)}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="py-8">
            <LoadingSpinner />
          </div>
        ) : errorMessage ? (
          <ErrorState message={errorMessage} onRetry={loadAreas} />
        ) : areas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No areas available for this state</p>
          </div>
        ) : (
          <div className="space-y-3">
            {areas.map((area) => (
              <GlassCard
                key={area.areaKey}
                padding="p-4"
                onClick={() => handleAreaClick(area.areaKey)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-bold text-white">{area.areaName}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{area.stateName}</p>
                    
                    {/* Available slots indicator */}
                    <div className="flex items-center gap-4">
                      <div>
                        <span className={`text-sm font-bold ${
                          area.remainingSlots < 10 ? 'text-orange-400' : 'text-green-400'
                        }`}>
                          {area.remainingSlots > 0 ? 'Slots available' : 'No slots available'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-400">Price: </span>
                        <span className="text-sm font-bold text-blue-400">
                          {area.priceUSDT || 110} USDT per tile
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="text-gray-400">
                    →
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

