import type { Customer, CustomerWithOrders } from '@/lib/types'
import { customerSchema } from '@/lib/schemas'
import * as z from 'zod'

type CustomerFormData = z.infer<typeof customerSchema>

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any[]
}

export class CustomerService {
  private static baseUrl = '/api/customers'

  static async getAll(): Promise<ApiResponse<Customer[]>> {
    try {
      const response = await fetch(this.baseUrl)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch customers')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching customers:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch customers'
      }
    }
  }

  static async getById(id: number): Promise<ApiResponse<CustomerWithOrders>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch customer')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching customer:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch customer'
      }
    }
  }

  static async create(data: CustomerFormData): Promise<ApiResponse<Customer>> {
    try {
      // Validate data on the client side
      const validatedData = customerSchema.parse(data)
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create customer')
      }
      
      return result
    } catch (error) {
      console.error('Error creating customer:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create customer'
      }
    }
  }

  static async update(id: number, data: CustomerFormData): Promise<ApiResponse<Customer>> {
    try {
      // Validate data on the client side
      const validatedData = customerSchema.parse(data)
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update customer')
      }
      
      return result
    } catch (error) {
      console.error('Error updating customer:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update customer'
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
        throw new Error(result.error || 'Failed to delete customer')
      }
      
      return result
    } catch (error) {
      console.error('Error deleting customer:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete customer'
      }
    }
  }
}
