import { useEffect, useState, useRef } from 'react'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import api from '../services/api'
import { thirdwebClient } from '@/lib/thirdwebClient'

/**
 * Unified auth hook that supports both:
 * - Flow A: Google / In-App Wallet (via getAuthToken)
 * - Flow B: EOA / MetaMask / WalletConnect (via SIWE)
 * 
 * CRITICAL: In thirdweb v5, detection must use WALLET, not ACCOUNT.
 * - Account = signing interface (both EOA and In-App have signMessage)
 * - Wallet = authentication source (knows how you logged in)
 * - wallet.id is the ONLY reliable signal for In-App detection
 */
export function useUserSync() {
  const account = useActiveAccount()
  const wallet = useActiveWallet() // 👈 CRITICAL: Wallet knows auth method, account doesn't
  const [isAuthed, setIsAuthed] = useState(false)
  const hasAuthedRef = useRef(false) // One-shot auth lock to prevent duplicate execution

  // Reset auth lock on disconnect
  useEffect(() => {
    if (!account || !wallet) {
      hasAuthedRef.current = false
      setIsAuthed(false)
    }
  }, [account, wallet])

  useEffect(() => {
    if (!account || !wallet) {
      setIsAuthed(false)
      return
    }

    // Prevent duplicate auth execution
    if (hasAuthedRef.current) {
      return
    }
    hasAuthedRef.current = true

    const authenticate = async () => {
      try {
        // CRITICAL: In thirdweb v5, wallet.id is the ONLY reliable detection
        // Account has signMessage for both EOA and In-App (looks identical)
        // Wallet.id tells you the actual authentication method
        const walletId = wallet.id as string
        const isInAppWallet = 
          walletId === 'inApp' || 
          walletId === 'inAppWallet' ||
          walletId?.includes('inApp')

        // Debug log to verify detection
        console.log('[DEBUG] wallet.id =', wallet.id)

        if (isInAppWallet) {
          // ============================================================
          // FLOW A: Google / In-App Wallet
          // ============================================================
          console.log('[AUTH] Detected In-App Wallet, using Flow A')

          // Get auth token from WALLET (not account) - this is the correct v5 API
          // CRITICAL: Must pass client to getAuthToken in v5
          if (!wallet.getAuthToken) {
            throw new Error('In-App wallet does not support getAuthToken')
          }
          
          // Type assertion needed - getAuthToken accepts client in v5 but types may not reflect this
          const authToken = await (wallet.getAuthToken as any)({
            client: thirdwebClient,
          })

          // Safety check: ensure authToken is a string
          if (typeof authToken !== 'string') {
            throw new Error('Expected JWT string from getAuthToken()')
          }

          // Authenticate with backend using auth token
          await api.post('/auth/in-app/login', {
            authToken,
          })

          console.log('✅ User authenticated via In-App Wallet (Flow A)')
        } else {
          // ============================================================
          // FLOW B: EOA (MetaMask / WalletConnect)
          // ============================================================
          console.log('[AUTH] Detected EOA wallet, using Flow B (SIWE)')

          // 1) Get SIWE payload + message from backend
          // Pass wallet.id for extra safety - backend will block in-app wallets
          const { data } = await api.post('/auth/siwe/payload', {
            address: account.address,
            walletType: wallet.id, // Pass wallet type for backend guard
          })

          console.log('[AUTH] SIWE payload received:', data?.payload)
          console.log('[AUTH] SIWE message:', data?.message)

          if (typeof data?.message !== 'string') {
            throw new Error(
              `[AUTH] data.message is not a string. Got: ${typeof data?.message}`
            )
          }

          // 2) Wallet signs the message
          const signature = await account.signMessage({
            message: data.message,
          })

          // 3) Verify signature + establish session (HttpOnly cookie)
          await api.post('/auth/siwe/verify', {
            payload: data.payload,
            signature,
          })

          console.log('✅ User authenticated via EOA (Flow B)')
        }

        setIsAuthed(true)

        // 4) Sync user profile and referral, if present
        const referralCode = localStorage.getItem('referralCode')
        const url = referralCode
          ? `/users/me?referralCode=${encodeURIComponent(referralCode)}`
          : '/users/me'

        await api.get(url)

        if (referralCode) {
          localStorage.removeItem('referralCode')
        }

        console.log('✅ User synced with backend')
      } catch (err: any) {
        console.error('❌ User sync failed:', err)
        setIsAuthed(false)
      }
    }

    authenticate()
  }, [account, wallet]) // 👈 Include wallet in dependencies

  return isAuthed
}
