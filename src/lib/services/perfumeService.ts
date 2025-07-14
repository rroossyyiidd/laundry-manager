import { prisma } from '@/lib/prisma';

export interface CreatePerfumeData {
  name: string;
  description: string;
  available?: boolean;
}

export interface UpdatePerfumeData extends CreatePerfumeData {
  id: number;
}

export class PerfumeService {
  // Get all perfumes
  static async getAll() {
    try {
      const perfumes = await prisma.perfume.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      return { success: true, data: perfumes };
    } catch (error) {
      console.error('Error fetching perfumes:', error);
      return { success: false, error: 'Failed to fetch perfumes' };
    }
  }

  // Get a single perfume by ID
  static async getById(id: number) {
    try {
      const perfume = await prisma.perfume.findUnique({
        where: { id },
      });

      if (!perfume) {
        return { success: false, error: 'Perfume not found' };
      }

      return { success: true, data: perfume };
    } catch (error) {
      console.error('Error fetching perfume:', error);
      return { success: false, error: 'Failed to fetch perfume' };
    }
  }

  // Create a new perfume
  static async create(data: CreatePerfumeData) {
    try {
      const perfume = await prisma.perfume.create({
        data: {
          name: data.name,
          description: data.description,
          available: data.available ?? true,
        },
      });

      return { success: true, data: perfume };
    } catch (error) {
      console.error('Error creating perfume:', error);
      return { success: false, error: 'Failed to create perfume' };
    }
  }

  // Update an existing perfume
  static async update(id: number, data: Partial<CreatePerfumeData>) {
    try {
      // Check if perfume exists
      const existingPerfume = await prisma.perfume.findUnique({
        where: { id },
      });

      if (!existingPerfume) {
        return { success: false, error: 'Perfume not found' };
      }

      const updatedPerfume = await prisma.perfume.update({
        where: { id },
        data,
      });

      return { success: true, data: updatedPerfume };
    } catch (error) {
      console.error('Error updating perfume:', error);
      return { success: false, error: 'Failed to update perfume' };
    }
  }

  // Delete a perfume
  static async delete(id: number) {
    try {
      // Check if perfume exists
      const existingPerfume = await prisma.perfume.findUnique({
        where: { id },
      });

      if (!existingPerfume) {
        return { success: false, error: 'Perfume not found' };
      }

      await prisma.perfume.delete({
        where: { id },
      });

      return { success: true, message: 'Perfume deleted successfully' };
    } catch (error) {
      console.error('Error deleting perfume:', error);
      return { success: false, error: 'Failed to delete perfume' };
    }
  }

  // Get available perfumes only
  static async getAvailable() {
    try {
      const perfumes = await prisma.perfume.findMany({
        where: { available: true },
        orderBy: {
          name: 'asc',
        },
      });

      return { success: true, data: perfumes };
    } catch (error) {
      console.error('Error fetching available perfumes:', error);
      return { success: false, error: 'Failed to fetch available perfumes' };
    }
  }
}
