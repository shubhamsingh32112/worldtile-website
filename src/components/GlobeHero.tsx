import LandPointGlobe from './LandPointGlobe'
import HeroText from './HeroText'

export default function GlobeHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      <HeroText />
      <LandPointGlobe />
      {/* top vignette fade */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
  
    
    </div>
  )
}

