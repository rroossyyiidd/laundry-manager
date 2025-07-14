import type { Package } from '@/lib/types'
import { packageSchema } from '@/lib/schemas'
import * as z from 'zod'

type PackageFormData = z.infer<typeof packageSchema>

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
  details?: any[]
}

export class PackageService {
  private static baseUrl = '/api/packages'

  static async getAll(): Promise<ApiResponse<Package[]>> {
    try {
      const response = await fetch(this.baseUrl)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch packages')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching packages:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch packages'
      }
    }
  }

  static async getById(id: number): Promise<ApiResponse<Package>> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch package')
      }
      
      return result
    } catch (error) {
      console.error('Error fetching package:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch package'
      }
    }
  }

  static async create(data: PackageFormData): Promise<ApiResponse<Package>> {
    try {
      // Validate data on the client side
      const validatedData = packageSchema.parse(data)
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create package')
      }
      
      return result
    } catch (error) {
      console.error('Error creating package:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create package'
      }
    }
  }

  static async update(id: number, data: PackageFormData): Promise<ApiResponse<Package>> {
    try {
      // Validate data on the client side
      const validatedData = packageSchema.parse(data)
      
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update package')
      }
      
      return result
    } catch (error) {
      console.error('Error updating package:', error)
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: 'Validation failed',
          details: error.issues
        }
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update package'
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
        throw new Error(result.error || 'Failed to delete package')
      }
      
      return result
    } catch (error) {
      console.error('Error deleting package:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete package'
      }
    }
  }
}
