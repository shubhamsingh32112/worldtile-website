import GlassCard from './GlassCard'

export default function AccountPageSkeleton() {
  return (
    <div className="py-8 px-4 md:px-6">
      {/* Logout button skeleton */}
      <div className="flex justify-end mb-4 px-4">
        <div className="h-10 bg-gray-700/30 rounded-xl w-24 animate-pulse"></div>
      </div>

      <div className="space-y-6 px-4">
        {/* Profile Card skeleton */}
        <GlassCard padding="p-6">
          {/* Avatar skeleton */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-700/30 animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700/30 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Name field skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-gray-700/20 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-700/30 rounded-lg animate-pulse"></div>
          </div>

          {/* Phone field skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-gray-700/20 rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-10 bg-gray-700/30 rounded-lg animate-pulse"></div>
          </div>
        </GlassCard>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-700/10 rounded-xl animate-pulse"></div>
          <div className="h-24 bg-gray-700/10 rounded-xl animate-pulse"></div>
        </div>

        {/* Referral code card skeleton */}
        <GlassCard padding="p-5" backgroundColor="bg-blue-500/20">
          <div className="space-y-3">
            <div className="h-6 bg-gray-700/30 rounded w-40 animate-pulse"></div>
            <div className="h-16 bg-gray-700/20 rounded-xl animate-pulse"></div>
            <div className="h-3 bg-gray-700/20 rounded w-full animate-pulse"></div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

