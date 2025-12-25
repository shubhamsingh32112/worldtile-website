import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import { useToast } from '../../context/ToastContext'

export default function Withdrawals() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminWithdrawals', page, statusFilter],
    queryFn: async () => {
      const response = await adminService.getWithdrawals({
        page,
        limit: 20,
        status: statusFilter || undefined,
      })
      if (!response.success) throw new Error('Failed to fetch withdrawals')
      return response.data
    },
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminService.approveWithdrawal(id, notes),
    onSuccess: () => {
      showToast('Withdrawal approved successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setSelectedId(null)
      setNotes('')
      setActionType(null)
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to approve withdrawal', 'error')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      adminService.rejectWithdrawal(id, notes),
    onSuccess: () => {
      showToast('Withdrawal rejected', 'success')
      queryClient.invalidateQueries({ queryKey: ['adminWithdrawals'] })
      queryClient.invalidateQueries({ queryKey: ['adminStats'] })
      setSelectedId(null)
      setNotes('')
      setActionType(null)
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to reject withdrawal', 'error')
    },
  })

  const handleAction = (id: string, type: 'approve' | 'reject') => {
    setSelectedId(id)
    setActionType(type)
  }

  const confirmAction = () => {
    if (!selectedId || !actionType) return

    if (actionType === 'approve') {
      approveMutation.mutate({ id: selectedId, notes: notes || undefined })
    } else {
      rejectMutation.mutate({ id: selectedId, notes: notes || undefined })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load withdrawals" />
  }

  const withdrawals = data?.data || []
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500/20 text-green-400'
      case 'PENDING':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'REJECTED':
        return 'bg-red-500/20 text-red-400'
      case 'COMPLETED':
        return 'bg-blue-500/20 text-blue-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Withdrawals</h2>
        <p className="text-white/70">Review and manage agent withdrawal requests</p>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
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
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date
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
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                    No withdrawals found
                  </td>
                </tr>
              ) : (
                withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{withdrawal.agent.name}</div>
                      <div className="text-sm text-white/50">{withdrawal.agent.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      ${parseFloat(withdrawal.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/70 font-mono max-w-[200px] truncate">
                        {withdrawal.walletAddress}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {withdrawal.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(withdrawal.id, 'approve')}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(withdrawal.id, 'reject')}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {withdrawal.adminNotes && (
                        <div className="text-xs text-white/50 mt-1">{withdrawal.adminNotes}</div>
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

      {/* Action Modal */}
      {selectedId && actionType && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Withdrawal
            </h3>
            <p className="text-white/70 mb-4">
              Are you sure you want to {actionType} this withdrawal request?
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes (optional)"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAction}
                disabled={approveMutation.isPending || rejectMutation.isPending}
                className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {approveMutation.isPending || rejectMutation.isPending
                  ? 'Processing...'
                  : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  setSelectedId(null)
                  setNotes('')
                  setActionType(null)
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

