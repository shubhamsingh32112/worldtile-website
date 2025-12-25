import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorState from '../../components/ErrorState'

export default function Agents() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminAgents', page, search],
    queryFn: async () => {
      const response = await adminService.getAgents({
        page,
        limit: 20,
        search: search || undefined,
      })
      if (!response.success) throw new Error('Failed to fetch agents')
      return response.data
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
    return <ErrorState message="Failed to load agents" />
  }

  // Because backend returns agents directly at the root of response
  const agents = data?.agents || []
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Agents</h2>
        <p className="text-white/70">View and manage all registered agents</p>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or referral code..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="flex-1 min-w-[200px] px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
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
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Total Earned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-white/50">
                    No agents found
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-medium">{agent.name}</div>
                      <div className="text-sm text-white/50">{agent.email}</div>
                      {agent.walletAddress && (
                        <div className="text-xs text-white/40 font-mono mt-1 max-w-[200px] truncate">
                          {agent.walletAddress}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-mono">{agent.referralCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                      ${parseFloat(agent.totalEarned).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                      ${parseFloat(agent.totalPaid).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">
                      ${parseFloat(agent.pendingAmount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {agent.referralCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(agent.joinedAt).toLocaleDateString()}
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

