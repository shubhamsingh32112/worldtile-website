import LegalLayout from '../components/legal/LegalLayout'
import PolicySection from '../components/legal/PolicySection'

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <PolicySection title="1. Information We Collect">
        <p>We may collect the following personal information:</p>
        <ul className="list-disc list-inside space-y-2 mt-3">
          <li>Full name and email address</li>
          <li>Login credentials (Google OAuth)</li>
          <li>Wallet address for blockchain features</li>
          <li>Phone number (if provided)</li>
          <li>Transaction history and purchase records</li>
          <li>Device information and IP address</li>
          <li>Usage data and interaction with our platform</li>
        </ul>
      </PolicySection>

      <PolicySection title="2. How We Use Your Information">
        <ul className="list-disc list-inside space-y-2">
          <li>Create and manage user accounts</li>
          <li>Verify blockchain transactions</li>
          <li>Prevent fraud and misuse</li>
          <li>Process land purchases and property transactions</li>
          <li>Send transaction confirmations and updates</li>
          <li>Provide customer support</li>
          <li>Improve our services and user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Data Storage and Security">
        <ul className="list-disc list-inside space-y-2">
          <li>We use industry-standard encryption to protect your data</li>
          <li>Personal information is stored on secure servers</li>
          <li>We do not store private keys or sensitive wallet credentials</li>
          <li>Blockchain transactions are immutable and public by design</li>
          <li>We implement access controls and monitoring</li>
          <li>Regular security audits and updates are performed</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Third-Party Services">
        <p>We may use third-party services that collect information:</p>
        <ul className="list-disc list-inside space-y-2 mt-3">
          <li>Google OAuth for authentication</li>
          <li>Payment processors for transactions</li>
          <li>Blockchain networks (Ethereum, Polygon, etc.)</li>
          <li>Analytics services to understand usage patterns</li>
          <li>Cloud hosting providers for data storage</li>
        </ul>
        <p className="mt-3">These services have their own privacy policies governing data collection and use.</p>
      </PolicySection>

      <PolicySection title="5. Cookies and Tracking">
        <ul className="list-disc list-inside space-y-2">
          <li>We use cookies to maintain your session</li>
          <li>Analytics cookies help us improve the platform</li>
          <li>You can disable cookies in your browser settings</li>
          <li>Some features may not work if cookies are disabled</li>
        </ul>
      </PolicySection>

      <PolicySection title="6. Your Rights">
        <ul className="list-disc list-inside space-y-2">
          <li>Access your personal data we hold</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your account and data</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your data in a portable format</li>
          <li>Withdraw consent for data processing</li>
        </ul>
        <p className="mt-3">To exercise these rights, contact us through your account settings or support.</p>
      </PolicySection>

      <PolicySection title="7. Blockchain and Public Data">
        <ul className="list-disc list-inside space-y-2">
          <li>Blockchain transactions are public and permanent</li>
          <li>Wallet addresses and transaction history are visible on-chain</li>
          <li>We cannot delete or modify blockchain records</li>
          <li>Property ownership records are stored on-chain</li>
          <li>This transparency is inherent to blockchain technology</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Data Retention">
        <ul className="list-disc list-inside space-y-2">
          <li>We retain account data while your account is active</li>
          <li>Transaction records are kept for legal compliance</li>
          <li>Blockchain records are permanent and cannot be deleted</li>
          <li>You may request account deletion at any time</li>
          <li>Some data may be retained for legal or security purposes</li>
        </ul>
      </PolicySection>

      <PolicySection title="9. Children's Privacy">
        <p>Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children.</p>
      </PolicySection>

      <PolicySection title="10. Changes to This Policy">
        <ul className="list-disc list-inside space-y-2">
          <li>We may update this privacy policy from time to time</li>
          <li>Significant changes will be notified via email or platform notice</li>
          <li>The "Last updated" date at the top reflects the latest version</li>
          <li>Continued use of the service constitutes acceptance of changes</li>
        </ul>
      </PolicySection>

      <PolicySection title="11. Contact Us">
        <p>If you have questions about this privacy policy or your data:</p>
        <ul className="list-disc list-inside space-y-2 mt-3">
          <li>Contact us through the support section in your account</li>
          <li>Email us at privacy@worldtile.com</li>
          <li>Review your account settings for data management options</li>
        </ul>
      </PolicySection>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

      <div className="text-center text-xs text-gray-500 space-y-2">
        <p>By using Worldtile, you acknowledge that you have read and understood this Privacy Policy.</p>
        <p>This policy is effective as of the last updated date shown above.</p>
      </div>
    </LegalLayout>
  )
}

