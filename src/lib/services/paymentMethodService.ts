import type { PaymentMethod } from '@/lib/types'
import { paymentMethodSchema } from '@/lib/schemas'
import * as z from 'zod'

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any[]
}

export class PaymentMethodService {
  private static baseUrl = '/api/payment-methods'

  static async getAll(): Promise<ApiResponse<PaymentMethod[]>> {
    try {
      const response = await fetch(this.baseUrl)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payment methods')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment methods'
      }
    }
  }

  static async getById(id: number): Promise<ApiResponse<PaymentMethod>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch payment method')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching payment method:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch payment method'
      }
    }
  }

  static async create(data: PaymentMethodFormData): Promise<ApiResponse<PaymentMethod>> {
    try {
      // Validate data on the client side
      const validatedData = paymentMethodSchema.parse(data)
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment method')
      }
      
      return result
    } catch (error) {
      console.error('Error creating payment method:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment method'
      }
    }
  }

  static async update(id: number, data: PaymentMethodFormData): Promise<ApiResponse<PaymentMethod>> {
    try {
      // Validate data on the client side
      const validatedData = paymentMethodSchema.parse(data)
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update payment method')
      }
      
      return result
    } catch (error) {
      console.error('Error updating payment method:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update payment method'
      }
    }
  }

  static async delete(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete payment method')
      }
      
      return result
    } catch (error) {
      console.error('Error deleting payment method:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete payment method'
      }
    }
  }
}
