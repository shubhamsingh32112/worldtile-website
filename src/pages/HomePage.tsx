import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import CityCard from '../components/CityCard'
import SectionDivider from '../components/SectionDivider'
import GlobeHero from '../components/GlobeHero'
import LightRays from '../components/LightRays'
import CardStack from '../components/CardStack'
import { NoiseBackground } from '@/components/ui/noise-background'
import { Lock, Plus, Minus } from 'lucide-react'

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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
    Own the Future: <span className="text-white bg-clip-text text-transparent">The Digital Land Rush</span>
  </h2>

  <p
    className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-90">
    History is repeating itself. Imagine having the opportunity to buy land in Manhattan or Las Vegas before the skyscrapers were built. That opportunity is here again — but this time, it’s digital.
  </p>

  <p
    className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed opacity-90">
    Welcome to Phase 1 of our Metaverse. We’re building a decentralized world where ownership is absolute and the possibilities for earning are limitless.
  </p>

  <div className="mt-8 flex justify-center">
    <NoiseBackground
      containerClassName="w-fit p-2 rounded-full mx-auto"
      gradientColors={[
        "rgb(255, 100, 150)",
        "rgb(100, 150, 255)",
        "rgb(255, 200, 100)",
      ]}
    >
      <button
        onClick={handleBuyLandClick}
        className="h-full w-full cursor-pointer rounded-full bg-black px-6 py-3 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] transition-all duration-100 active:scale-98 font-semibold"
      >
        Explore the Metaverse &rarr;
      </button>
    </NoiseBackground>
  </div>
</div>




      </div>

      <SectionDivider />

      {/* Card Stack Section */}
      <div className="mb-[150px]">
        <CardStack
          cards={[
            {
              title: "What is World Tile?",
              subtitle: "A hundred years ago, owning land changed people's lives. World Tile brings that same opportunity to the digital world.",
              description: `World Tile is a platform where you can buy digital land early and build virtual offices, shops, schools, and experiences as the digital world grows.

People who bought land early helped shape cities and secured their future.
Now, that opportunity exists again—online.

Owning land today is securing your future in the digital economy.`
            },
            {
              title: "Own Digital Land Before the World Moves In",
              subtitle: "A century ago, land ownership created generational wealth. Today, that opportunity exists again — online.",
              description: `World Tile lets you buy digital land early and build virtual spaces like offices, shops, schools, and experiences as the digital world grows.

Early owners don't just participate — they shape the future.`
            },
            {
              title: "Land Is Where Growth Begins",
              subtitle: "Owning land in World Tile is more than building—it's about growing with the digital economy.",
              description: `As more people and businesses move online, the demand for digital land increases. Early landowners are positioned to grow as the ecosystem expands and new activity flows into the platform.

World Tile also rewards growth through its referral system.
When you invite someone to World Tile and they successfully buy land, you earn 25% commission from that referral.

The more the ecosystem grows, the more opportunities open up—for builders, creators, and early participants.

In World Tile, land is ownership, growth, and participation in a rising digital economy.`
            },
          ]}
        />
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
            <h2 className="text-xl font-bold text-white">Land Value Progression</h2>
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

<div className="relative mt-16 mb-20 px-4 md:px-6 font-inter">
  {/* Dark gradient background */}
  <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-purple-900 rounded-3xl" />
  
  {/* Content container */}
  <div className="relative max-w-4xl mx-auto py-16 px-6 md:px-12">
    {/* FAQ Title */}
    <h2 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-16 tracking-tight font-inter">
      FAQ
    </h2>

    {/* FAQ Items */}
    <div className="space-y-0 font-inter">

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
  {
    q: "Why are INR payments not supported?",
    a: `World Tile currently accepts payments only in USDT to protect users and align with Indian crypto compliance guidelines during Phase-1. Since crypto regulations are still evolving, avoiding direct INR collection reduces regulatory friction and payment issues for users. Using USDT ensures every transaction is recorded on the blockchain, making payments transparent, verifiable, and tamper-proof, so users can independently track and confirm their purchase without delays, chargebacks, or disputes.`
  },
  {
    q: "If I don’t have USDT, how can I pay?",
    a: `If you don’t already have USDT, you can easily buy it using INR through popular crypto apps and exchanges in India. Simply create an account on any supported platform, purchase USDT using UPI or bank transfer, and then send the USDT to the provided wallet address (TRC20 only) to complete your payment. This process usually takes just a few minutes, even for first-time users.`
  },
].map((item, i, arr) => (
        <div key={i}>
          <div 
            className="flex items-center justify-between py-6 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <h3 className="text-white font-medium text-lg md:text-xl pr-4 flex-1">
              {item.q}
            </h3>
            
            {/* Circular button with + icon */}
            <button
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/80 flex items-center justify-center flex-shrink-0 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex(openIndex === i ? null : i)
              }}
            >
              {openIndex === i ? (
                <Minus className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
              )}
            </button>
          </div>

          {/* Answer content */}
          {openIndex === i && (
            <div className="pb-6">
              <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line pr-12">
                {item.a}
              </p>
            </div>
          )}

          {/* Divider line (not after last item) */}
          {i < arr.length - 1 && (
            <div className="h-px bg-gray-500/40 my-2" />
          )}
        </div>
      ))}

    </div>
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
            <NoiseBackground
              containerClassName="w-fit p-2 rounded-full"
              gradientColors={[
                "rgb(255, 100, 150)",
                "rgb(100, 150, 255)",
                "rgb(255, 200, 100)",
              ]}
            >
              <button
                onClick={handleInviteFriendsClick}
                className="h-full w-full cursor-pointer rounded-full bg-black px-6 py-3 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] transition-all duration-100 active:scale-98 font-bold whitespace-nowrap"
              >
                Invite Friends &rarr;
              </button>
            </NoiseBackground>
          </div>
        </GlassCard>
      </div>
        </div>
      </div>
    </>
  )
}