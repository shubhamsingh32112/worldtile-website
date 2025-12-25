import { useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard'
import CityCard from '../components/CityCard'
import SectionDivider from '../components/SectionDivider'
import GlobeHero from '../components/GlobeHero'
import LightRays from '../components/LightRays'
import { Lock, MessageSquare, Zap, TrendingUp, Users } from 'lucide-react'

interface City {
  name: string
  change: string
  price: string
  isPositive: boolean
  imagePath?: string
  stateKey: string
}

const getCityImagePath = (cityName: string): string => {
  const name = cityName.toLowerCase()
  switch (name) {
    case 'bangalore':
      return '/images/banaglore.jpeg'
    case 'pune':
      return '/images/pune.jpeg'
    case 'jaipur':
      return '/images/jaipur.jpeg'
    case 'delhi':
      return '/images/delhi.jpeg'
    default:
      return ''
  }
}

const TOP_CITIES: City[] = [
  { name: 'Bangalore', change: '+12.5%', price: '110 USDT', isPositive: true, stateKey: 'karnataka', imagePath: getCityImagePath('Bangalore') },
  { name: 'Pune', change: '+8.3%', price: '110 USDT', isPositive: true, stateKey: 'maharashtra', imagePath: getCityImagePath('Pune') },
  { name: 'Jaipur', change: '+7%', price: '110 USDT', isPositive: true, stateKey: 'rajasthan', imagePath: getCityImagePath('Jaipur') },
  { name: 'Delhi', change: '+14%', price: '110 USDT', isPositive: true, stateKey: 'NCTofDelhi', imagePath: getCityImagePath('Delhi') },
]

export default function HomePage() {
  const navigate = useNavigate()

  const handleCityCardTap = (city: City) => {
    // Navigate to Buy Land page
    navigate('/buy-land')
    
    // Store state key in sessionStorage for the map to use
    sessionStorage.setItem('selectedStateKey', city.stateKey)
    
    // Small delay to let the map load, then trigger state selection
    setTimeout(() => {
      // The BuyLandPage will check for this and show the areas
      window.dispatchEvent(new CustomEvent('showStateAreas', { detail: { stateKey: city.stateKey } }))
    }, 500)
  }

  const handleBuyLandClick = () => {
    navigate('/buy-land')
  }

  const handleInviteFriendsClick = () => {
    navigate('/earn')
  }

  return (
    <>
      {/* HERO + BACKGROUND FX */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Light Rays Background */}
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="white"
            raysSpeed={1.2}
            lightSpread={1}
            rayLength={1.1}
            followMouse={true}
            mouseInfluence={0.06}
            noiseAmount={0.05}
            distortion={0.03}
            className="opacity-100"
          />
        </div>
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        {/* Globe stays above rays */}
        <div className="relative z-10">
          <GlobeHero />
        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="relative z-10 py-8">
        <div className="mx-auto w-full max-w-[1000px] px-4 md:px-6">


      <SectionDivider />

      {/* Feature Cards Section */}
      <div id="home-hero-section" className="mb-4">
      <div className="mb-16 text-center px-4">
  <h2
    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
    Own the Future: <span className="bg-purple-600 bg-clip-text text-transparent">The Digital Land Rush</span>
  </h2>

  <p
    className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90">
    History is repeating itself. Imagine having the opportunity to buy land in Manhattan or Las Vegas before the skyscrapers were built. That opportunity is here again — but this time, it’s digital.
  </p>

  <p
    className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
    Welcome to Phase 1 of our Metaverse. We’re building a decentralized world where ownership is absolute and the possibilities for earning are limitless.
  </p>

  <div className="mt-8">
    <button onClick={handleBuyLandClick} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform">
      Explore the Metaverse
    </button>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 max-w-5xl mx-auto">

  {/* Card 1 */}
  <GlassCard padding="p-6" backgroundColor="bg-white/10">
    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-600/30">
      <MessageSquare className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">Why Digital Real Estate?</h3>
    <p className="text-sm text-gray-300 leading-relaxed mb-3">
      The world is moving online. Major brands and investors are claiming space in the Metaverse.
      Owning land today is securing your future in the digital economy.
    </p>
    <p className="text-sm font-semibold text-purple-400 mt-2">💰 $100 Per Acre (Phase 1 Launch Price)</p>
  </GlassCard>

  {/* Card 2 */}
  <GlassCard padding="p-6" backgroundColor="bg-white/10">
    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-600/30">
      <TrendingUp className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">Endless Earning Potential</h3>
    <ul className="text-sm text-gray-300 space-y-2 mb-4">
      <li>📈 Buy low today, sell high tomorrow</li>
      <li>🏢 Lease land to creators & brands</li>
      <li>🛒 Open virtual storefronts</li>
      <li>🎟️ Host concerts, galleries & workshops</li>
      <li>🖼️ Monetize traffic with ads</li>
    </ul>
    <p className="text-sm font-semibold text-purple-400">Your land = your revenue engine.</p>
  </GlassCard>

  {/* Card 3 */}
  <GlassCard padding="p-6" backgroundColor="bg-white/10">
    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-600/30">
      <Users className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">25% Referral Bonus</h3>
    <p className="text-sm text-gray-300 leading-relaxed mb-4">
      Earn <span className="font-semibold text-purple-400">$25 per acre</span> sold through your link.
      No limits. Convert your social network into net worth.
    </p>
    <ul className="text-sm text-gray-300 space-y-1">
      <li>🚀 Uncapped earnings</li>
      <li>📊 Track payouts live</li>
      <li>🔗 Share your link & earn</li>
    </ul>
  </GlassCard>

  {/* Card 4 */}
  <GlassCard padding="p-6" backgroundColor="bg-white/10">
    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-purple-600/30">
      <Zap className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">Don’t Watch From The Sidelines</h3>
    <p className="text-sm text-gray-300 leading-relaxed mb-6">
      The revolution is happening. This is your chance to own a stake in the foundation of a new world.
      Don’t wait for “someday.” Build today.
    </p>
    <button onClick={handleBuyLandClick} className="w-full py-3 bg-purple-600  rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition">
      Secure Your Land @ $100/Acre
    </button>
  </GlassCard>

</div>


      </div>

      <SectionDivider />

      {/* Top Cities Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-white mb-4">Top Cities</h2>
        <div className="overflow-x-auto">
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            {TOP_CITIES.map((city) => (
              <CityCard
                key={city.name}
                name={city.name}
                change={city.change}
                price={city.price}
                isPositive={city.isPositive}
                imagePath={city.imagePath}
                onClick={() => handleCityCardTap(city)}
              />
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Markets to Invest In */}
      <div className="mb-4">
        <GlassCard padding="p-6" backgroundColor="bg-white/3 opacity-75">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-xl font-bold text-white">Markets to Invest In</h2>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          
          {/* Markets image */}
          <div className="h-[200px] md:h-[300px] lg:h-[350px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/15">
            <img
              src="/images/markets.jpeg"
              alt="Markets to Invest In"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Hide image on error, fallback gradient will show
                const target = e.currentTarget as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            {/* Opacity overlay */}
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Lock className="w-16 h-16 md:w-20 md:h-20 text-gray-300 opacity-80" />
            </div>
          </div>
        </GlassCard>
      </div>

 
{/* FAQ SECTION */}
<SectionDivider />

<div className="mt-16 mb-20 px-4 max-w-4xl mx-auto">
  <h2 className="text-4xl font-extrabold text-white text-center mb-3 tracking-tight">
    Frequently asked questions
  </h2>
  <p className="text-gray-400 text-center mb-10">
    Everything you need to know
  </p>

  <div className="space-y-4">

{[
  {
    q: "Why should I join World Tile now?",
    a: `Because World Tile is where the future starts early. Just like the early internet or early crypto platforms, World Tile begins with securing digital land first. As the platform evolves, this land becomes part of a living digital world where people meet, work, attend events, explore, and connect virtual experiences with real life.

    Joining now means being early in the world that’s being built next.`
  },
  {
    q: "How do I make a crypto payment to buy a tile on World Tile?",
    a: `Select your land, proceed to payment, and you will see a QR and wallet address. Scan using MetaMask, Trust Wallet, Binance, KuCoin or copy the address manually.

    Send 110 USDT on TRC20 (TRX) ONLY. Payments on the wrong network cannot be recovered.

    After sending, click “I’ve Paid”. The system verifies your transaction on-chain within seconds and allots your tile automatically.`
  },
  {
    q: "What do I receive after buying a tile?",
    a: `Once confirmed, your tile is instantly linked to your account. You receive a digital land deed and — where applicable — an NFT token as blockchain-proof of ownership.`
  },
  {
    q: "How do agents earn and withdraw their commissions?",
    a: `Agents earn 25% per sale via referral. No joining fees. Commissions credit after confirmation and can be withdrawn in supported crypto once minimum withdrawal amount is reached.`
  },
  {
    q: "What makes World Tile different from other virtual worlds?",
    a: `World Tile blends a digital map with real-world relevance — meetings, events, entertainment, commerce and branded experiences. Accessible via web, mobile, and future AR/VR support.`
  },
].map((item, i) => (
  <details
    key={i}
    className="group bg-white/[0.06] border border-white/[0.08] hover:border-white/20 backdrop-blur-xl rounded-2xl p-6 transition-all duration-300
               open:shadow-[0_0_20px_rgba(255,255,255,0.1)] open:scale-[1.01]"
  >
    <summary className="flex items-center justify-between cursor-pointer list-none">
      <h3 className="text-white font-semibold text-lg">{item.q}</h3>
      
      {/* +/- ICON */}
      <span className="text-gray-300 text-2xl font-bold w-6 h-6 flex items-center justify-center
                      transition-transform group-open:rotate-180">
        <span className="group-open:hidden select-none">+</span>
        <span className="hidden group-open:block select-none">−</span>
      </span>
    </summary>

    <p className="mt-4 text-gray-300 text-[0.95rem] leading-relaxed whitespace-pre-line">
      {item.a}
    </p>
  </details>
))}

</div>

</div>

      {/* Rewards/Referral Strip */}
      <div className="mb-4">
        <GlassCard padding="p-5" backgroundColor="bg-blue-500/6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                Earn flat 25% incentive per user
              </h3>
              <p className="text-sm text-gray-400">Invite friends and earn</p>
            </div>
            <button
              onClick={handleInviteFriendsClick}
              className="px-6 py-3 bg-purple-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors whitespace-nowrap"
            >
              Invite Friends
            </button>
          </div>
        </GlassCard>
      </div>
        </div>
      </div>
    </>
  )
}