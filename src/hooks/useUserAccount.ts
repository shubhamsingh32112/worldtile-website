import { useQuery } from '@tanstack/react-query'
import { accountService } from '../services/accountService'

export const useUserAccount = () => {
  return useQuery({
    queryKey: ['userAccount'],
    queryFn: async () => {
      return await accountService.getMyAccount()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - account data changes rarely
  })
}

