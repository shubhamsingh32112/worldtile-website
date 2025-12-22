import api from './api'

export interface UserStats {
  landsOwned: number
  referralEarningsUSDT: string
}

export interface UserLand {
  landSlotId: string
  stateKey: string
  stateName?: string
  areaKey: string
  areaName?: string
  purchasePriceUSDT: string
  purchasedAt: string
}

export interface UserStatsResponse {
  success: boolean
  stats?: UserStats
  message?: string
}

export interface UserLandsResponse {
  success: boolean
  lands?: UserLand[]
  count?: number
  message?: string
}

export const userService = {
  /**
   * Get user statistics (lands owned count, referral earnings)
   */
  async getUserStats(): Promise<UserStatsResponse> {
    try {
      const response = await api.get<{ stats: UserStats }>('/user/stats')
      return {
        success: true,
        stats: response.data.stats || {
          landsOwned: 0,
          referralEarningsUSDT: '0',
        },
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user stats'
      return {
        success: false,
        message,
        stats: {
          landsOwned: 0,
          referralEarningsUSDT: '0',
        },
      }
    }
  },

  /**
   * Get all lands owned by the authenticated user
   */
  async getUserLands(): Promise<UserLandsResponse> {
    try {
      const response = await api.get<{ lands: UserLand[]; count: number }>('/user/lands')
      return {
        success: true,
        lands: response.data.lands || [],
        count: response.data.count || 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user lands'
      return {
        success: false,
        message,
        lands: [],
        count: 0,
      }
    }
  },
}

