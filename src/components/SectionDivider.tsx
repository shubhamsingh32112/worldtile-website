export default function SectionDivider() {
  return (
    <div className="my-4 mx-5 h-0.5 relative">
      {/* Vertical accent lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-1 bg-blue-500/15"
            style={{
              left: `${(i * 100) / 15}%`,
              height: '2px',
            }}
          />
        ))}
      </div>
      
      {/* Main horizontal glowing line */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/80 to-transparent"
        style={{
          backgroundImage: 'linear-gradient(to right, transparent 0%, rgba(59, 130, 246, 0.3) 20%, rgba(59, 130, 246, 0.6) 40%, rgba(59, 130, 246, 0.8) 50%, rgba(59, 130, 246, 0.6) 60%, rgba(59, 130, 246, 0.3) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}

