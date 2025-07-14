
import * as z from 'zod';

export const packageSchema = z.object({
  name: z.string().min(3, { message: 'Package name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  active: z.boolean().default(true),
});

export const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
});

export const paymentMethodSchema = z.object({
  name: z.string().min(3, { message: 'Method name must be at least 3 characters.' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  active: z.boolean().default(true),
});

export const laundryOrderSchema = z.object({
  customerId: z.string({ required_error: "Please select a customer." }),
  packageId: z.string({ required_error: "Please select a package." }),
  weight: z.coerce.number().min(0.1, { message: 'Weight must be greater than 0.' }),
  status: z.enum(['Pending', 'Processing', 'Completed', 'Cancelled']),
});
