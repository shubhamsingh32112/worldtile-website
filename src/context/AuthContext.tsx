import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, User } from '../services/authService'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string, referralCode?: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const clearAuth = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
        // Verify token by fetching user data
        authService
          .getMe()
          .then((response) => {
            if (response.success) {
              setUser(response.user)
              localStorage.setItem('user', JSON.stringify(response.user))
            } else {
              // Token invalid, clear storage
              clearAuth()
            }
          })
          .catch(() => {
            // Token invalid, clear storage
            clearAuth()
          })
          .finally(() => setLoading(false))
      } catch (error) {
        clearAuth()
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    if (response.success) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } else {
      throw new Error(response.message || 'Login failed')
    }
  }

  const signup = async (name: string, email: string, password: string, referralCode?: string) => {
    const response = await authService.signup({ name, email, password, referralCode })
    if (response.success) {
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } else {
      throw new Error(response.message || 'Signup failed')
    }
  }

  const loginWithGoogle = async () => {
    setLoading(true)
    try {
      const data = await authService.googleLogin()
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error: any) {
      // Handle Firebase auth errors
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in cancelled')
      }
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    loginWithGoogle,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

