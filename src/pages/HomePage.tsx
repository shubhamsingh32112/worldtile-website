import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userService, type UserStats } from '../services/userService'
import GlassCard from '../components/GlassCard'
import CityCard from '../components/CityCard'
import SectionDivider from '../components/SectionDivider'
import ErrorState from '../components/ErrorState'
import LoadingSpinner from '../components/LoadingSpinner'
import { Map, Lock } from 'lucide-react'

interface City {
  name: string
  change: string
  price: string
  isPositive: boolean
  imagePath?: string
  stateKey: string
}

const getCityImagePath = (cityName: string): string => {
  const name = cityName.toLowerCase()
  switch (name) {
    case 'bangalore':
      return '/images/banaglore.jpeg'
    case 'pune':
      return '/images/pune.jpeg'
    case 'jaipur':
      return '/images/jaipur.jpeg'
    default:
      return ''
  }
}

const TOP_CITIES: City[] = [
  { name: 'Bangalore', change: '+12.5%', price: '110 USDT', isPositive: true, stateKey: 'karnataka', imagePath: getCityImagePath('Bangalore') },
  { name: 'Pune', change: '+8.3%', price: '110 USDT', isPositive: true, stateKey: 'maharashtra', imagePath: getCityImagePath('Pune') },
  { name: 'Jaipur', change: '+7%', price: '110 USDT', isPositive: true, stateKey: 'rajasthan', imagePath: getCityImagePath('Jaipur') },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await userService.getUserStats()
      if (result.success && result.stats) {
        setUserStats(result.stats)
      } else {
        setErrorMessage(result.message || 'Failed to load stats')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error loading stats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCityCardTap = (city: City) => {
    // Navigate to Buy Land page
    navigate('/buy-land')
    
    // Store state key in sessionStorage for the map to use
    sessionStorage.setItem('selectedStateKey', city.stateKey)
    
    // Small delay to let the map load, then trigger state selection
    setTimeout(() => {
      // The BuyLandPage will check for this and show the areas
      window.dispatchEvent(new CustomEvent('showStateAreas', { detail: { stateKey: city.stateKey } }))
    }, 500)
  }

  const handleBuyLandClick = () => {
    navigate('/buy-land')
  }

  const handleInviteFriendsClick = () => {
    navigate('/earn')
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
      {/* Hero Section */}
      <div className="mx-5 mb-4">
        <GlassCard padding="p-4" backgroundColor="bg-white/2">
          <div className="flex items-center gap-3">
            {/* Left - Text */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-1.5 leading-tight">
                Build & Trade in<br />the Metaverse
              </h2>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Invest in virtual properties and earn USDT rewards
              </p>
              <button
                onClick={handleBuyLandClick}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors"
              >
                Buy Land
              </button>
            </div>
            
            {/* Right - Hero Image */}
            <div className="flex-shrink-0 w-32 h-32 rounded-2xl overflow-hidden">
              <img
                src="/images/herosection.png"
                alt="Metaverse"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to gradient if image fails
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.className += ' bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                  }
                }}
              />
            </div>
          </div>
        </GlassCard>
      </div>

      <SectionDivider />

      {/* Top Cities Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white px-5 mb-4">Top Cities</h2>
        <div className="overflow-x-auto px-5">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {TOP_CITIES.map((city) => (
              <CityCard
                key={city.name}
                name={city.name}
                change={city.change}
                price={city.price}
                isPositive={city.isPositive}
                imagePath={city.imagePath}
                onClick={() => handleCityCardTap(city)}
              />
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Markets to Invest In */}
      <div className="px-5 mb-4">
        <GlassCard padding="p-6" backgroundColor="bg-white/3 opacity-75">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-xl font-bold text-white">Markets to Invest In</h2>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Grid/Map visual */}
          <div className="h-[200px] rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/15 relative overflow-hidden">
            {/* Grid pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }} />
            
            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Lock className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      <SectionDivider />

      {/* Rewards/Referral Strip */}
      <div className="px-5 mb-4">
        <GlassCard padding="p-5" backgroundColor="bg-blue-500/6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                Earn flat 25% incentive per user
              </h3>
              <p className="text-sm text-gray-400">Invite friends and earn</p>
            </div>
            <button
              onClick={handleInviteFriendsClick}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Invite Friends
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Stats Section (if user has data) */}
      {!errorMessage && userStats && userStats.landsOwned > 0 && (
        <>
          <SectionDivider />
          <div className="px-5">
            <GlassCard padding="p-6" backgroundColor="bg-white/3">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Map className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">Lands Owned</p>
                  <p className="text-3xl font-bold text-blue-500">{userStats.landsOwned}</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="px-5">
          <ErrorState message={errorMessage} onRetry={loadUserStats} />
        </div>
      )}
    </div>
  )
}
