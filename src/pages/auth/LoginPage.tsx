import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, WalletProfile } from '../../context/AuthContext'
import WalletConnect from '../../components/WalletConnect'
import { useActiveAccount, useProfiles, useDisconnect, useActiveWallet } from 'thirdweb/react'
import { signMessage } from 'thirdweb/utils'
import { getUserEmail } from 'thirdweb/wallets/in-app'
import { thirdwebClient } from '../../lib/thirdweb'

export default function LoginPage() {
  const navigate = useNavigate()
  const { token, loginWithWallet } = useAuth()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const account = useActiveAccount()
  const { data: profiles, isLoading: profilesLoading } = useProfiles({ 
    client: thirdwebClient,
    ...(account ? { account } : {})
  })
  const { disconnect } = useDisconnect()
  const wallet = useActiveWallet()
  const hasTriedLogin = useRef(false)
  const hasDisconnected = useRef(false)

  // Force disconnect wallet if user just logged out
  useEffect(() => {
    const forceDisconnect = async () => {
      const logoutTimestamp = localStorage.getItem('logoutTimestamp')
      if (logoutTimestamp && wallet && !hasDisconnected.current) {
        const timeSinceLogout = Date.now() - parseInt(logoutTimestamp, 10)
        if (timeSinceLogout < 10000) {
          // User just logged out, force disconnect wallet
          try {
            await disconnect(wallet)
            hasDisconnected.current = true
          } catch (e) {
            console.warn('Failed to disconnect wallet:', e)
          }
        }
      }
    }
    forceDisconnect()
  }, [wallet, disconnect])

  useEffect(() => {
    const run = async () => {
      // Check if user just logged out (within last 5 seconds) - prevent auto-login
      const logoutTimestamp = localStorage.getItem('logoutTimestamp')
      if (logoutTimestamp) {
        const timeSinceLogout = Date.now() - parseInt(logoutTimestamp, 10)
        if (timeSinceLogout < 5000) {
          // User just logged out, don't auto-login
          return
        } else {
          // Clear the flag after 5 seconds
          localStorage.removeItem('logoutTimestamp')
          hasDisconnected.current = false // Reset disconnect flag
        }
      }
      
      // Wait for profiles to load if they're loading
      if (profilesLoading || !account || token || hasTriedLogin.current) return
      
      // Give profiles a moment to load after account connects
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      hasTriedLogin.current = true
      setLoading(true)
      setError('')
      try {
        const signer = async (message: string) => {
          return await signMessage({ account, message })
        }
        
        // Extract profile data from thirdweb profiles (email, phone, name, etc.)
        const profile: WalletProfile = {}
        
        // Try to get email using getUserEmail first (more reliable)
        try {
          const email = await getUserEmail({ client: thirdwebClient })
          if (email) {
            profile.email = email
            console.log('Got email from getUserEmail:', email)
          }
        } catch (e) {
          console.warn('getUserEmail failed:', e)
        }
        
        // Also check profiles for additional data
        if (profiles && profiles.length > 0) {
          console.log('Thirdweb profiles:', profiles)
          
          for (const p of profiles) {
            // Handle email profile type
            if (p.type === 'email' && (p as any).details?.email) {
              profile.email = profile.email || (p as any).details.email
            }
            
            // Handle phone profile type
            if (p.type === 'phone' && (p as any).details?.phone) {
              profile.phone = (p as any).details.phone
            }
            
            // Handle Google profile type
            if (p.type === 'google') {
              const details = (p as any).details || (p as any)
              if (details.email) profile.email = profile.email || details.email
              if (details.name) profile.name = profile.name || details.name
              if (details.picture) profile.profileImage = profile.profileImage || details.picture
            }
            
            // Handle Apple profile type
            if (p.type === 'apple') {
              const details = (p as any).details || (p as any)
              if (details.email) profile.email = profile.email || details.email
              if (details.name) profile.name = profile.name || details.name
            }
            
            // Handle Facebook profile type
            if (p.type === 'facebook') {
              const details = (p as any).details || (p as any)
              if (details.email) profile.email = profile.email || details.email
              if (details.name) profile.name = profile.name || details.name
              if (details.picture) profile.profileImage = profile.profileImage || details.picture
            }
          }
        }
        
        console.log('Extracted profile:', profile)
        await loginWithWallet(account.address, signer, null, profile)
        // Clear logout flag on successful login
        localStorage.removeItem('logoutTimestamp')
        navigate('/home')
      } catch (e: any) {
        setError(e?.message || 'Wallet login failed')
        hasTriedLogin.current = false // Allow retry on error
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, token, profiles, profilesLoading])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8">
      <div className="w-full max-w-md md:max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-gray-400">Sign in with your wallet</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <WalletConnect />

        {loading && <p className="mt-4 text-sm text-gray-400 text-center">Completing sign-in...</p>}

        <p className="mt-6 text-center text-sm text-gray-400">
          New here?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

