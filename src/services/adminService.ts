import api from './api'

export interface AdminStats {
  totalRevenue: string
  totalCommissions: string
  netRevenue: string
  pendingWithdrawals: number
  pendingWithdrawalsAmount: string
  pendingPayments: number
  totalUsers: number
  totalAgents: number
  totalOrders: number
}

export interface Payment {
  id: string
  txHash: string | null
  user: {
    id: string
    name: string
    email: string
  }
  orderId: string
  amount: string
  confirmations: number | null
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  orderStatus: string
  fromAddress: string | null
  toAddress: string
  blockTimestamp: string | null
  createdAt: string
  isVerified?: boolean // Whether it has a PaymentTransaction record
}

export interface Withdrawal {
  id: string
  agent: {
    id: string
    name: string
    email: string
    phoneNumber?: string
    walletAddress?: string
  }
  amount: string
  walletAddress: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'
  adminNotes?: string
  approvedBy?: {
    id: string
    name: string
    email: string
  }
  approvedAt?: string
  payoutTxHash?: string
  createdAt: string
  updatedAt: string
}

export interface BusinessEarning {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  amount: string
  state: string
  place: string
  quantity: number
  txHash?: string
  paidAt: string
  createdAt: string
}

export interface Agent {
  id: string
  name: string
  email: string
  referralCode?: string
  walletAddress?: string
  totalEarned: string
  totalPaid: string
  pendingAmount: string
  referralCount: number
  joinedAt: string
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const adminService = {
  /**
   * Get dashboard overview statistics
   */
  async getOverviewStats(): Promise<{ success: boolean; data: AdminStats }> {
    const response = await api.get<{ success: boolean; data: AdminStats }>(
      '/admin/stats/overview'
    )
    return response.data
  },

  /**
   * Get paginated list of payments with filters
   */
  async getPayments(params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<{ success: boolean; data: PaymentsResponse }> {
    const response = await api.get<{
      success: boolean
      data: PaymentsResponse
    }>('/admin/payments', { params })
    return response.data
  },

  /**
   * Re-verify a payment transaction
   */
  async reVerifyPayment(
    paymentId: string
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.post<{
      success: boolean
      message: string
      data: any
    }>(`/admin/payments/${paymentId}/verify`)
    return response.data
  },

  /**
   * Get withdrawal requests
   */
  async getWithdrawals(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ success: boolean; data: PaginatedResponse<Withdrawal> }> {
    const response = await api.get<{
      success: boolean
      data: PaginatedResponse<Withdrawal>
    }>('/admin/withdrawals', { params })
    return response.data
  },

  /**
   * Approve a withdrawal request
   */
  async approveWithdrawal(
    withdrawalId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/admin/withdrawals/${withdrawalId}/approve`,
      { notes }
    )
    return response.data
  },

  /**
   * Reject a withdrawal request
   */
  async rejectWithdrawal(
    withdrawalId: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/admin/withdrawals/${withdrawalId}/reject`,
      { notes }
    )
    return response.data
  },

  /**
   * Mark withdrawal as paid (COMPLETED) with transaction hash
   */
  async markWithdrawalAsPaid(
    withdrawalId: string,
    payoutTxHash: string,
    notes?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post<{ success: boolean; message: string }>(
      `/admin/withdrawals/${withdrawalId}/mark-paid`,
      { payoutTxHash, notes }
    )
    return response.data
  },

  /**
   * Get business earnings
   */
  async getBusinessEarnings(params?: {
    period?: 'daily' | 'weekly' | 'monthly' | 'all'
  }): Promise<{
    success: boolean
    data: {
      summary: {
        totalRevenue: string
        totalCommissions: string
        netRevenue: string
        orderCount: number
        commissionCount: number
        period: string
      }
      orders: BusinessEarning[]
    }
  }> {
    const response = await api.get<{
      success: boolean
      data: {
        summary: {
          totalRevenue: string
          totalCommissions: string
          netRevenue: string
          orderCount: number
          commissionCount: number
          period: string
        }
        orders: BusinessEarning[]
      }
    }>('/admin/earnings/business', { params })
    return response.data
  },

  /**
   * Get list of agents
   */
  async getAgents(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{ success: boolean; data: PaginatedResponse<Agent> }> {
    const response = await api.get<{
      success: boolean
      data: PaginatedResponse<Agent>
    }>('/admin/users/agents', { params })
    return response.data
  },

  /**
   * Get support tickets
   */
  async getSupportTickets(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<{ success: boolean; data: PaginatedResponse<SupportTicket> }> {
    const response = await api.get<{
      success: boolean
      data: PaginatedResponse<SupportTicket>
    }>('/admin/support/tickets', { params })
    return response.data
  },

  /**
   * Resolve a support ticket
   */
  async resolveSupportTicket(
    ticketId: string,
    response?: string
  ): Promise<{ success: boolean; message: string }> {
    const apiResponse = await api.patch<{ success: boolean; message: string }>(
      `/admin/support/${ticketId}/resolve`,
      { response }
    )
    return apiResponse.data
  },
}

export interface SupportTicket {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  withdrawalId?: string
  message: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  adminResponse?: string
  respondedBy?: {
    id: string
    name: string
    email: string
  }
  respondedAt?: string
  createdAt: string
  updatedAt: string
}

