
export type Package = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export type LaundryOrder = {
  id: string;
  customerId: string;
  packageId: string;
  weight: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  orderDate: Date;
};
