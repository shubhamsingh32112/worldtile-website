import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'
import { useToast } from '../../context/ToastContext'

export default function Support() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [response, setResponse] = useState('')
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminSupportTickets', page, statusFilter],
    queryFn: async () => {
      const response = await adminService.getSupportTickets({
        page,
        limit: 20,
        status: statusFilter || undefined,
      })
      if (!response.success) throw new Error('Failed to fetch support tickets')
      return response.data
    },
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, response }: { id: string; response?: string }) =>
      adminService.resolveSupportTicket(id, response),
    onSuccess: () => {
      showToast('🟢 Support ticket resolved', 'success')
      queryClient.invalidateQueries({ queryKey: ['adminSupportTickets'] })
      setSelectedId(null)
      setResponse('')
    },
    onError: (error: any) => {
      showToast(error.message || 'Failed to resolve ticket', 'error')
    },
  })

  const handleResolve = (id: string) => {
    setSelectedId(id)
  }

  const confirmResolve = () => {
    if (!selectedId) return
    resolveMutation.mutate({
      id: selectedId,
      response: response || undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message="Failed to load support tickets" />
  }

  const tickets = data?.data || []
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'IN_PROGRESS':
        return 'bg-blue-500/20 text-blue-400'
      case 'RESOLVED':
        return 'bg-green-500/20 text-green-400'
      case 'CLOSED':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Support Tickets</h2>
        <p className="text-white/70">Manage user support requests</p>
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
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
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
                  Withdrawal ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-white/50">
                    No support tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{ticket.user.name}</div>
                      <div className="text-sm text-white/50">{ticket.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.withdrawalId ? (
                        <div className="text-sm text-white/70 font-mono">
                          {ticket.withdrawalId.slice(0, 8)}...
                        </div>
                      ) : (
                        <div className="text-sm text-white/50">-</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white/70 max-w-md truncate">
                        {ticket.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleResolve(ticket.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                        >
                          Solved
                        </button>
                      )}
                      {ticket.adminResponse && (
                        <div className="text-xs text-white/50 mt-1 max-w-xs truncate">
                          {ticket.adminResponse}
                        </div>
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

      {/* Resolve Modal */}
      {selectedId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Resolve Support Ticket</h3>
            <p className="text-white/70 mb-4">
              Are you sure you want to mark this ticket as resolved?
            </p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Add response (optional)"
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={confirmResolve}
                disabled={resolveMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {resolveMutation.isPending ? 'Processing...' : 'Resolve'}
              </button>
              <button
                onClick={() => {
                  setSelectedId(null)
                  setResponse('')
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

