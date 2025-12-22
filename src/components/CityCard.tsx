import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CityCardProps {
  name: string
  change: string
  price: string
  isPositive: boolean
  imagePath?: string
  onClick?: () => void
}

export default function CityCard({
  name,
  change,
  price,
  isPositive,
  imagePath,
  onClick,
}: CityCardProps) {
  const [imageError, setImageError] = useState(false)
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  const trendColor = isPositive ? 'text-green-400' : 'text-red-400'
  const trendBgColor = isPositive ? 'bg-green-500/20' : 'bg-red-500/20'

  return (
    <div
      className="relative w-[280px] h-[200px] rounded-2xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Background Image or Gradient Fallback */}
      {imagePath && !imageError ? (
        <img
          src={imagePath}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-5 left-5 right-5 text-white">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        
        {/* Change badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${trendBgColor} mb-3`}>
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
          <span className={`text-xs font-bold ${trendColor}`}>{change}</span>
        </div>

        {/* Price */}
        <p className="text-lg font-bold text-blue-400">{price}</p>
      </div>
    </div>
  )
}

