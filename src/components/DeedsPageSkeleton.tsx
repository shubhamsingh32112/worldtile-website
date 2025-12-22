import GlassCard from './GlassCard'
import { Mountain, MapPin, Calendar, Wallet } from 'lucide-react'

export default function DeedsPageSkeleton() {
  return (
    <div className="py-8 px-4 md:px-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="h-8 bg-gray-700/30 rounded-lg w-32 animate-pulse"></div>
        <div className="h-8 bg-gray-700/30 rounded-lg w-24 animate-pulse"></div>
      </div>

      {/* Card skeletons */}
      <div className="space-y-3 px-4">
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} padding="p-4">
            <div className="space-y-3">
              {/* Land Slot ID skeleton */}
              <div className="flex items-center gap-2">
                <Mountain className="w-5 h-5 text-gray-600" />
                <div className="h-5 bg-gray-700/30 rounded w-40 animate-pulse"></div>
              </div>

              {/* Location skeleton */}
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div className="h-4 bg-gray-700/20 rounded w-48 animate-pulse"></div>
              </div>

              {/* Purchase details skeleton */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <div className="h-4 bg-gray-700/20 rounded w-24 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-gray-600" />
                  <div className="h-4 bg-gray-700/20 rounded w-20 animate-pulse"></div>
                </div>
              </div>

              {/* Button skeleton */}
              <div className="h-12 bg-gray-700/20 rounded-xl animate-pulse"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

