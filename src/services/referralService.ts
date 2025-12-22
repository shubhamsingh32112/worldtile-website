import api from './api'

export interface ReferralSummary {
  totalEarningsUSDT: string
  totalReferrals: number
  commissionRate: number
  agentTitle?: string
}

export interface PropertySold {
  buyerName: string
  stateName: string
  state: string
  areaName: string
  area: string
  slots: string[]
  commissionUSDT: string
  date: string
}

export interface ReferralEarningsResponse {
  success: boolean
  summary?: ReferralSummary
  propertiesSold?: PropertySold[]
  message?: string
}

export interface WithdrawalRequest {
  amount: string
  walletAddress: string
}

export interface WithdrawalResponse {
  success: boolean
  message?: string
  transactionId?: string
}

export const referralService = {
  /**
   * Get referral earnings with "real estate agent" feel
   */
  async getReferralEarnings(): Promise<ReferralEarningsResponse> {
    try {
      const response = await api.get<{
        summary: ReferralSummary
        propertiesSold: PropertySold[]
      }>('/referrals/earnings')
      return {
        success: true,
        summary: response.data.summary || {
          totalEarningsUSDT: '0',
          totalReferrals: 0,
          commissionRate: 0.25,
        },
        propertiesSold: response.data.propertiesSold || [],
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch referral earnings'
      return {
        success: false,
        message,
        summary: {
          totalEarningsUSDT: '0',
          totalReferrals: 0,
          commissionRate: 0.25,
        },
        propertiesSold: [],
      }
    }
  },

  /**
   * Request withdrawal of earnings
   */
  async requestWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    try {
      const response = await api.post<{
        message: string
        transactionId?: string
      }>('/referrals/withdraw', request)
      return {
        success: true,
        message: response.data.message || 'Withdrawal request submitted',
        transactionId: response.data.transactionId,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to process withdrawal'
      return {
        success: false,
        message,
      }
    }
  },
}

