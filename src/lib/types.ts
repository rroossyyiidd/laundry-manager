import { 
  Customer as PrismaCustomer, 
  Package as PrismaPackage, 
  PaymentMethod as PrismaPaymentMethod, 
  LaundryOrder as PrismaLaundryOrder,
  Perfume as PrismaPerfume,
  OrderStatus,
  PaymentStatus,
  AddressType
} from '@prisma/client'

// Export Prisma types directly
export type Customer = PrismaCustomer
export type Package = PrismaPackage
export type PaymentMethod = PrismaPaymentMethod
export type Perfume = PrismaPerfume
export type LaundryOrder = PrismaLaundryOrder

// Export Prisma enums
export { OrderStatus, PaymentStatus, AddressType }

// Extended types with relations
export type LaundryOrderWithRelations = PrismaLaundryOrder & {
  customer: Customer
  package: Package
  paymentMethod?: PaymentMethod | null
}

export type CustomerWithOrders = Customer & {
  orders: LaundryOrder[]
}

// Legacy types for compatibility (using string IDs)
export type LegacyPackage = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export type LegacyCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type LegacyPaymentMethod = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export type LegacyLaundryOrder = {
  id: string;
  customerId: string;
  packageId: string;
  weight: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  orderDate: Date;
};
