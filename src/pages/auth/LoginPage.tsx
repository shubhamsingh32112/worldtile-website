import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import WalletConnect from '../../components/WalletConnect'
import { useActiveAccount } from 'thirdweb/react'
import { signMessage } from 'thirdweb/utils'
import { thirdwebClient } from '../../lib/thirdweb'

export default function LoginPage() {
  const navigate = useNavigate()
  const { token, loginWithWallet } = useAuth()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const account = useActiveAccount()
  const hasTriedLogin = useRef(false)

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
        await loginWithWallet(account.address, signer)
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
  }, [account?.address, token])

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

