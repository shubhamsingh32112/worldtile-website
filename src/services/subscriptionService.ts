import api from './api'

export interface SubscribeRequest {
  email: string
}

export interface SubscribeResponse {
  success: boolean
  message?: string
}

export const subscriptionService = {
  /**
   * Subscribe an email to the newsletter
   */
  async subscribe(request: SubscribeRequest): Promise<SubscribeResponse> {
    try {
      const response = await api.post<{ success: boolean; message?: string }>('/subscriptions/subscribe', {
        email: request.email.trim().toLowerCase(),
      })
      return {
        success: response.data.success ?? true,
        message: response.data.message || 'Successfully subscribed!',
      }
    } catch (error: any) {
      const statusCode = error.response?.status
      const message = error.response?.data?.message || 'Failed to subscribe. Please try again.'
      
      // Handle duplicate email subscription
      if (statusCode === 409 || statusCode === 400) {
        return {
          success: false,
          message: error.response?.data?.message || 'This email is already subscribed.',
        }
      }
      
      return {
        success: false,
        message,
      }
    }
  },
}

