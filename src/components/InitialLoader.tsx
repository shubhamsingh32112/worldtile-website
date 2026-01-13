import { useEffect, useState } from 'react'

interface InitialLoaderProps {
  visible?: boolean
}

export default function InitialLoader({ visible: controlledVisible }: InitialLoaderProps = {}) {
  const [internalVisible, setInternalVisible] = useState(true)
  const [opacity, setOpacity] = useState(100)

  // If visible prop is provided, use controlled mode; otherwise use auto-hide mode
  const isControlled = controlledVisible !== undefined
  const visible = isControlled ? controlledVisible : internalVisible

  useEffect(() => {
    // Only use auto-hide logic if not controlled
    if (isControlled) return

    const onLoad = () => {
      // match animation duration (2.2s) + small buffer for fade-out
      setTimeout(() => {
        setOpacity(0)
        setTimeout(() => setInternalVisible(false), 300) // fade-out duration
      },3000)
    }

    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => window.removeEventListener('load', onLoad)
  }, [isControlled])

  // Reset opacity when visibility changes in controlled mode
  useEffect(() => {
    if (isControlled && controlledVisible) {
      setOpacity(100)
    }
  }, [isControlled, controlledVisible])

  if (!visible) return null

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-300"
      style={{ opacity: opacity / 100 }}
    >
      <div className="relative w-[60%] max-w-[520px] h-[4px] overflow-hidden bg-white/10">
        <div
          className="
            absolute inset-y-0 w-[40%]
            bg-gradient-to-r from-transparent via-cyan-400 to-transparent
            animate-loader-glow
            shadow-[0_0_12px_rgba(34,211,238,0.9),0_0_28px_rgba(34,211,238,0.6)]
          "
        />
      </div>
    </div>
  )
}

