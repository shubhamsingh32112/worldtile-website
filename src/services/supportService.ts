import api from './api'

export interface SupportQueryRequest {
  withdrawalId?: string
  message: string
}

export interface SupportQueryResponse {
  success: boolean
  message?: string
  ticketId?: string
}

export const supportService = {
  /**
   * Submit a user query/support ticket
   */
  async submitUserQuery(request: SupportQueryRequest): Promise<SupportQueryResponse> {
    try {
      const response = await api.post<{
        success: boolean
        message: string
        ticketId?: string
      }>('/support/user-query', request)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit support request'
      return {
        success: false,
        message,
      }
    }
  },
}

