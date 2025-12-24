import { ReactNode } from 'react'

export default function LegalLayout({ 
  title, 
  children 
}: { 
  title: string
  children: ReactNode 
}) {
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[900px] px-4 py-16">
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
          {title}
        </h1>

        <p className="text-sm text-gray-500 mb-10">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-10">
          {children}
        </div>
      </div>
    </div>
  )
}

