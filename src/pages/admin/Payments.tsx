import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService, Payment } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import { useToast } from '../../context/ToastContext'

export default function Payments() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminPayments', page, statusFilter, search],
    queryFn: async () => {
      const response = await adminService.getPayments({
        page,
        limit: 20,
        status: statusFilter || undefined,
        search: search || undefined,
      })
      if (!response.success) throw new Error('Failed to fetch payments')
      return response.data
    },
  })

  const verifyMutation = useMutation({
    mutationFn: (paymentId: string) => adminService.reVerifyPayment(paymentId),
    onSuccess: () => {
      showToast('Payment verification triggered', 'success')
      queryClient.invalidateQueries({ queryKey: ['adminPayments'] })
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to verify payment', 'error')
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load payments" />
  }

  if (data) console.log("💳 PAYMENTS RESPONSE:", data)

  const payments = data?.payments || []
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'FAILED':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Payments</h2>
        <p className="text-white/70">View and manage all payment transactions</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by email, name, or txHash..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="flex-1 min-w-[200px] px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  TxHash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Confirmations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment: Payment) => (
                  <tr key={payment.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{payment.user.name}</div>
                      <div className="text-sm text-white/50">{payment.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${parseFloat(payment.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.txHash ? (
                        <div className="text-sm text-white/70 font-mono">
                          {payment.txHash.slice(0, 10)}...{payment.txHash.slice(-8)}
                        </div>
                      ) : (
                        <div className="text-sm text-white/50 italic">Not verified yet</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {payment.confirmations !== null && payment.confirmations !== undefined
                        ? `${payment.confirmations}/19`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                        {!payment.isVerified && payment.status === 'COMPLETED' && (
                          <span className="text-xs text-yellow-500 font-semibold">
                            Missing TX - Manual Verify Needed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.id.startsWith('pending-') ? (
                        <span className="text-xs text-yellow-400">Awaiting payment</span>
                      ) : (
                        <button
                          onClick={() => verifyMutation.mutate(payment.id)}
                          disabled={verifyMutation.isPending}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                        >
                          {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white/70">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

