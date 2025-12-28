import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useReferralEarnings } from '../hooks/useReferralEarnings'
import { useUserAccount } from '../hooks/useUserAccount'
import { useToast } from '../context/ToastContext'
import { referralService } from '../services/referralService'
import { supportService } from '../services/supportService'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import EarnPageSkeleton from '../components/EarnPageSkeleton'
import { DollarSign, Users, Share2, Copy, CheckCircle, MapPin, HelpCircle, History, MessageCircle } from 'lucide-react'

export default function EarnPage() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: earningsData, isLoading: isLoadingEarnings, error: earningsError, refetch: refetchEarnings } = useReferralEarnings()
  const { data: userAccount, isLoading: isLoadingAccount } = useUserAccount()
  const [copiedCode, setCopiedCode] = useState(false)
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null)
  
  // Withdrawal form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    walletAddress: '',
    amount: '',
    saveDetails: false,
  })

  // Support modal state
  const [supportMessage, setSupportMessage] = useState('')

  // Load saved withdrawal details on mount
  useEffect(() => {
    if (userAccount?.savedWithdrawalDetails) {
      setFormData({
        fullName: userAccount.fullName || userAccount.name || '',
        email: userAccount.email || '',
        phoneNumber: userAccount.phoneNumber || '',
        walletAddress: userAccount.tronWalletAddress || userAccount.walletAddress || '',
        amount: '',
        saveDetails: true,
      })
    } else if (userAccount) {
      // Prefill with available data
      setFormData(prev => ({
        ...prev,
        fullName: userAccount.fullName || userAccount.name || '',
        email: userAccount.email || '',
        phoneNumber: userAccount.phoneNumber || '',
        walletAddress: userAccount.tronWalletAddress || userAccount.walletAddress || '',
      }))
    }
  }, [userAccount])

  // Check for pending notifications on mount (only once per message)
  const [shownNotification, setShownNotification] = useState<string | null>(null)
  useEffect(() => {
    if (userAccount?.userPendingMessage && userAccount.userPendingMessage !== shownNotification) {
      toast.success(userAccount.userPendingMessage)
      setShownNotification(userAccount.userPendingMessage)
      // Message is cleared on backend when fetched
      queryClient.invalidateQueries({ queryKey: ['userAccount'] })
    }
  }, [userAccount?.userPendingMessage, shownNotification, toast, queryClient])

  // Fetch withdrawal history
  const { data: withdrawalHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['withdrawalHistory'],
    queryFn: async () => {
      const response = await referralService.getWithdrawalHistory()
      return response.data || []
    },
    enabled: showHistory,
  })

  const isLoading = isLoadingEarnings || isLoadingAccount
  const summary = earningsData?.summary
  const propertiesSold = earningsData?.propertiesSold || []

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
    const deepLink = `https://worldtile.in?ref=${referralCode}`
    const message = `🌟 Join WorldTile Metaverse!\n\nBuy virtual land and build your digital empire! 🏰\n\nUse my referral code: ${referralCode}\n\  use code when signing up : \n\ ${deepLink}`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const withdrawalMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const availableEarnings = parseFloat(summary?.pendingEarningsUSDT || '0')
      const requestedAmount = parseFloat(data.amount)
      
      if (requestedAmount > availableEarnings) {
        throw new Error(`Insufficient earnings. Available: ${availableEarnings.toFixed(6)} USDT`)
      }

      return await referralService.requestWithdrawal({
        amount: data.amount,
        walletAddress: data.walletAddress,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        saveDetails: data.saveDetails,
      })
    },
    onSuccess: () => {
      toast.success('✔️ Withdrawal request submitted!')
      setShowWithdrawalForm(false)
      setFormData(prev => ({ ...prev, amount: '' }))
      queryClient.invalidateQueries({ queryKey: ['referralEarnings'] })
      refetchHistory()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit withdrawal request')
    },
  })

  const supportMutation = useMutation({
    mutationFn: async (message: string) => {
      return await supportService.submitUserQuery({
        withdrawalId: selectedWithdrawalId || undefined,
        message,
      })
    },
    onSuccess: () => {
      toast.success('📝 Support request sent to admin')
      setShowSupportModal(false)
      setSupportMessage('')
      setSelectedWithdrawalId(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit support request')
    },
  })

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.walletAddress || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    withdrawalMutation.mutate(formData)
  }

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supportMessage.trim()) {
      toast.error('Please describe your issue')
      return
    }

    supportMutation.mutate(supportMessage)
  }

  const openWhatsAppSupport = () => {
    const phoneNumber = '+918296945508'
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`
    window.open(whatsappUrl, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'APPROVED':
        return 'bg-blue-500/20 text-blue-400'
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400'
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  // Calculate total lands sold
  const totalLandsSold = propertiesSold.reduce((total, property) => {
    return total + (property.slots?.length || 0)
  }, 0)

  // Calculate total value (lands sold * 110 USDT per land)
  const LAND_PRICE_USDT = 110
  const totalLandsValue = totalLandsSold * LAND_PRICE_USDT

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">
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
          {/* Available earnings card */}
          <GlassCard padding="p-6" backgroundColor="bg-green-500/20">
            <div className="flex flex-col items-center">
              <DollarSign className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-gray-400 text-sm mb-2">Available to withdraw</p>
              <p className="text-3xl font-bold text-green-400 mb-2">
                {formatUSDT(summary.pendingEarningsUSDT || '0')} USDT
              </p>
              <p className="text-xs text-gray-400">
                Commission rate: {((summary.commissionRate || 0.25) * 100).toFixed(0)}%
              </p>
            </div>
          </GlassCard>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowWithdrawalForm(true)
                setShowHistory(false)
              }}
              className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Withdraw Earnings
            </button>
            <button
              onClick={() => {
                setShowHistory(!showHistory)
                if (!showHistory) {
                  refetchHistory()
                }
              }}
              className="px-4 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              History
            </button>
          </div>

          {/* Withdrawal Form Modal */}
          {showWithdrawalForm && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/10 max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">Withdraw Earnings</h2>
                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Wallet Address (TRX TRC20) *
                    </label>
                    <input
                      type="text"
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                      placeholder="TRX (TRC20) only"
                      required
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Wallet must be TRON (TRC20). USDT only.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Amount (USDT) *
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="0"
                      max={summary.pendingEarningsUSDT || '0'}
                      value={formData.amount}
                      onChange={(e) => {
                        const val = e.target.value
                        const max = parseFloat(summary?.pendingEarningsUSDT || '0')
                        // Prevent entering more than available
                        if (val && parseFloat(val) > max) {
                          toast.error(`Maximum available: ${formatUSDT(summary.pendingEarningsUSDT || '0')} USDT`)
                          setFormData({ ...formData, amount: max.toFixed(6) })
                        } else {
                          setFormData({ ...formData, amount: val })
                        }
                      }}
                      required
                      placeholder={`Max: ${formatUSDT(summary.pendingEarningsUSDT || '0')} USDT (Available)`}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Available: {formatUSDT(summary.pendingEarningsUSDT || '0')} USDT
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveDetails"
                      checked={formData.saveDetails}
                      onChange={(e) => setFormData({ ...formData, saveDetails: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="saveDetails" className="text-sm text-white/70">
                      Save these details for next time
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={withdrawalMutation.isPending}
                      className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                    >
                      {withdrawalMutation.isPending ? 'Submitting...' : 'Withdraw'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWithdrawalForm(false)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Withdrawal History */}
          {showHistory && (
            <GlassCard padding="p-6" backgroundColor="bg-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Withdrawal History
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-white/70 hover:text-white"
                >
                  ✕
                </button>
              </div>
              {withdrawalHistory && withdrawalHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-sm text-white/70">ID</th>
                        <th className="text-left py-2 text-sm text-white/70">Amount (USDT)</th>
                        <th className="text-left py-2 text-sm text-white/70">Status</th>
                        <th className="text-left py-2 text-sm text-white/70">Help</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id} className="border-b border-white/5">
                          <td className="py-2 text-sm text-white/70 font-mono">
                            {withdrawal.id.slice(0, 8)}...
                          </td>
                          <td className="py-2 text-sm text-white">
                            {formatUSDT(withdrawal.amount)}
                          </td>
                          <td className="py-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="py-2">
                            <button
                              onClick={() => {
                                setSelectedWithdrawalId(withdrawal.id)
                                setShowSupportModal(true)
                              }}
                              className="p-1 hover:bg-white/10 rounded transition"
                              title="Get help"
                            >
                              <HelpCircle className="w-4 h-4 text-blue-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/50 text-center py-4">No withdrawal history</p>
              )}
            </GlassCard>
          )}

          {/* Support Modal */}
          {showSupportModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/10">
                <h3 className="text-xl font-bold text-white mb-4">Contact Support</h3>
                <form onSubmit={handleSupportSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-1">
                      Describe your issue *
                    </label>
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                      rows={5}
                      placeholder="Please describe your issue in detail..."
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* WhatsApp Option */}
                  <div className="flex items-center gap-2 pt-2 pb-2">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span className="text-sm text-white/50">or</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={openWhatsAppSupport}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </button>
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={supportMutation.isPending}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                    >
                      {supportMutation.isPending ? 'Submitting...' : 'Submit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSupportModal(false)
                        setSupportMessage('')
                        setSelectedWithdrawalId(null)
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Active Referrals"
              value={`${summary.totalReferrals || 0}`}
              icon={Users}
              color="text-purple-400"
            />
            <StatCard
              title="Total Lands Sold"
              value={`${formatUSDT(totalLandsValue.toString())} USDT`}
              icon={MapPin}
              color="text-blue-400"
            />
          </div>

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
