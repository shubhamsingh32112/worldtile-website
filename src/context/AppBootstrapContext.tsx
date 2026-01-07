import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { userService, type UserStats } from '../services/userService'
import { useUserSync } from '../hooks/useUserSync'

interface AppBootstrapContextType {
  userStats: UserStats | null
  isLoadingStats: boolean
  refreshStats: () => Promise<void>
}

const AppBootstrapContext = createContext<AppBootstrapContextType | undefined>(undefined)

export const useAppBootstrap = () => {
  const context = useContext(AppBootstrapContext)
  if (context === undefined) {
    throw new Error('useAppBootstrap must be used within an AppBootstrapProvider')
  }
  return context
}

interface AppBootstrapProviderProps {
  children: ReactNode
}

export const AppBootstrapProvider: React.FC<AppBootstrapProviderProps> = ({ children }) => {
  const account = useActiveAccount()
  const isAuthed = useUserSync() // Sync user with backend when wallet connects
  
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadStats = useCallback(async () => {
    if (!account || !isAuthed) {
      setUserStats(null)
      setIsLoadingStats(false)
      setHasLoaded(false)
      return
    }

    try {
      const result = await userService.getUserStats()
      if (result.success && result.stats) {
        setUserStats(result.stats)
      } else {
        // Set default stats on error
        setUserStats({
          landsOwned: 0,
          referralEarningsUSDT: '0',
        })
      }
    } catch (error) {
      console.error('Error loading user stats:', error)
      // Set default stats on error
      setUserStats({
        landsOwned: 0,
        referralEarningsUSDT: '0',
      })
    } finally {
      setIsLoadingStats(false)
      setHasLoaded(true)
    }
  }, [account, isAuthed])

  const refreshStats = useCallback(async () => {
    if (!account || !isAuthed) return
    setIsLoadingStats(true)
    await loadStats()
  }, [account, isAuthed, loadStats])

  useEffect(() => {
    // Reset when auth state changes
    setHasLoaded(false)
    setIsLoadingStats(true)
  }, [account, isAuthed])

  useEffect(() => {
    // Load stats only when authenticated and not yet loaded
    if (account && isAuthed && !hasLoaded) {
      loadStats()
    } else if (!account || !isAuthed) {
      setUserStats(null)
      setIsLoadingStats(false)
      setHasLoaded(false)
    }
  }, [account, isAuthed, hasLoaded, loadStats])

  const value: AppBootstrapContextType = {
    userStats,
    isLoadingStats,
    refreshStats,
  }

  return <AppBootstrapContext.Provider value={value}>{children}</AppBootstrapContext.Provider>
}

