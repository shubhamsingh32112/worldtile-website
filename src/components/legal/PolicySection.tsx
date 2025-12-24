import { ReactNode } from 'react'

export default function PolicySection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-white mb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-300">
        {children}
      </div>
    </section>
  )
}

