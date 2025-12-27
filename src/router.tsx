import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
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
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Payments from './pages/admin/Payments'
import Withdrawals from './pages/admin/Withdrawals'
import Earnings from './pages/admin/Earnings'
import Agents from './pages/admin/Agents'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function RootRedirect() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const refCode = searchParams.get('ref')
  
  // If there's a ref parameter and user is not logged in, redirect to signup with it
  if (refCode && !user) {
    return <Navigate to={`/signup?ref=${refCode}`} replace />
  }
  
  // If there's a ref parameter but user is logged in, redirect to home (they don't need signup)
  if (refCode && user) {
    return <Navigate to="/home" replace />
  }
  
  // Otherwise, redirect to home
  return <Navigate to="/home" replace />
}

function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Routes>
      {/* REF + ROOT HANDLER (no AppShell) */}
      <Route path="/" element={<RootRedirect />} />

      {/* AUTH ROUTES (no AppShell) */}
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <SignupPage />} />

      {/* ALL OTHER ROUTES UNDER APPSHELL */}
      <Route element={<AppShell />}>
        <Route path="home" element={<HomePage />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="terms-and-condition" element={<TermsAndConditions />} />
        <Route path="become-an-agent" element={<AgentProgram />} />
        <Route path="support" element={<Support />} />
        <Route path="contact-us" element={<ContactUs />} />

        {/* PROTECTED */}
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

      {/* ADMIN ROUTES (separate layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="payments" element={<Payments />} />
        <Route path="withdrawals" element={<Withdrawals />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="agents" element={<Agents />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
