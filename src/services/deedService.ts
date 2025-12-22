import api from './api'

export interface NFT {
  tokenId: string
  contractAddress: string
  blockchain: string
}

export interface Payment {
  transactionId: string
  receiver: string
}

export interface Deed {
  plotId: string
  ownerName: string
  city: string
  latitude: number
  longitude: number
  nft: NFT
  payment: Payment
  issuedAt: string
  sealNo: string
}

export interface DeedResponse {
  success: boolean
  deed?: Deed
  message?: string
}

export const deedService = {
  /**
   * Get deed by property ID (landSlotId)
   */
  async getDeedByPropertyId(propertyId: string): Promise<DeedResponse> {
    try {
      const response = await api.get<{ success?: boolean; deed?: Deed } | Deed>(`/deeds/${propertyId}`)
      
      // Handle both wrapped and unwrapped response formats
      const data = response.data
      const deed = (data as any).deed || data as Deed
      
      return {
        success: true,
        deed,
      }
    } catch (error: any) {
      const statusCode = error.response?.status
      let message = 'Failed to fetch deed'
      
      if (statusCode === 404) {
        message = error.response?.data?.message || 'Deed not found'
      } else if (statusCode === 403) {
        message = error.response?.data?.message || 'You do not own this property'
      } else {
        message = error.response?.data?.message || 'Failed to fetch deed'
      }
      
      return {
        success: false,
        message,
      }
    }
  },
}

