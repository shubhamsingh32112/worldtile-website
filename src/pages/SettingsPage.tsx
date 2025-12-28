import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import { User, Shield, HelpCircle, FileText, ChevronRight, Lock } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()

  const settingsOptions = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/settings/profile',
      locked: false,
    },
    {
      id: 'kyc',
      label: 'KYC',
      icon: Shield,
      path: '/settings/kyc',
      locked: true,
    },
    {
      id: 'support',
      label: 'Support',
      icon: HelpCircle,
      path: '/settings/support',
      locked: false,
    },
    {
      id: 'terms',
      label: 'Terms and Conditions',
      icon: FileText,
      path: '/settings/terms',
      locked: false,
    },
  ]

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6 py-8">
      <div className="mb-6 px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account settings</p>
      </div>

      <div className="space-y-3 px-4">
        {settingsOptions.map((option) => {
          const Icon = option.icon
          return (
            <GlassCard key={option.id} padding="p-0">
              <button
                onClick={() => !option.locked && navigate(option.path)}
                disabled={option.locked}
                className={`w-full flex items-center justify-between p-5 rounded-xl transition-colors ${
                  option.locked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-white/5 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">{option.label}</span>
                  {option.locked && (
                    <Lock className="w-4 h-4 text-orange-400" />
                  )}
                </div>
                {!option.locked && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

