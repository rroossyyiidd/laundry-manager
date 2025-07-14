
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { laundryOrderSchema } from "@/lib/schemas";
import type { LaundryOrderWithRelations, Customer, Package, PaymentMethod } from "@/lib/types";
import { useEffect, useState } from "react";

type LaundryOrderDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderData: LaundryOrderWithRelations | null;
  customers: Customer[];
  packages: Package[];
  paymentMethods: PaymentMethod[];
  onSave: (data: z.infer<typeof laundryOrderSchema>) => Promise<void>;
};

const orderStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'] as const;

export function LaundryOrderDialog({ 
  isOpen, 
  setIsOpen, 
  orderData, 
  customers, 
  packages, 
  paymentMethods, 
  onSave 
}: LaundryOrderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof laundryOrderSchema>>({
    resolver: zodResolver(laundryOrderSchema),
    defaultValues: {
      customerId: 1,
      packageId: 1,
      weight: 0.1,
      status: "Pending",
      paymentMethodId: undefined,
      notes: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (orderData) {
        form.reset({
          customerId: orderData.customerId,
          packageId: orderData.packageId,
          weight: orderData.weight,
          status: orderData.status as any,
          paymentMethodId: orderData.paymentMethodId || undefined,
          notes: orderData.notes || "",
        });
      } else {
        // Reset to first available customer and package for new orders
        const firstCustomer = customers.length > 0 ? customers[0].id : 1;
        const firstPackage = packages.length > 0 ? packages.find(p => p.active)?.id || packages[0]?.id : 1;
        
        form.reset({
          customerId: firstCustomer,
          packageId: firstPackage,
          weight: 0.1,
          status: "Pending",
          paymentMethodId: undefined,
          notes: "",
        });
      }
    }
  }, [orderData, form, isOpen, customers, packages]);

  const onSubmit = async (data: z.infer<typeof laundryOrderSchema>) => {
    setIsLoading(true);
    try {
      await onSave(data);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPackage = packages.find(p => p.id === form.watch('packageId'));
  const estimatedTotal = selectedPackage?.price && form.watch('weight') 
    ? selectedPackage.price * form.watch('weight')
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{orderData ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            {orderData ? "Update the details of the laundry order." : "Fill in the details for the new laundry order."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1 pr-2 max-h-[60vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer *</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-xs text-muted-foreground">{customer.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="packageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Laundry Package *</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.filter(p => p.active).map(pkg => (
                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                          <div className="flex flex-col">
                            <span>{pkg.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {pkg.price ? `${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(pkg.price)}/kg` : 'Price not set'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="e.g., 5.5" 
                      {...field} 
                      step="0.1" 
                      min="0.1"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  {estimatedTotal && (
                    <p className="text-sm text-muted-foreground">
                      Estimated total: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(estimatedTotal)}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="paymentMethodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "none" ? undefined : Number(value))} 
                    value={field.value ? field.value.toString() : "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {paymentMethods.filter(pm => pm.active).map(method => (
                        <SelectItem key={method.id} value={method.id.toString()}>
                          <div className="flex flex-col">
                            <span>{method.name}</span>
                            <span className="text-xs text-muted-foreground">{method.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orderStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special instructions or notes..." 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex-shrink-0 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : orderData ? "Update Order" : "Create Order"}
              </Button>
            </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
