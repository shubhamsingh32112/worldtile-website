import GlassCard from './GlassCard'
import StatCard from './StatCard'
import { DollarSign, Users } from 'lucide-react'

export default function EarnPageSkeleton() {
  return (
    <div className="py-8 px-4 md:px-6">
      {/* Header skeleton */}
      <div className="mb-6 px-4">
        <div className="h-8 bg-gray-700/30 rounded-lg w-64 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700/20 rounded w-48 animate-pulse"></div>
      </div>

      <div className="space-y-5 px-4">
        {/* Total earned card skeleton */}
        <GlassCard padding="p-6" backgroundColor="bg-green-500/20">
          <div className="flex flex-col items-center">
            <DollarSign className="w-12 h-12 text-gray-600 mb-3" />
            <div className="h-4 bg-gray-700/30 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-700/30 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-700/20 rounded w-40 animate-pulse"></div>
          </div>
        </GlassCard>

        {/* Withdrawal button skeleton */}
        <div className="h-14 bg-gray-700/20 rounded-xl animate-pulse"></div>

        {/* Stats card skeleton */}
        <div className="h-24 bg-gray-700/10 rounded-xl animate-pulse"></div>

        {/* Referral code card skeleton */}
        <GlassCard padding="p-5" backgroundColor="bg-blue-500/20">
          <div className="space-y-3">
            <div className="h-6 bg-gray-700/30 rounded w-48 animate-pulse"></div>
            <div className="h-16 bg-gray-700/20 rounded-xl animate-pulse"></div>
            <div className="h-3 bg-gray-700/20 rounded w-full animate-pulse"></div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

