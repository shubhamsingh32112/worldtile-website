import api from './api'

export interface AgentProfile {
  title: string
  commissionRate: number
  joinedAt: string
}

export interface ReferralStats {
  totalReferrals: number
  totalEarningsUSDT: string
}
//s
export interface UserAccount {
  name: string
  email: string
  phoneNumber?: string | null
  photoUrl?: string | null
  walletAddress?: string | null
  fullName?: string | null
  tronWalletAddress?: string | null
  savedWithdrawalDetails?: boolean
  userPendingMessage?: string | null
  referralCode?: string | null
  referredBy?: string | null
  agentProfile: AgentProfile
  referralStats: ReferralStats
  createdAt: string
  // Computed fields
  isReferred: boolean
  initials: string
  commissionRatePercent: number
  earningsAsDouble: number
}

export interface AccountResponse {
  success: boolean
  account?: UserAccount
  message?: string
}

export interface UpdateProfileRequest {
  name?: string
  phoneNumber?: string | null
  photoUrl?: string | null
}

export interface AddReferralCodeResponse {
  success: boolean
  message?: string
}

export class AccountException extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isUnauthorized = false,
  ) {
    super(message)
    this.name = 'AccountException'
  }
}

// Helper function to compute initials from name
function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    return parts[0].substring(0, 1).toUpperCase()
  }
  return (
    parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)
  ).toUpperCase()
}

// Helper function to transform backend response to UserAccount
function transformAccountData(data: any): UserAccount {
  const earningsAsDouble = parseFloat(
    data.referralStats.totalEarningsUSDT || '0',
  )
  const commissionRatePercent = Math.round(
    (data.agentProfile.commissionRate || 0) * 100,
  )

  return {
    ...data,
    isReferred: !!data.referredBy,
    initials: getInitials(data.name),
    commissionRatePercent,
    earningsAsDouble: isNaN(earningsAsDouble) ? 0 : earningsAsDouble,
  }
}

export const accountService = {
  /**
   * Get authenticated user's account information
   */
  async getMyAccount(): Promise<UserAccount> {
    try {
      const response = await api.get<any>('/users/me')
      return transformAccountData(response.data)
    } catch (error: any) {
      const statusCode = error.response?.status
      const message = error.response?.data?.message || 'Failed to fetch account'

      if (statusCode === 401) {
        throw new AccountException(message, statusCode, true)
      }

      throw new AccountException(message, statusCode)
    }
  },

  /**
   * Update user profile (name, phoneNumber, photoUrl)
   */
  async updateProfile(request: UpdateProfileRequest): Promise<UserAccount> {
    try {
      const response = await api.put<any>('/users/me', request)
      return transformAccountData(response.data)
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to update profile'
      throw new AccountException(message, error.response?.status)
    }
  },

  /**
   * Add referral code to account
   */
  async addReferralCode(
    referralCode: string,
  ): Promise<AddReferralCodeResponse> {
    try {
      const normalizedCode = referralCode.trim().toUpperCase()
      const response = await api.post<{ success: boolean; message?: string }>(
        '/users/add-referral',
        {
          referralCode: normalizedCode,
        },
      )
      return {
        success: response.data.success ?? true,
        message: response.data.message,
      }
    } catch (error: any) {
      const statusCode = error.response?.status
      const message =
        error.response?.data?.message || 'Failed to add referral code'

      if (statusCode === 403) {
        return {
          success: false,
          message: 'Referral code already set or invalid',
        }
      }

      return {
        success: false,
        message,
      }
    }
  },
}
