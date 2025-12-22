import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppShell from './layouts/AppShell'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import HomePage from './pages/HomePage'
import BuyLandPage from './pages/BuyLandPage'
import DeedsPage from './pages/DeedsPage'
import DeedDetailPage from './pages/DeedDetailPage'
import EarnPage from './pages/EarnPage'
import PaymentPage from './pages/PaymentPage'
import AreaDetailsPage from './pages/AreaDetailsPage'
import AccountPage from './pages/AccountPage'
import LoadingSpinner from './components/LoadingSpinner'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <SignupPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="buy-land" element={<BuyLandPage />} />
        <Route path="area/:areaKey" element={<AreaDetailsPage />} />
        <Route path="deeds" element={<DeedsPage />} />
        <Route path="deed/:propertyId" element={<DeedDetailPage />} />
        <Route path="earn" element={<EarnPage />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="payment/:orderId" element={<PaymentPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
