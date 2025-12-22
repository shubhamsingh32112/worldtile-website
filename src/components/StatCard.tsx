import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  color?: string
  fullWidth?: boolean
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = 'text-blue-500',
  fullWidth = false,
}: StatCardProps) {
  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-5 ${fullWidth ? 'w-full' : ''}`}>
      <Icon className={`w-7 h-7 ${color} mb-3`} />
      <p className="text-gray-400 text-xs mb-2">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

