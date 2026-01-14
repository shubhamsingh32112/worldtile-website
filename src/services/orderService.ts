import api from './api'

export interface CreateOrderRequest {
  state: string
  place: string
  quantity: number
}

export interface CreateOrderResponse {
  success: boolean
  orderId?: string
  amount?: string
  address?: string
  network?: string
  assignedSlots?: string[] // Slots assigned by backend
  expiresAt?: string | null
  pricing?: {
    baseAmountUSDT: string
    discountUSDT: string
    finalAmountUSDT: string
  }
  message?: string
  status?: number // HTTP status code for error handling
  meta?: {
    available?: number // Available slots count (for 409 errors)
    requested?: number // Requested quantity (for 409 errors)
  }
}

export interface SubmitTransactionRequest {
  orderId: string
  txHash: string
}

export interface SubmitTransactionResponse {
  success: boolean
  message?: string
}

export interface AutoVerifyPaymentResponse {
  success: boolean
  status?: 'PENDING' | 'PAID' | 'EXPIRED' | 'AWAITING_CONFIRMATIONS' | 'LATE_PAYMENT'
  message?: string
  confirmations?: number
  txHash?: string
}

export interface Order {
  orderId: string
  state: string
  place: string
  amount: string
  status: string
  createdAt: string
  paidAt?: string
  landSlotIds: string[]
  expiresAt?: string
  referral?: {
    referrerId: string
    commissionRate: number
    commissionAmountUSDT: string
  }
  pricing?: {
    baseAmountUSDT: string
    discountUSDT: string
    finalAmountUSDT: string
  }
}

export interface UserOrdersResponse {
  success: boolean
  orders?: Order[]
  count?: number
  message?: string
}

export const orderService = {
  /**
   * Create a new order for buying virtual land
   * Backend atomically assigns slots to prevent race conditions
   */
  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await api.post<{
        orderId: string
        amount: string
        address: string
        network: string
        assignedSlots: string[]
        expiresAt: string
        pricing?: {
          baseAmountUSDT: string
          discountUSDT: string
          finalAmountUSDT: string
        }
      }>('/orders/create', request)
      return {
        success: true,
        orderId: response.data.orderId,
        amount: response.data.amount,
        address: response.data.address,
        network: response.data.network,
        assignedSlots: response.data.assignedSlots,
        expiresAt: response.data.expiresAt ?? null,
        pricing: response.data.pricing,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create order'
      const status = error.response?.status
      const meta = error.response?.data?.meta
      return {
        success: false,
        message,
        status, // Include status code for 409 Conflict handling
        meta, // Include metadata (available slots count, etc.)
      }
    }
  },

  /**
   * Submit transaction hash for an order
   */
  async submitTransactionHash(request: SubmitTransactionRequest): Promise<SubmitTransactionResponse> {
    try {
      const response = await api.post<{ message: string }>('/orders/submit-tx', request)
      return {
        success: true,
        message: response.data.message || 'Transaction submitted successfully',
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit transaction hash'
      return {
        success: false,
        message,
      }
    }
  },

  /**
   * Auto-verify payment for an order by checking recent transactions
   */
  async autoVerifyPayment(orderId: string): Promise<AutoVerifyPaymentResponse> {
    try {
      const response = await api.post<{
        success: boolean
        status: string
        message: string
        confirmations?: number
        txHash?: string
      }>('/orders/auto-verify-payment', { orderId })
      return {
        success: response.data.success || false,
        status: response.data.status as any,
        message: response.data.message || 'Payment verification pending',
        confirmations: response.data.confirmations,
        txHash: response.data.txHash,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to auto-verify payment'
      return {
        success: false,
        message,
      }
    }
  },

  /**
   * Get all orders for the authenticated user
   */
  async getUserOrders(status?: string): Promise<UserOrdersResponse> {
    try {
      const params = status ? { status } : undefined
      const response = await api.get<{ orders: Order[]; count: number }>('/orders', { params })
      return {
        success: true,
        orders: response.data.orders || [],
        count: response.data.count || 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch orders'
      return {
        success: false,
        message,
        orders: [],
        count: 0,
      }
    }
  },

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<{ success: boolean; order?: Order; message?: string }> {
    try {
      const response = await api.get<{ success: boolean; order: Order }>(`/orders/${orderId}`)
      return {
        success: true,
        order: response.data.order,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch order'
      return {
        success: false,
        message,
      }
    }
  },

  /**
   * Add referral code to an order (ONE TIME ONLY, before payment)
   */
  async addReferralToOrder(orderId: string, referralCode: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post<{
        success: boolean
        message: string
      }>(`/orders/${orderId}/add-referral`, { referralCode })
      return {
        success: true,
        message: response.data.message || 'Referral applied successfully',
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add referral'
      return {
        success: false,
        message,
      }
    }
  },
}

