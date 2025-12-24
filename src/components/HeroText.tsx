import { useEffect } from 'react'
import gsap from 'gsap'

export default function HeroText() {
  useEffect(() => {
    gsap.fromTo(
      '.hero-text',
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 1.6,
        delay: 2.6, // camera dolly (2.4s) + breath
        ease: 'power2.out',
      }
    )
  }, [])

  const handleExploreClick = () => {
    const target = document.getElementById('home-hero-section')
    const container = document.getElementById('app-scroll-container')

    if (!target || !container) {
      console.warn('Explore button: target or container not found')
      return
    }

    // Use GSAP to scroll the container to the target element
    gsap.killTweensOf(container)

    // Scroll container to target element with offset for navbar
    gsap.to(container, {
      scrollTo: {
        y: target,
        offsetY: 80, // navbar offset
      },
      duration: 1.2,
      ease: 'power3.inOut',
    })
  }

  return (
    <div
      className="
        hero-text
        pointer-events-auto
        absolute inset-0 z-10
        flex flex-col items-center justify-center
        text-center
        font-inter
        text-[#D6D6D6]
        drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]
        pt-24 md:pt-32
      "
    >
      <h1
        className="
          text-[clamp(2.2rem,4.5vw,3.6rem)]
          font-semibold
          tracking-[-0.02em]
        "
      >
        The Future Isn't Coming. It's Being Built.
      </h1>

      <p
        className="
          mt-3
          max-w-[680px]
          text-[clamp(1rem,1.4vw,1.2rem)]
          font-normal
          leading-relaxed
          text-white/80
        "
      >
        A digital world where ownership, growth, and opportunity begin.
      </p>

      {/* Explore Now Button */}
      <button
        onClick={handleExploreClick}
        className="
          mt-8
          px-8 py-4
          rounded-full
          bg-white/10
          backdrop-blur
          border border-white/20
          text-white font-semibold
          hover:bg-white/20
          hover:scale-[1.03]
          transition-all duration-300
        "
      >
        Explore Now
      </button>
    </div>
  )
}

