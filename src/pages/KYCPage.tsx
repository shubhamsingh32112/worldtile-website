import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import { ArrowLeft, Lock, Shield } from 'lucide-react'

export default function KYCPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6 py-8">
      {/* Header with back button */}
      <div className="flex justify-between items-center mb-6 px-4">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="px-4">
        <GlassCard padding="p-8" backgroundColor="bg-orange-500/20">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-orange-500/30 rounded-full mb-4">
              <Lock className="w-12 h-12 text-orange-400" />
            </div>
            <Shield className="w-16 h-16 text-orange-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">KYC Verification</h2>
            <p className="text-gray-300 mb-2">
              KYC (Know Your Customer) verification is currently locked.
            </p>
            <p className="text-gray-400 text-sm">
              This feature will be available soon. Please check back later.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

