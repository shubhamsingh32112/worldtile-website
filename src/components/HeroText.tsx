import { useEffect } from 'react'
import gsap from 'gsap'
import { NoiseBackground } from '@/components/ui/noise-background'

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
            onClick={handleExploreClick}
            className="h-full w-full cursor-pointer rounded-full bg-black px-8 py-4 text-white shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)] transition-all duration-100 active:scale-98 font-semibold"
          >
            Explore Now &rarr;
          </button>
        </NoiseBackground>
      </div>
    </div>
  )
}

