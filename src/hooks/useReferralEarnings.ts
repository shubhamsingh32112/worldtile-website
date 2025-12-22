import { useQuery } from '@tanstack/react-query'
import { referralService, type ReferralSummary } from '../services/referralService'

export const useReferralEarnings = () => {
  return useQuery({
    queryKey: ['referralEarnings'],
    queryFn: async () => {
      const result = await referralService.getReferralEarnings()
      if (result.success && result.summary) {
        return result.summary
      }
      throw new Error(result.message || 'Failed to fetch referral earnings')
    },
    staleTime: 3 * 60 * 1000, // 3 minutes - earnings update less frequently
  })
}

