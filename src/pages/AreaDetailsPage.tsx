import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { areaService, type Area } from '../services/areaService'
import { orderService } from '../services/orderService'
import { useToast } from '../context/ToastContext'
import GlassCard from '../components/GlassCard'
import ErrorState from '../components/ErrorState'
import LoadingSpinner from '../components/LoadingSpinner'
import { CheckCircle, Minus, Plus, ArrowLeft } from 'lucide-react'

export default function AreaDetailsPage() {
  const { areaKey } = useParams<{ areaKey: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [area, setArea] = useState<Area | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    if (areaKey) {
      loadAreaDetails()
    }
  }, [areaKey])

  const loadAreaDetails = async () => {
    if (!areaKey) return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await areaService.getAreaDetails(areaKey)
      if (result.success && result.area) {
        setArea(result.area)
      } else {
        setErrorMessage(result.message || 'Failed to load area details')
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Error loading area details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleBuyTile = async () => {
    if (!area || !areaKey) return

    // Check authentication
    const token = localStorage.getItem('token')
    if (!token) {
      toast.warning('Please login to purchase tiles')
      navigate('/login')
      return
    }

    if (quantity < 1) {
      toast.warning('Please select at least 1 tile')
      return
    }

    setIsPurchasing(true)

    try {
      // Create order - backend will atomically assign slots
      // This prevents race conditions when multiple users click simultaneously
      const orderResult = await orderService.createOrder({
        state: area.stateKey,
        place: areaKey,
        quantity,
      })

      if (!orderResult.success || !orderResult.orderId) {
        // Handle 409 Conflict - slots became unavailable
        if (orderResult.status === 409) {
          const available = orderResult.meta?.available ?? 0
          
          if (available > 0) {
            // Auto-correct quantity to available slots
            toast.warning(`Only ${available} slot(s) remain here.`, 4000)
            setQuantity(available)
          } else {
            toast.warning(orderResult.message || 'No slots available')
          }
          
          // Refresh area details to show updated availability
          await loadAreaDetails()
          return
        }
        
        toast.error(orderResult.message || 'Failed to create order')
        return
      }

      // Navigate to payment page
      navigate(`/payment/${orderResult.orderId}`, {
        state: {
          amount: orderResult.amount,
          address: orderResult.address,
          network: orderResult.network,
          state: area.stateName,
          place: area.areaName,
          landSlotIds: orderResult.assignedSlots || [], // Use slots assigned by backend
          quantity,
          expiresAt: orderResult.expiresAt, // Pass expiry timestamp for countdown
        },
      })
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setIsPurchasing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-8 px-4 md:px-6">
        <LoadingSpinner />
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message={errorMessage} onRetry={loadAreaDetails} />
      </div>
    )
  }

  if (!area) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message="Area not found" />
      </div>
    )
  }

  const totalPrice = (area.priceUSDT || 110) * quantity

  return (
 <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-4 px-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="space-y-5 px-4">
        {/* Area Name */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{area.areaName}</h1>
          <p className="text-lg text-gray-400">{area.stateName}</p>
        </div>

        {/* Price Card */}
        <GlassCard padding="p-5">
          <div>
            <p className="text-gray-400 text-sm mb-1">Price</p>
            <p className="text-2xl font-bold text-blue-500">{area.priceUSDT || 110} USDT</p>
          </div>
        </GlassCard>

        {/* Highlights Section */}
        {area.highlights && area.highlights.length > 0 && (
          <>
            <h2 className="text-xl font-bold text-white">Highlights</h2>
            <div className="space-y-2">
              {area.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">{highlight}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quantity Selector */}
        <GlassCard padding="p-4">
          <p className="text-white font-bold mb-3">Quantity</p>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || isPurchasing}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-6 h-6 text-blue-500" />
            </button>
            <span className="text-2xl font-bold text-white flex-1 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isPurchasing}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6 text-blue-500" />
            </button>
          </div>

          {/* Total price */}
          <div className="flex justify-between items-center pt-3 border-t border-white/10">
            <span className="text-gray-400">Total Price</span>
            <span className="text-xl font-bold text-blue-500">{totalPrice} USDT</span>
          </div>
        </GlassCard>

        {/* Buy Tile Button */}
        <button
          onClick={handleBuyTile}
          disabled={isPurchasing}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
        >
          {isPurchasing ? (
            'Processing...'
          ) : quantity > 1 ? (
            `Buy ${quantity} Tiles`
          ) : (
            'Buy Tile'
          )}
        </button>
      </div>
    </div>
  )
}

