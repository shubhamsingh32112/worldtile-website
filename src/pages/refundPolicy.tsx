import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import LegalLayout from "@/components/legal/LegalLayout";
import PolicySection from "@/components/legal/PolicySection";
import { ArrowLeft } from 'lucide-react'

export default function RefundPolicy() {
  const navigate = useNavigate()
  const location = useLocation()
  const isFromSettings = location.pathname.startsWith('/settings')
  
  // Show back button if NOT from settings (i.e., from footer or direct access)
  const showBackButton = !isFromSettings

  // Scroll to top on mount
  useEffect(() => {
    const scrollContainer = document.getElementById('app-scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {showBackButton && (
        <div className="mx-auto max-w-[900px] px-4 pt-8 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}
      <LegalLayout title="Refund Policy">
      <PolicySection title="Introduction">
        <p>
          Thank you for using World Tile (“we”, “our”, “us”). This Refund Policy
          explains the circumstances under which refunds may or may not be
          issued for purchases made on our platform.
        </p>
        <p>
          By using World Tile, you acknowledge and agree to this Refund Policy.
        </p>
      </PolicySection>

      <PolicySection title="1. Nature of Products">
        <p>World Tile offers virtual digital assets, including:</p>
        <ul className="list-disc list-inside">
          <li>Virtual land plots</li>
          <li>In-platform digital items</li>
          <li>NFTs representing ownership within the World Tile ecosystem</li>
        </ul>
        <p>
          All purchases are digital, virtual, and non-physical in nature.
        </p>
      </PolicySection>

      <PolicySection title="2. No Refund Policy (Primary Rule)">
        <p className="font-semibold text-red-400 mb-2">
          🚫 All sales are FINAL
        </p>
        <p>
          Once a payment is successfully completed and confirmed on the
          blockchain:
        </p>
        <ul className="list-disc list-inside">
          <li>No refunds</li>
          <li>No cancellations</li>
          <li>No chargebacks</li>
          <li>No reversals</li>
        </ul>

        <p className="mt-3">This applies to:</p>
        <ul className="list-disc list-inside">
          <li>Cryptocurrency payments (e.g., USDT on TRC20)</li>
          <li>NFT minting</li>
          <li>Virtual land allocation</li>
          <li>In-game or platform-based purchases</li>
        </ul>

        <p>
          Blockchain transactions are irreversible by design.
        </p>
      </PolicySection>

      <PolicySection title="3. Incorrect Payments">
        <p>World Tile is not responsible for losses due to:</p>
        <ul className="list-disc list-inside">
          <li>Sending funds to the wrong wallet address</li>
          <li>Using an unsupported blockchain network</li>
          <li>Sending an incorrect amount</li>
          <li>Providing an incorrect or invalid transaction hash (TXID)</li>
        </ul>
        <p>Such transactions cannot be refunded.</p>
      </PolicySection>

      <PolicySection title="4. Duplicate Payments">
        <p>
          If a user accidentally sends multiple payments for the same purchase,
          we may, at our sole discretion, either:
        </p>
        <ul className="list-disc list-inside">
          <li>Allocate equivalent virtual assets, or</li>
          <li>Credit the excess value to the user’s in-platform account</li>
        </ul>
        <p>Refunds are not guaranteed in such cases.</p>
      </PolicySection>

      <PolicySection title="5. Failed or Pending Transactions">
        <p>If a transaction:</p>
        <ul className="list-disc list-inside">
          <li>Fails on the blockchain, or</li>
          <li>Is not confirmed due to network issues</li>
        </ul>
        <p>
          No assets will be issued, and the matter must be resolved on the
          blockchain network itself.
        </p>
        <p>
          World Tile does not control blockchain confirmation speeds or failures.
        </p>
      </PolicySection>

      <PolicySection title="6. Platform Errors (Limited Exception)">
        <p>
          A refund or correction may be considered only if:
        </p>
        <ul className="list-disc list-inside">
          <li>A verified technical error occurs on our side after successful payment, and</li>
          <li>The purchased asset was not delivered</li>
        </ul>
        <p>In such cases, our obligation is limited to:</p>
        <ul className="list-disc list-inside">
          <li>Re-issuing the asset, or</li>
          <li>Providing platform credit</li>
        </ul>
        <p>
          Cash or crypto refunds remain exceptional and discretionary.
        </p>
      </PolicySection>

      <PolicySection title="7. Fraud & Abuse">
        <p>We reserve the right to:</p>
        <ul className="list-disc list-inside">
          <li>Refuse refunds</li>
          <li>Suspend accounts</li>
          <li>Reverse asset allocations (where technically possible)</li>
        </ul>
        <p>If we detect:</p>
        <ul className="list-disc list-inside">
          <li>Fraudulent activity</li>
          <li>Abuse of the system</li>
          <li>Violation of Terms & Conditions</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. User Responsibility">
        <p>By making a purchase, you confirm that:</p>
        <ul className="list-disc list-inside">
          <li>You understand the nature of virtual digital assets</li>
          <li>You accept the volatility and risk involved</li>
          <li>You have verified all payment details before sending funds</li>
        </ul>
      </PolicySection>

      <PolicySection title="9. Changes to This Policy">
        <p>
          We may update this Refund Policy at any time. Updates will be posted
          with a revised “Last Updated” date.
        </p>
        <p>
          Continued use of World Tile constitutes acceptance of the updated
          policy.
        </p>
      </PolicySection>

      <PolicySection title="10. Contact Us">
        <p>If you have questions regarding this Refund Policy, contact us at:</p>
        <p className="mt-2">
          <strong>World Tile</strong><br />
          📧 support@worldtile.io<br />
          🌐 https://worldtile.io
        </p>
      </PolicySection>
      </LegalLayout>
    </div>
  )
}
