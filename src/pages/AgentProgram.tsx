import { useNavigate } from 'react-router-dom'
import LegalLayout from '../components/legal/LegalLayout'
import PolicySection from '../components/legal/PolicySection'

export default function AgentProgram() {
  const navigate = useNavigate()

  return (
    <LegalLayout title="Become a World Tile Agent">
      {/* Intro */}
      <PolicySection title="Join the World Tile Agent Program">
        <p>
          Join the World Tile Agent Program and earn real rewards by helping
          users enter the future of virtual digital land.
        </p>
        <p>
          As an agent, you become a key part of the World Tile ecosystem —
          earning commissions, bonuses, and early access benefits.
        </p>
      </PolicySection>

      {/* Who is an agent */}
      <PolicySection title="Who Is a World Tile Agent?">
        <p>A World Tile Agent is an independent promoter who:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Introduces new users to World Tile</li>
          <li>Shares their unique referral code</li>
          <li>Earns commissions on successful land purchases</li>
        </ul>

        <p className="mt-3">
          No inventory. No upfront cost. No technical skills required.
        </p>
      </PolicySection>

      {/* Earnings */}
      <PolicySection title="How You Earn">
        <p className="font-medium text-white/90">Referral Commission</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Earn up to 25% commission on every successful purchase</li>
          <li>Commissions are calculated automatically</li>
        </ul>

        <p className="font-medium text-white/90 mt-4">
          Performance Bonuses
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Milestone rewards for top-performing agents</li>
          <li>Limited-time incentives during new land releases</li>
        </ul>

        <p className="font-medium text-white/90 mt-4">
          Transparent Tracking
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>View referrals, sales, and earnings in your dashboard</li>
          <li>Track weekly and lifetime earnings</li>
        </ul>
      </PolicySection>

      {/* How it works */}
      <PolicySection title="How It Works">
        <ol className="list-decimal list-inside space-y-2">
          <li>
            <strong>Sign Up as an Agent</strong> — Create your World Tile account
            and enable agent access.
          </li>
          <li>
            <strong>Get Your Unique Referral Code</strong> — Share it with your
            network, community, or audience.
          </li>
          <li>
            <strong>Users Purchase Virtual Land</strong> — Purchases are tracked
            instantly.
          </li>
          <li>
            <strong>Earn Rewards</strong> — Earnings are credited after
            successful blockchain confirmation.
          </li>
        </ol>
      </PolicySection>

      {/* Dashboard */}
      <PolicySection title="Agent Dashboard Features">
        <ul className="list-disc list-inside space-y-2">
          <li>Total users referred</li>
          <li>Successful sales count</li>
          <li>Earnings summary</li>
          <li>Withdrawal history</li>
          <li>Real-time referral tracking</li>
        </ul>
      </PolicySection>

      {/* Eligibility */}
      <PolicySection title="Who Can Become an Agent?">
        <p>You're a great fit if you are:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>A digital marketer or community builder</li>
          <li>A crypto or Web3 enthusiast</li>
          <li>A content creator or influencer</li>
          <li>Someone with a strong local or online network</li>
        </ul>
        <p className="mt-2">Anyone 18 years or older can apply.</p>
      </PolicySection>

      {/* Guidelines */}
      <PolicySection title="Important Agent Guidelines">
        <ul className="list-disc list-inside space-y-2">
          <li>Provide accurate information about World Tile</li>
          <li>No false promises or guaranteed returns</li>
          <li>No impersonation of official staff</li>
          <li>No misleading financial claims</li>
        </ul>
        <p className="mt-3">
          Violations may result in removal from the program and forfeiture of
          rewards.
        </p>
      </PolicySection>

      {/* Payout */}
      <PolicySection title="Payout & Compliance">
        <ul className="list-disc list-inside space-y-2">
          <li>Payouts are made in supported cryptocurrency</li>
          <li>All blockchain transactions are final</li>
          <li>
            World Tile reserves the right to withhold payouts in cases of fraud
            or abuse
          </li>
        </ul>
      </PolicySection>

      {/* Why join */}
      <PolicySection title="Why Join Early?">
        <ul className="list-disc list-inside space-y-2">
          <li>Early-agent advantage</li>
          <li>Higher visibility in the ecosystem</li>
          <li>Priority access to future programs</li>
          <li>Be part of a growing virtual digital asset platform</li>
        </ul>
      </PolicySection>

      {/* CTA */}
      <PolicySection title="Apply Now">
        <p className="mb-4">
          Ready to become a World Tile Agent?
        </p>

        <button
          onClick={() => navigate('/earn')}
          className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          Become an Agent
        </button>

        <p className="text-sm text-gray-400 mt-3">
          Sign up • Get your referral code • Start earning
        </p>
      </PolicySection>

      {/* Disclaimer */}
      <PolicySection title="Disclaimer">
        <p className="text-gray-400">
          World Tile offers virtual digital assets only. No real-world property
          ownership or guaranteed income is involved.
        </p>
      </PolicySection>
    </LegalLayout>
  )
}

