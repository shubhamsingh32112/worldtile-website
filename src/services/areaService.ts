import api from './api'

export interface Area {
  areaKey: string
  areaName: string
  stateKey: string
  stateName: string
  remainingSlots: number
  totalSlots: number
  priceUSDT: number
  highlights?: string[]
}

export interface LandSlot {
  landSlotId: string
  areaKey: string
  stateKey: string
  isAvailable: boolean
}

export interface AreasResponse {
  success: boolean
  areas?: Area[]
  count?: number
  message?: string
}

export interface AreaDetailsResponse {
  success: boolean
  area?: Area
  message?: string
}

export interface AvailableSlotResponse {
  success: boolean
  landSlot?: LandSlot
  message?: string
}

export interface AvailableSlotsResponse {
  success: boolean
  landSlots?: LandSlot[]
  count?: number
  message?: string
}

export const areaService = {
  /**
   * Get all areas for a specific state
   */
  async getAreasForState(stateKey: string): Promise<AreasResponse> {
    try {
      const normalizedStateKey = stateKey.toLowerCase().trim()
      const response = await api.get<Area[]>(`/states/${normalizedStateKey}/areas`)
      return {
        success: true,
        areas: Array.isArray(response.data) ? response.data : [],
        count: Array.isArray(response.data) ? response.data.length : 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch areas'
      return {
        success: false,
        message,
        areas: [],
        count: 0,
      }
    }
  },

  /**
   * Get area details by areaKey
   */
  async getAreaDetails(areaKey: string): Promise<AreaDetailsResponse> {
    try {
      const normalizedAreaKey = areaKey.toLowerCase().trim()
      const response = await api.get<Area>(`/areas/${normalizedAreaKey}`)
      return {
        success: true,
        area: response.data,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Area not found'
      return {
        success: false,
        message,
      }
    }
  },

  /**
   * Get an available land slot for an area
   */
  async getAvailableSlot(areaKey: string): Promise<AvailableSlotResponse> {
    try {
      const normalizedAreaKey = areaKey.toLowerCase().trim()
      const response = await api.get<{ landSlot: LandSlot }>(`/areas/${normalizedAreaKey}/available-slot`)
      return {
        success: true,
        landSlot: response.data.landSlot,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'No available slot found'
      return {
        success: false,
        message,
      }
    }
  },

  /**
   * Get multiple available land slots for an area
   */
  async getAvailableSlots(areaKey: string, quantity: number): Promise<AvailableSlotsResponse> {
    try {
      const normalizedAreaKey = areaKey.toLowerCase().trim()
      const response = await api.get<{ landSlots: LandSlot[]; count: number }>(
        `/areas/${normalizedAreaKey}/available-slots`,
        {
          params: { quantity },
        }
      )
      return {
        success: true,
        landSlots: response.data.landSlots || [],
        count: response.data.count || 0,
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'No available slots found'
      return {
        success: false,
        message,
        landSlots: [],
        count: 0,
      }
    }
  },
}

