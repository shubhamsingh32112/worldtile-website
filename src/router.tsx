import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { useActiveAccount } from 'thirdweb/react'
import AppShell from './layouts/AppShell'
import HomePage from './pages/HomePage'
import BuyLandPage from './pages/BuyLandPage'
import DeedsPage from './pages/DeedsPage'
import DeedDetailPage from './pages/DeedDetailPage'
import EarnPage from './pages/EarnPage'
import PaymentPage from './pages/PaymentPage'
import AreaDetailsPage from './pages/AreaDetailsPage'
import AccountPage from './pages/AccountPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import KYCPage from './pages/KYCPage'
import SettingsSupportPage from './pages/SettingsSupportPage'
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
import AdminSupport from './pages/admin/Support'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const account = useActiveAccount()
  
  if (!account) {
    return <Navigate to="/home" replace />
  }
  
  return <>{children}</>
}

function RootRedirect() {
  const [searchParams] = useSearchParams()
  const account = useActiveAccount()
  const refCode = searchParams.get('ref')
  
  // Store referral code in localStorage if present
  if (refCode) {
    localStorage.setItem('referralCode', refCode)
  }
  
  // Redirect to home
  return <Navigate to="/home" replace />
}

function AppRouter() {
  // No loading state needed - thirdweb handles it internally

  return (
    <Routes>
      {/* REF + ROOT HANDLER (no AppShell) */}
      <Route path="/" element={<RootRedirect />} />

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
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings/kyc"
          element={
            <ProtectedRoute>
              <KYCPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings/support"
          element={
            <ProtectedRoute>
              <SettingsSupportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings/terms"
          element={
            <ProtectedRoute>
              <TermsAndConditions />
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
        <Route path="support" element={<AdminSupport />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
