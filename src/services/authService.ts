import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../config/firebase'
import api from './api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  referralCode?: string
}

export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
  firebaseUid?: string
  walletAddress?: string
  role?: 'USER' | 'AGENT' | 'ADMIN'
}

export interface AuthResponse {
  success: boolean
  message: string
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data)
    return response.data
  },

  async getMe(): Promise<{ success: boolean; user: User }> {
    const response = await api.get<{ success: boolean; user: User }>('/auth/me')
    return response.data
  },

  // Wallet-based auth (thirdweb): nonce + sign + verify
  async getWalletNonce(address: string): Promise<{ success: boolean; nonce: string }> {
    const response = await api.get<{ success: boolean; nonce: string }>(`/auth/nonce`, {
      params: { address },
    })
    return response.data
  },

  async verifyWalletLogin(input: {
    address: string
    signature: string
    referralCode?: string
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/verify', input)
    return response.data
  },

  async googleLogin(): Promise<AuthResponse> {
    // Sign in with Google using Firebase
    const result = await signInWithPopup(auth, googleProvider)
    const firebaseUser = result.user

    if (!firebaseUser) {
      throw new Error('Firebase authentication failed')
    }

    // Get Firebase ID token
    const idToken = await firebaseUser.getIdToken()

    // Send user data to backend with Firebase token in Authorization header
    const response = await api.post<AuthResponse>(
      '/auth/google',
      {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        photoUrl: firebaseUser.photoURL || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    )

    return response.data
  },
}

