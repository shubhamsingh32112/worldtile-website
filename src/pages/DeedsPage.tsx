import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService, type UserLand } from '../services/userService'
import GlassCard from '../components/GlassCard'
import ErrorState from '../components/ErrorState'
import LoadingSpinner from '../components/LoadingSpinner'
import { Mountain, MapPin, Calendar, Wallet, RefreshCw } from 'lucide-react'

export default function DeedsPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [lands, setLands] = useState<UserLand[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    loadUserLands()
  }, [])

  const loadUserLands = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await userService.getUserLands()
      if (result.success && result.lands) {
        setLands(result.lands)
      } else {
        setErrorMessage(result.message || 'Failed to load lands')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error loading lands')
    } finally {
      setIsLoading(false)
    }
  }

  const formatUSDT = (amount: string): string => {
    try {
      const value = parseFloat(amount)
      return value.toFixed(2)
    } catch {
      return '0.00'
    }
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateString
    }
  }

  const getStateName = (land: UserLand): string => {
    if (land.stateName && land.stateName.length > 0) {
      return land.stateName
    }
    const stateKey = land.stateKey || ''
    if (stateKey.length === 0) return stateKey
    return stateKey[0].toUpperCase() + stateKey.substring(1).replace(/_/g, ' ')
  }

  const getAreaName = (land: UserLand): string => {
    if (land.areaName && land.areaName.length > 0) {
      return land.areaName
    }
    const areaKey = land.areaKey || ''
    if (areaKey.length === 0) return areaKey
    return areaKey[0].toUpperCase() + areaKey.substring(1).replace(/_/g, ' ')
  }

  const handleViewDeed = (landSlotId: string) => {
    navigate(`/deed/${landSlotId}`)
  }

  if (isLoading) {
    return (
      <div className="py-8 px-4 md:px-6">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="py-8 px-4 md:px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-2xl font-bold text-white">Your Deeds</h1>
        {!isLoading && (
          <button
            onClick={loadUserLands}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-semibold">Refresh</span>
          </button>
        )}
      </div>

      {/* Content */}
      {errorMessage ? (
        <ErrorState message={errorMessage} onRetry={loadUserLands} />
      ) : lands.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Mountain className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-400 mb-2">No lands owned yet</h2>
          <p className="text-gray-500 text-center">Purchases will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 px-4">
          {lands.map((land) => (
            <GlassCard
              key={land.landSlotId}
              padding="p-4"
              onClick={() => handleViewDeed(land.landSlotId)}
            >
              {/* Land Slot ID */}
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-blue-500" />
                <span className="text-white font-bold">{land.landSlotId}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {getStateName(land)}, {getAreaName(land)}
                </span>
              </div>

              {/* Purchase details */}
              <div className="flex justify-between items-center">
                {/* Purchase date */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-400">{formatDate(land.purchasedAt)}</span>
                </div>

                {/* Purchase price */}
                <div className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-bold text-green-400">
                    {formatUSDT(land.purchasePriceUSDT)} USDT
                  </span>
                </div>
              </div>

              {/* View Deed button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleViewDeed(land.landSlotId)
                }}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                View Deed
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
