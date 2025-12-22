import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  padding?: string
  backgroundColor?: string
  onClick?: () => void
}

export default function GlassCard({
  children,
  className = '',
  padding = 'p-6',
  backgroundColor = 'bg-white/12',
  onClick,
}: GlassCardProps) {
  const baseClasses = `
    rounded-3xl
    border
    border-white/20
    backdrop-blur-md
    shadow-lg
    ${padding}
    ${backgroundColor}
    ${onClick ? 'cursor-pointer hover:bg-white/15 transition-all' : ''}
    ${className}
  `

  return (
    <div className={baseClasses.trim()} onClick={onClick}>
      {children}
    </div>
  )
}

