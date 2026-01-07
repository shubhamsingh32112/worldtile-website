import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import WalletConnect from '../../components/WalletConnect'
import { useActiveAccount } from 'thirdweb/react'
import { signMessage } from 'thirdweb/utils'
import { thirdwebClient } from '../../lib/thirdweb'

export default function SignupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token, loginWithWallet } = useAuth()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const account = useActiveAccount()
  const hasTriedLogin = useRef(false)

  const referralCode = (searchParams.get('ref') || '').toUpperCase() || null

  useEffect(() => {
    const run = async () => {
      if (!account || token || hasTriedLogin.current) return
      hasTriedLogin.current = true
      setLoading(true)
      setError('')
      try {
        const signer = async (message: string) => {
          return await signMessage({ account, client: thirdwebClient, message })
        }
        await loginWithWallet(account.address, signer, referralCode)
        navigate('/home')
      } catch (e: any) {
        setError(e?.message || 'Wallet signup failed')
        hasTriedLogin.current = false // Allow retry on error
      } finally {
        setLoading(false)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.address, token, referralCode])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-8">
      <div className="w-full max-w-md md:max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Connect a wallet to get started</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <WalletConnect />

        {loading && <p className="mt-4 text-sm text-gray-400 text-center">Completing sign-up...</p>}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

