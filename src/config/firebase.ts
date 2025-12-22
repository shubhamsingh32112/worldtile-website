import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate Firebase config
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
  throw new Error(
    'Firebase API key is missing. Please add VITE_FIREBASE_API_KEY to your .env file and restart the dev server.'
  )
}

// Log config in development (without exposing full values)
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
  })
}

let app
try {
  app = initializeApp(firebaseConfig)
} catch (error: any) {
  console.error('Firebase initialization error:', error)
  throw new Error(
    `Firebase initialization failed: ${error.message}. ` +
    'Please verify your Firebase credentials in .env file match the web app configuration in Firebase Console.'
  )
}

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

