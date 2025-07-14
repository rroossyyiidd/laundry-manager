import { prisma } from '@/lib/prisma';
import type { LaundryOrder } from '@/lib/types';

export interface CreateLaundryOrderData {
  customerId: number;
  packageId: number;
  weight: number;
  status?: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  paymentMethodId?: number;
  notes?: string;
}

export interface UpdateLaundryOrderData extends CreateLaundryOrderData {
  id: number;
}

export class LaundryOrderService {
  // Get all laundry orders with related data
  static async getAll() {
    try {
      const orders = await prisma.laundryOrder.findMany({
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return { success: true, data: orders };
    } catch (error) {
      console.error('Error fetching laundry orders:', error);
      return { success: false, error: 'Failed to fetch laundry orders' };
    }
  }

  // Get a single laundry order by ID
  static async getById(id: number) {
    try {
      const order = await prisma.laundryOrder.findUnique({
        where: { id },
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
      });

      if (!order) {
        return { success: false, error: 'Laundry order not found' };
      }

      return { success: true, data: order };
    } catch (error) {
      console.error('Error fetching laundry order:', error);
      return { success: false, error: 'Failed to fetch laundry order' };
    }
  }

  // Create a new laundry order
  static async create(data: CreateLaundryOrderData) {
    try {
      // Get package details to calculate total amount
      const packageData = await prisma.package.findUnique({
        where: { id: data.packageId },
      });

      if (!packageData) {
        return { success: false, error: 'Package not found' };
      }

      const totalAmount = packageData.price ? packageData.price * data.weight : null;

      const order = await prisma.laundryOrder.create({
        data: {
          customerId: data.customerId,
          packageId: data.packageId,
          weight: data.weight,
          status: data.status || 'Pending',
          paymentMethodId: data.paymentMethodId,
          totalAmount,
          notes: data.notes,
        },
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
      });

      return { success: true, data: order };
    } catch (error) {
      console.error('Error creating laundry order:', error);
      return { success: false, error: 'Failed to create laundry order' };
    }
  }

  // Update an existing laundry order
  static async update(id: number, data: Partial<CreateLaundryOrderData>) {
    try {
      // Check if order exists
      const existingOrder = await prisma.laundryOrder.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        return { success: false, error: 'Laundry order not found' };
      }

      // Recalculate total amount if package or weight is being updated
      let totalAmount = existingOrder.totalAmount;
      if (data.packageId || data.weight) {
        const packageId = data.packageId || existingOrder.packageId;
        const weight = data.weight || existingOrder.weight;
        
        const packageData = await prisma.package.findUnique({
          where: { id: packageId },
        });

        if (!packageData) {
          return { success: false, error: 'Package not found' };
        }

        totalAmount = packageData.price ? packageData.price * weight : null;
      }

      const updatedOrder = await prisma.laundryOrder.update({
        where: { id },
        data: {
          ...data,
          totalAmount,
        },
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
      });

      return { success: true, data: updatedOrder };
    } catch (error) {
      console.error('Error updating laundry order:', error);
      return { success: false, error: 'Failed to update laundry order' };
    }
  }

  // Delete a laundry order
  static async delete(id: number) {
    try {
      // Check if order exists
      const existingOrder = await prisma.laundryOrder.findUnique({
        where: { id },
      });

      if (!existingOrder) {
        return { success: false, error: 'Laundry order not found' };
      }

      await prisma.laundryOrder.delete({
        where: { id },
      });

      return { success: true, message: 'Laundry order deleted successfully' };
    } catch (error) {
      console.error('Error deleting laundry order:', error);
      return { success: false, error: 'Failed to delete laundry order' };
    }
  }

  // Get orders by customer
  static async getByCustomer(customerId: number) {
    try {
      const orders = await prisma.laundryOrder.findMany({
        where: { customerId },
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return { success: true, data: orders };
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return { success: false, error: 'Failed to fetch customer orders' };
    }
  }

  // Get orders by status
  static async getByStatus(status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled') {
    try {
      const orders = await prisma.laundryOrder.findMany({
        where: { status },
        include: {
          customer: true,
          package: true,
          paymentMethod: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return { success: true, data: orders };
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return { success: false, error: 'Failed to fetch orders by status' };
    }
  }
}
