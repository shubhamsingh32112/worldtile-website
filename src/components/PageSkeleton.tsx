import GlassCard from './GlassCard'

export default function PageSkeleton() {
  return (
    <div className="py-8 px-4 md:px-6">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-700/30 rounded-lg w-1/3 animate-pulse"></div>
        
        {/* Card skeletons */}
        {[1, 2, 3].map((i) => (
          <GlassCard key={i} padding="p-4" backgroundColor="bg-white/5">
            <div className="space-y-3">
              <div className="h-5 bg-gray-700/30 rounded w-2/3 animate-pulse"></div>
              <div className="h-4 bg-gray-700/20 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-700/20 rounded w-3/4 animate-pulse"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

