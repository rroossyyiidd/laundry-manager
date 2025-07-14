
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { laundryOrderSchema } from "@/lib/schemas";
import type { LaundryOrder, Customer, Package } from "@/lib/types";
import { useEffect } from "react";

type LaundryOrderDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  orderData: LaundryOrder | null;
  customers: Customer[];
  packages: Package[];
  onSave: (data: z.infer<typeof laundryOrderSchema>) => void;
};

const orderStatuses: LaundryOrder['status'][] = ['Pending', 'Processing', 'Completed', 'Cancelled'];

export function LaundryOrderDialog({ isOpen, setIsOpen, orderData, customers, packages, onSave }: LaundryOrderDialogProps) {
  const form = useForm<z.infer<typeof laundryOrderSchema>>({
    resolver: zodResolver(laundryOrderSchema),
    defaultValues: {
      customerId: "",
      packageId: "",
      weight: 0,
      status: "Pending",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (orderData) {
        form.reset(orderData);
      } else {
        form.reset({
            customerId: "",
            packageId: "",
            weight: 0,
            status: "Pending",
        });
      }
    }
  }, [orderData, form, isOpen]);

  const onSubmit = (data: z.infer<typeof laundryOrderSchema>) => {
    onSave(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{orderData ? "Edit Order" : "Create New Order"}</DialogTitle>
          <DialogDescription>
            {orderData ? "Update the details of the laundry order." : "Fill in the details for the new laundry order."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map(customer => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
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
                  <FormLabel>Laundry Package</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {packages.filter(p => p.active).map(pkg => (
                        <SelectItem key={pkg.id} value={pkg.id}>
                          {pkg.name}
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
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5.5" {...field} step="0.1" />
                  </FormControl>
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
