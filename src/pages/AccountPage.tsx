import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useUserAccount } from '../hooks/useUserAccount'
import { useUserLands } from '../hooks/useUserLands'
import { accountService } from '../services/accountService'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import GlassCard from '../components/GlassCard'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import AccountPageSkeleton from '../components/AccountPageSkeleton'
import { Check, Lock, LogOut, Grid3x3, DollarSign } from 'lucide-react'

export default function AccountPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { data: account, isLoading, error } = useUserAccount()
  const { data: lands, isLoading: isLoadingLands } = useUserLands()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [editingPhone, setEditingPhone] = useState(false)
  const [nameValue, setNameValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [originalName, setOriginalName] = useState('')
  const [originalPhone, setOriginalPhone] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [isAddingReferral, setIsAddingReferral] = useState(false)

  // Update form values when account data loads
  useEffect(() => {
    if (account) {
      setNameValue(account.name)
      setPhoneValue(account.phoneNumber || '')
      setOriginalName(account.name)
      setOriginalPhone(account.phoneNumber || '')
    }
  }, [account])

  // Handle unauthorized errors
  useEffect(() => {
    if (error && (error as any).isUnauthorized) {
      logout()
      navigate('/login')
    }
  }, [error, logout, navigate])

  const loadAccountData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['userAccount'] })
  }

  const handleUpdateName = async () => {
    if (!account || nameValue.trim() === originalName) {
      setEditingName(false)
      return
    }

    setIsUpdatingProfile(true)
    try {
      await accountService.updateProfile({ name: nameValue.trim() })
      // Invalidate and refetch account data
      await queryClient.invalidateQueries({ queryKey: ['userAccount'] })
      setOriginalName(nameValue.trim())
      setEditingName(false)
      toast.success('Name updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update name')
      // Revert to original value on error
      setNameValue(originalName)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleUpdatePhone = async () => {
    if (!account) {
      setEditingPhone(false)
      return
    }

    const newPhone = phoneValue.trim()
    const oldPhone = originalPhone || ''

    if (newPhone === oldPhone) {
      setEditingPhone(false)
      return
    }

    setIsUpdatingProfile(true)
    try {
      await accountService.updateProfile({
        phoneNumber: newPhone || null,
      })
      // Invalidate and refetch account data
      await queryClient.invalidateQueries({ queryKey: ['userAccount'] })
      setOriginalPhone(newPhone)
      setEditingPhone(false)
      toast.success('Phone number updated successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update phone')
      // Revert to original value on error
      setPhoneValue(originalPhone)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handleAddReferralCode = async () => {
    if (!referralCode.trim()) {
      toast.warning('Please enter a referral code')
      return
    }

    setIsAddingReferral(true)
    try {
      const result = await accountService.addReferralCode(referralCode.trim().toUpperCase())
      if (result.success) {
        await loadAccountData()
        setReferralCode('')
        toast.success('Referral code linked successfully')
      } else {
        toast.error(result.message || 'Failed to add referral code')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add referral code')
    } finally {
      setIsAddingReferral(false)
    }
  }

  // Calculate tiles owned and total value
  const tilesCount = lands?.length || 0
  const totalValue = lands?.reduce((sum, land) => {
    return sum + parseFloat(land.purchasePriceUSDT || '0')
  }, 0) || 0

  const formatUSDT = (amount: number): string => {
    try {
      if (amount === 0) return '0.00'
      return amount.toFixed(2)
    } catch {
      return '0.00'
    }
  }


  if (isLoading) {
    return <AccountPageSkeleton />
  }

  if (error) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message={(error as any).message || 'Failed to load account'} onRetry={loadAccountData} />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="py-8 px-4 md:px-6">
        <ErrorState message="Account not found" onRetry={loadAccountData} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">
      {/* Logout button */}
      <div className="flex justify-end mb-4 px-4">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="space-y-6 px-4">
        {/* Profile Card */}
        <GlassCard padding="p-6">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-white/30 flex items-center justify-center">
              {account.photoUrl ? (
                <img
                  src={account.photoUrl}
                  alt={account.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {account.initials}
                </span>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Name</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameValue}
                onChange={(e) => {
                  setNameValue(e.target.value)
                  setEditingName(true)
                }}
                onBlur={handleUpdateName}
                disabled={isUpdatingProfile}
                className="flex-1 bg-white/90 border border-white/20 rounded-xl px-4 py-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                placeholder="Enter your name"
              />
              {editingName && nameValue.trim() !== originalName && (
                <button
                  onClick={handleUpdateName}
                  disabled={isUpdatingProfile}
                  className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                  title="Save changes"
                >
                  {isUpdatingProfile ? (
                    <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Email Field (read-only) */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={account.email}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400"
            />
          </div>

          {/* Phone Field */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Phone Number</label>
            <div className="flex items-center gap-2">
              <input
                type="tel"
                value={phoneValue}
                onChange={(e) => {
                  setPhoneValue(e.target.value)
                  setEditingPhone(true)
                }}
                onBlur={handleUpdatePhone}
                disabled={isUpdatingProfile}
                placeholder="+1234567890"
                className="flex-1 bg-white/90 border border-white/20 rounded-xl px-4 py-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
              />
              {editingPhone && phoneValue.trim() !== originalPhone && (
                <button
                  onClick={handleUpdatePhone}
                  disabled={isUpdatingProfile}
                  className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                  title="Save changes"
                >
                  {isUpdatingProfile ? (
                    <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5 text-green-400" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Agent Title */}
          <div className="flex justify-center mt-4">
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <span className="text-xs font-semibold text-blue-400">
                {account.agentProfile.title}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Referral Code Section (if not referred) */}
        {!account.isReferred && (
          <GlassCard padding="p-5">
            <h3 className="text-lg font-bold text-white mb-4">Enter Referral Code</h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Enter referral code"
                className="flex-1 bg-white/8 border border-white/20 rounded-xl px-4 py-3 text-black uppercase placeholder:text-gray-500 min-w-0"
                maxLength={10}
              />
              <button
                onClick={handleAddReferralCode}
                disabled={isAddingReferral || !referralCode.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors whitespace-nowrap sm:w-auto w-full"
              >
                {isAddingReferral ? '...' : 'Apply'}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Referral Code Section (if referred - locked) */}
        {account.isReferred && (
          <GlassCard padding="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Referral code locked</h3>
            </div>
            <p className="text-sm text-gray-400">You were referred by another agent</p>
          </GlassCard>
        )}

        {/* Tiles Owned & Value */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="Tiles Owned"
            value={isLoadingLands ? '...' : `${tilesCount}`}
            icon={Grid3x3}
            color="text-purple-400"
          />
          <StatCard
            title="Total Value"
            value={isLoadingLands ? '...' : `${formatUSDT(totalValue)} USDT`}
            icon={DollarSign}
            color="text-blue-400"
          />
        </div>
      </div>
    </div>
  )
}

