import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'

export default function Earnings() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all')

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminEarnings', period],
    queryFn: async () => {
      const response = await adminService.getBusinessEarnings({ period })
      if (!response.success) throw new Error('Failed to fetch earnings')
      return response.data
    },
  })

  const handleExportCSV = () => {
    if (!data?.orders) return

    const headers = ['Date', 'User', 'Email', 'Amount', 'State', 'Place', 'Quantity', 'TxHash']
    const rows = data.orders.map((order) => [
      new Date(order.paidAt).toLocaleDateString(),
      order.user.name,
      order.user.email,
      order.amount,
      order.state,
      order.place,
      order.quantity.toString(),
      order.txHash || '',
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `earnings-${period}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load earnings" />
  }

  const summary = data?.summary || {
    totalRevenue: '0',
    totalCommissions: '0',
    netRevenue: '0',
    orderCount: 0,
    commissionCount: 0,
    period: 'all',
  }
  const orders = data?.orders || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Business Earnings</h2>
          <p className="text-white/70">Platform revenue and financial overview</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          Export CSV
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2">
        {(['daily', 'weekly', 'monthly', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg transition ${
              period === p
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-white/70 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">
            ${parseFloat(summary.totalRevenue).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-white/50 text-sm mt-1">{summary.orderCount} orders</p>
        </div>
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-white/70 text-sm font-medium mb-2">Total Commissions</h3>
          <p className="text-3xl font-bold text-white">
            ${parseFloat(summary.totalCommissions).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-white/50 text-sm mt-1">{summary.commissionCount} payouts</p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-white/70 text-sm font-medium mb-2">Net Revenue</h3>
          <p className="text-3xl font-bold text-white">
            ${parseFloat(summary.netRevenue).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-white/50 text-sm mt-1">After commissions</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  TxHash
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                    No orders found for this period
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(order.paidAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{order.user.name}</div>
                      <div className="text-sm text-white/50">{order.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      ${parseFloat(order.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {order.state} / {order.place}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.txHash ? (
                        <div className="text-sm text-white/70 font-mono">
                          {order.txHash.slice(0, 10)}...{order.txHash.slice(-8)}
                        </div>
                      ) : (
                        <span className="text-white/50">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

