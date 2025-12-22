import { useQuery } from '@tanstack/react-query'
import { userService, type UserLand } from '../services/userService'

export const useUserLands = () => {
  return useQuery({
    queryKey: ['userLands'],
    queryFn: async () => {
      const result = await userService.getUserLands()
      if (result.success && result.lands) {
        return result.lands
      }
      throw new Error(result.message || 'Failed to fetch user lands')
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - lands don't change often
  })
}

