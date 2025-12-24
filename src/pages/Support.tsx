import LegalLayout from '../components/legal/LegalLayout'
import PolicySection from '../components/legal/PolicySection'

export default function Support() {
  return (
    <LegalLayout title="World Tile Support">
      {/* Intro */}
      <PolicySection title="How Can We Help?">
        <p>
          We're here to help you get the best experience on World Tile.
        </p>
        <p>
          Before contacting support, please review the sections below — most
          questions are answered instantly.
        </p>
      </PolicySection>

      {/* Payments */}
      <PolicySection title="Payments & Transactions">
        <ul className="list-disc list-inside space-y-2">
          <li>Only USDT (TRC20) payments are supported</li>
          <li>Blockchain transactions are irreversible</li>
          <li>Always double-check the wallet address and network</li>
          <li>Transaction confirmation may take time depending on network load</li>
        </ul>
        <p className="text-gray-400 mt-3">
          Payments sent on the wrong network cannot be recovered.
        </p>
      </PolicySection>

      {/* Virtual land */}
      <PolicySection title="Virtual Land & Ownership">
        <ul className="list-disc list-inside space-y-2">
          <li>All land on World Tile is virtual</li>
          <li>It does not represent real-world property</li>
          <li>Ownership applies only within the World Tile platform</li>
          <li>NFTs act as proof of ownership inside the ecosystem</li>
        </ul>
      </PolicySection>

      {/* NFTs */}
      <PolicySection title="NFT Issues">
        <ul className="list-disc list-inside space-y-2">
          <li>NFTs are minted after successful payment confirmation</li>
          <li>Delays may occur during high network traffic</li>
          <li>Ensure your wallet address is correct</li>
        </ul>
        <p className="mt-3">
          If an NFT is not received after confirmation, contact support with
          your transaction hash (TXID).
        </p>
      </PolicySection>

      {/* Referrals */}
      <PolicySection title="Referral & Rewards">
        <ul className="list-disc list-inside space-y-2">
          <li>Referral rewards are credited after successful purchases</li>
          <li>Fraudulent or self-referrals are not allowed</li>
          <li>Rewards may be adjusted or revoked in case of misuse</li>
        </ul>
      </PolicySection>

      {/* Account */}
      <PolicySection title="Account & Login">
        <ul className="list-disc list-inside space-y-2">
          <li>You can sign in using email or Google login</li>
          <li>Keep your credentials secure</li>
          <li>World Tile does not store wallet private keys</li>
        </ul>
      </PolicySection>

      {/* Contact */}
      <PolicySection title="Contact Support">
        <p>If you still need help, reach out to us:</p>
        <p className="mt-3">
          <strong>Email:</strong> support@worldtile.io
        </p>
        <p className="mt-3 text-gray-400">
          Support Hours: Monday – Saturday<br />
          Response Time: Within 24–48 hours
        </p>

        <p className="mt-4">When contacting support, please include:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Registered email address</li>
          <li>Transaction Hash (TXID), if applicable</li>
          <li>Clear description of the issue</li>
        </ul>
      </PolicySection>

      {/* Security */}
      <PolicySection title="Important Security Notice">
        <p className="mb-2">
          World Tile will never ask for:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Wallet private keys</li>
          <li>Seed phrases</li>
          <li>OTPs or passwords</li>
        </ul>
        <p className="text-gray-400 mt-3">
          If anyone claims to be World Tile support and asks for these details,
          it is a scam.
        </p>
      </PolicySection>

      {/* Legal */}
      <PolicySection title="Legal & Policies">
        <p>Please review:</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
          <li>Refund Policy</li>
        </ul>
        <p className="mt-3">
          These documents govern your use of the platform.
        </p>
      </PolicySection>

      {/* Updates */}
      <PolicySection title="Platform Updates">
        <p>
          We are continuously improving World Tile.
        </p>
        <p>
          Follow official announcements on our website for feature updates and
          maintenance notices.
        </p>
      </PolicySection>

      {/* Abuse */}
      <PolicySection title="Report Abuse or Fraud">
        <p>
          If you notice suspicious activity, phishing attempts, or abuse:
        </p>
        <p className="mt-3">
          📧 <strong>security@worldtile.io</strong>
        </p>
      </PolicySection>
    </LegalLayout>
  )
}

