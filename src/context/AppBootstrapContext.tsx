import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { userService, type UserStats } from '../services/userService'

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
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)

  const loadStats = useCallback(async () => {
    if (!user) {
      setUserStats(null)
      setIsLoadingStats(false)
      setHasLoaded(true)
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
  }, [user])

  const refreshStats = useCallback(async () => {
    if (!user) return
    setIsLoadingStats(true)
    await loadStats()
  }, [user, loadStats])

  useEffect(() => {
    // Reset when user changes
    setHasLoaded(false)
    setIsLoadingStats(true)
  }, [user])

  useEffect(() => {
    // Load stats when user is available and not yet loaded
    if (user && !hasLoaded) {
      loadStats()
    } else if (!user) {
      // Clear stats when user logs out
      setUserStats(null)
      setIsLoadingStats(false)
      setHasLoaded(false)
    }
  }, [user, hasLoaded, loadStats])

  const value: AppBootstrapContextType = {
    userStats,
    isLoadingStats,
    refreshStats,
  }

  return <AppBootstrapContext.Provider value={value}>{children}</AppBootstrapContext.Provider>
}

