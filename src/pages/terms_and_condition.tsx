import LegalLayout from "@/components/legal/LegalLayout";
import PolicySection from "@/components/legal/PolicySection";

export default function TermsAndConditions() {
  return (
    <LegalLayout title="Terms and Conditions">
      <PolicySection title="Introduction">
        <p>
          Welcome to World Tile (“World Tile”, “we”, “our”, “us”). These Terms
          and Conditions (“Terms”) govern your access to and use of our website,
          mobile application, and related services (collectively, the
          “Platform”).
        </p>
        <p>
          By accessing or using World Tile, you agree to be bound by these
          Terms. If you do not agree, do not use the Platform.
        </p>
      </PolicySection>

      <PolicySection title="1. Eligibility">
        <p>You must:</p>
        <ul className="list-disc list-inside">
          <li>Be at least 18 years old</li>
          <li>Have the legal capacity to enter into a binding agreement</li>
        </ul>
        <p>
          By using World Tile, you confirm that you meet these requirements.
        </p>
      </PolicySection>

      <PolicySection title="2. Nature of the Platform">
        <p>World Tile is a virtual digital asset platform that provides:</p>
        <ul className="list-disc list-inside">
          <li>Simulated virtual land</li>
          <li>In-platform digital assets</li>
          <li>NFTs representing ownership within the World Tile ecosystem only</li>
        </ul>

        <p className="mt-3 font-medium text-white/90">
          Important Clarification:
        </p>
        <ul className="list-disc list-inside">
          <li>Virtual land does not represent real-world property</li>
          <li>No legal, governmental, or physical ownership rights are granted</li>
          <li>Assets have no guaranteed financial value</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Account Registration">
        <p>To use certain features, you must create an account.</p>
        <p>You agree to:</p>
        <ul className="list-disc list-inside">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
        <p>
          World Tile is not responsible for unauthorized access caused by user
          negligence.
        </p>
      </PolicySection>

      <PolicySection title="4. Payments & Cryptocurrency">
        <p className="font-medium text-white/90">4.1 Accepted Payments</p>
        <ul className="list-disc list-inside">
          <li>Cryptocurrency payments (e.g., USDT on TRC20) may be used</li>
          <li>Payment methods may change without notice</li>
        </ul>

        <p className="font-medium text-white/90 mt-4">
          4.2 Blockchain Responsibility
        </p>
        <ul className="list-disc list-inside">
          <li>Blockchain transactions are irreversible</li>
          <li>
            Sending funds to the wrong address or network may result in
            permanent loss
          </li>
          <li>World Tile does not control blockchain networks</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Pricing & Fees">
        <ul className="list-disc list-inside">
          <li>Prices for virtual assets are displayed before purchase</li>
          <li>Fees may change at any time</li>
          <li>Taxes (if applicable) are the user’s responsibility</li>
        </ul>
      </PolicySection>

      <PolicySection title="6. No Refunds">
        <p>
          All purchases are final and non-refundable, except where required by
          law or explicitly stated otherwise in our Refund Policy.
        </p>
      </PolicySection>

      <PolicySection title="7. NFTs & Digital Assets">
        <ul className="list-disc list-inside">
          <li>NFTs are minted and assigned after confirmed payment</li>
          <li>NFTs may be transferred only where technically supported</li>
          <li>Ownership is limited to platform functionality</li>
        </ul>
        <p>World Tile does not guarantee:</p>
        <ul className="list-disc list-inside">
          <li>Liquidity</li>
          <li>Market value</li>
          <li>Future resale opportunities</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Referrals & Rewards">
        <p>World Tile may offer referral or reward programs.</p>
        <p>We reserve the right to:</p>
        <ul className="list-disc list-inside">
          <li>Modify or cancel such programs</li>
          <li>Withhold rewards in cases of fraud or abuse</li>
          <li>Adjust payouts at our discretion</li>
        </ul>
      </PolicySection>

      <PolicySection title="9. Prohibited Activities">
        <p>You agree not to:</p>
        <ul className="list-disc list-inside">
          <li>Use the Platform for illegal activities</li>
          <li>Attempt to exploit or manipulate the system</li>
          <li>Provide false payment or transaction information</li>
          <li>Engage in money laundering or fraud</li>
          <li>Reverse engineer or interfere with platform security</li>
        </ul>
        <p>
          Violation may result in suspension or permanent account termination.
        </p>
      </PolicySection>

      <PolicySection title="10. Suspension & Termination">
        <p>
          World Tile may suspend or terminate your account without notice if:
        </p>
        <ul className="list-disc list-inside">
          <li>You violate these Terms</li>
          <li>We detect suspicious or fraudulent activity</li>
          <li>Required by law or regulation</li>
        </ul>
        <p>Termination does not entitle you to a refund.</p>
      </PolicySection>

      <PolicySection title="11. Intellectual Property">
        <p>All Platform content, including:</p>
        <ul className="list-disc list-inside">
          <li>Logos</li>
          <li>Designs</li>
          <li>Code</li>
          <li>Visual assets</li>
        </ul>
        <p>
          are owned by or licensed to World Tile and may not be used without
          permission.
        </p>
      </PolicySection>

      <PolicySection title="12. Disclaimer of Warranties">
        <p>World Tile is provided “as is” and “as available”.</p>
        <p>We make no warranties regarding:</p>
        <ul className="list-disc list-inside">
          <li>Platform availability</li>
          <li>Accuracy of information</li>
          <li>Financial outcomes</li>
          <li>Asset appreciation</li>
        </ul>
      </PolicySection>

      <PolicySection title="13. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, World Tile shall not be liable
          for:
        </p>
        <ul className="list-disc list-inside">
          <li>Financial losses</li>
          <li>Loss of digital assets</li>
          <li>Blockchain failures</li>
          <li>Indirect or consequential damages</li>
        </ul>
      </PolicySection>

      <PolicySection title="14. Risk Acknowledgment">
        <p>You acknowledge and accept that:</p>
        <ul className="list-disc list-inside">
          <li>Digital assets are volatile</li>
          <li>Regulatory environments may change</li>
          <li>Participation involves risk</li>
        </ul>
        <p>You use the Platform at your own risk.</p>
      </PolicySection>

      <PolicySection title="15. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws
          of India (or your applicable jurisdiction), without regard to conflict
          of law principles.
        </p>
      </PolicySection>

      <PolicySection title="16. Changes to Terms">
        <p>
          We may update these Terms at any time. Continued use of the Platform
          constitutes acceptance of the revised Terms.
        </p>
      </PolicySection>

      <PolicySection title="17. Contact Information">
        <p>For questions or concerns regarding these Terms, contact:</p>
        <p className="mt-2">
          <strong>World Tile</strong><br />
          📧 support@worldtile.io<br />
          🌐 https://worldtile.io
        </p>
      </PolicySection>
    </LegalLayout>
  )
}
