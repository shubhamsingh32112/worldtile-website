import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useReferralEarnings } from '../hooks/useReferralEarnings'
import { useUserAccount } from '../hooks/useUserAccount'
import { useToast } from '../context/ToastContext'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import EarnPageSkeleton from '../components/EarnPageSkeleton'
import { DollarSign, Users, Share2, Copy, CheckCircle } from 'lucide-react'

export default function EarnPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: summary, isLoading: isLoadingEarnings, error: earningsError, refetch: refetchEarnings } = useReferralEarnings()
  const { data: userAccount, isLoading: isLoadingAccount } = useUserAccount()
  const [copiedCode, setCopiedCode] = useState(false)

  const isLoading = isLoadingEarnings || isLoadingAccount

  const loadEarnings = async () => {
    await queryClient.invalidateQueries({ queryKey: ['referralEarnings'] })
    await refetchEarnings()
  }

  const formatUSDT = (amount: string): string => {
    try {
      const value = parseFloat(amount)
      if (value === 0) return '0.00'
      return value.toFixed(2)
    } catch {
      return '0.00'
    }
  }

  const copyReferralCode = async (referralCode: string) => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const shareReferralCodeViaWhatsApp = (referralCode: string) => {
    const deepLink = `https://worldtile.app?ref=${referralCode}`
    const message = `🌟 Join WorldTile Metaverse!\n\nBuy virtual land and build your digital empire! 🏰\n\nUse my referral code: ${referralCode}\n\nDownload and use code when signing up:\n${deepLink}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleWithdrawal = async () => {
    if (!summary) return
    
    const totalEarnings = parseFloat(summary.totalEarningsUSDT || '0')
    if (totalEarnings === 0) {
      toast.warning('No earnings available to withdraw')
      return
    }

    const confirmed = window.confirm(
      `You are about to withdraw ${formatUSDT(summary.totalEarningsUSDT || '0')} USDT.\n\n` +
      'Please note: Withdrawal functionality is coming soon. Contact support for assistance.'
    )

    if (confirmed) {
      toast.info('Withdrawal feature coming soon. Please contact support.')
    }
  }

  return (
    <div className="py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-6 px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Your Referral Earnings</h1>
        {summary?.agentTitle && (
          <p className="text-gray-400 text-sm">{summary.agentTitle}</p>
        )}
      </div>

      {isLoading ? (
        <EarnPageSkeleton />
      ) : earningsError ? (
        <ErrorState message={earningsError.message || 'Failed to load earnings'} onRetry={loadEarnings} />
      ) : summary ? (
        <div className="space-y-5 px-4">
          {/* Total earned card */}
          <GlassCard padding="p-6" backgroundColor="bg-green-500/20">
            <div className="flex flex-col items-center">
              <DollarSign className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-gray-400 text-sm mb-2">Total Earned</p>
              <p className="text-3xl font-bold text-green-400 mb-2">
                {formatUSDT(summary.totalEarningsUSDT || '0')} USDT
              </p>
              <p className="text-xs text-gray-400">
                Commission rate: {((summary.commissionRate || 0.25) * 100).toFixed(0)}%
              </p>
            </div>
          </GlassCard>

          {/* Withdrawal button */}
          <button
            onClick={handleWithdrawal}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Withdraw Earnings
          </button>

          {/* Stats card */}
          <StatCard
            title="Active Referrals"
            value={`${summary.totalReferrals || 0}`}
            icon={Users}
            color="text-purple-400"
            fullWidth
          />

          {/* Referral Code Card */}
          {userAccount?.referralCode && (
            <GlassCard padding="p-5" backgroundColor="bg-blue-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-white">Your Referral Code</h3>
              </div>

              <div className="bg-blue-500/15 border border-blue-500/30 rounded-xl p-4 mb-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-blue-500 font-bold text-sm tracking-widest">
                    {userAccount.referralCode}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => shareReferralCodeViaWhatsApp(userAccount.referralCode!)}
                      className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-5 h-5 text-green-400" />
                    </button>
                    <button
                      onClick={() => copyReferralCode(userAccount.referralCode!)}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      {copiedCode ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-blue-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                Share your code and earn {((summary.commissionRate || 0.25) * 100).toFixed(0)}% commission!
              </p>
            </GlassCard>
          )}
        </div>
      ) : null}
    </div>
  )
}
