import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const response = await adminService.getOverviewStats()
      if (!response.success) throw new Error('Failed to fetch stats')
      return response.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load dashboard statistics" />
  }

  const stats = data || {
    totalRevenue: '0',
    totalCommissions: '0',
    netRevenue: '0',
    pendingWithdrawals: 0,
    pendingWithdrawalsAmount: '0',
    pendingPayments: 0,
    totalUsers: 0,
    totalAgents: 0,
    totalOrders: 0,
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${parseFloat(stats.totalRevenue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: 'From all land sales',
      color: 'bg-green-500/20 border-green-500/50',
    },
    {
      title: 'Net Revenue',
      value: `$${parseFloat(stats.netRevenue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: 'After commissions',
      color: 'bg-blue-500/20 border-blue-500/50',
    },
    {
      title: 'Total Commissions',
      value: `$${parseFloat(stats.totalCommissions).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: 'Paid to agents',
      color: 'bg-purple-500/20 border-purple-500/50',
    },
    {
      title: 'Pending Withdrawals',
      value: stats.pendingWithdrawals.toString(),
      subtitle: `$${parseFloat(stats.pendingWithdrawalsAmount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      color: 'bg-yellow-500/20 border-yellow-500/50',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments.toString(),
      subtitle: 'Awaiting verification',
      color: 'bg-orange-500/20 border-orange-500/50',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      subtitle: `${stats.totalAgents} agents`,
      color: 'bg-pink-500/20 border-pink-500/50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-white/70">Real-time statistics and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} border rounded-xl p-6 backdrop-blur-sm`}
          >
            <h3 className="text-white/70 text-sm font-medium mb-2">{card.title}</h3>
            <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-white/50 text-sm">{card.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

