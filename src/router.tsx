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
import PrivacyPolicy from './pages/PrivacyPolicy'
import LoadingSpinner from './components/LoadingSpinner'
import RefundPolicy from './pages/refundPolicy'
import TermsAndConditions from './pages/terms_and_condition'
import AgentProgram from './pages/AgentProgram'
import Support from './pages/Support'
import ContactUs from './pages/ContactUs'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/home" replace />
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
      
      {/* All routes use AppShell, but only some require authentication */}
      <Route path="/" element={<AppShell />}>
        <Route index element={<Navigate to="/home" replace />} />
        {/* Public routes - no authentication required */}
        <Route path="home" element={<HomePage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="terms-and-condition" element={<TermsAndConditions />} />
        <Route path="become-an-agent" element={<AgentProgram />} />
        <Route path="support" element={<Support />} />
        <Route path="contact-us" element={<ContactUs />} />
        
        {/* Protected routes - require authentication */}
        <Route
          path="buy-land"
          element={
            <ProtectedRoute>
              <BuyLandPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="area/:areaKey"
          element={
            <ProtectedRoute>
              <AreaDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="deeds"
          element={
            <ProtectedRoute>
              <DeedsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="deed/:propertyId"
          element={
            <ProtectedRoute>
              <DeedDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="earn"
          element={
            <ProtectedRoute>
              <EarnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/:orderId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default AppRouter
