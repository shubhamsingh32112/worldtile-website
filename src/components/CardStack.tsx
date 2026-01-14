import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useEffect, useState } from "react";

interface CardData {
  title: string;
  subtitle: string;
  description?: string;
}

interface CardStackProps {
  cards: CardData[];
}

export default function CardStack({ cards }: CardStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} style={{ height: "200vh" }} className="relative">
      {cards.map((card, index) => {
        // Cards start visible below each other, then stack on top as you scroll
        // Pure math-based offsets - no index hacks, scales to any number of cards
        const initialOffset = isMobile ? index * 40 : index * 60;
        const finalOffset = isMobile ? index * 10 : index * 15;

        // Slower animation: use a narrower progress range to slow down the stacking
        const y = useTransform(
          scrollYProgress,
          isMobile ? [0, 0.7] : [0, 0.8],
          [initialOffset, finalOffset]
        );

        const scale = useTransform(
          scrollYProgress,
          [0, 1],
          [1 - index * 0.04, 1]
        );

        return (
          <motion.div
            key={index}
            style={{
              y,
              scale,
              position: "sticky",
              top: isMobile ? 20 : 100,
              zIndex: index + 1, // Higher index = higher z-index (stacks on top)
            }}
            className="
              h-[600px] sm:h-[700px] md:h-[800px]
              w-[92vw] sm:w-[380px] md:w-full md:max-w-4xl
              mx-auto rounded-3xl
              backdrop-blur-sm p-6 md:p-8
              text-white
              shadow-[0_40px_80px_rgba(0,0,0,0.4)]
              border border-white/10
              flex flex-col justify-center
              relative overflow-hidden
            "
          >
            {/* Video Background */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/assets/background/WhatsApp Video 2026-01-14 at 2.35.43 AM.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 z-[1]" />
            {/* Content */}
            <div className="relative z-[2]">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                {card.title}
              </h2>
              <p className="text-base md:text-lg font-semibold mb-2 opacity-90">
                {card.subtitle}
              </p>
              {card.description && (
                <p className="text-sm opacity-90 mt-3 leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
