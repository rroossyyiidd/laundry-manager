
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LaundryOrderDialog } from "@/components/laundry-orders/laundry-order-dialog";
import { LaundryOrdersTable } from "@/components/laundry-orders/laundry-orders-table";
import type { LaundryOrderWithRelations, Customer, Package, PaymentMethod } from "@/lib/types";
import { PlusCircle, RefreshCw } from "lucide-react";
import { laundryOrderSchema } from "@/lib/schemas";
import * as z from "zod";

export default function LaundryOrdersPage() {
  const [orders, setOrders] = useState<LaundryOrderWithRelations[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LaundryOrderWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all required data in parallel
      const [ordersRes, customersRes, packagesRes, paymentMethodsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/customers'),
        fetch('/api/packages'),
        fetch('/api/payment-methods'),
      ]);

      const [ordersData, customersData, packagesData, paymentMethodsData] = await Promise.all([
        ordersRes.json(),
        customersRes.json(),
        packagesRes.json(),
        paymentMethodsRes.json(),
      ]);

      if (ordersData.success) setOrders(ordersData.data);
      if (customersData.success) setCustomers(customersData.data);
      if (packagesData.success) setPackages(packagesData.data);
      if (paymentMethodsData.success) setPaymentMethods(paymentMethodsData.data);

    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: z.infer<typeof laundryOrderSchema>) => {
    try {
      if (selectedOrder) {
        // Update existing order
        const response = await fetch(`/api/orders/${selectedOrder.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update order');
        }

        if (result.success) {
          setOrders(prevOrders => 
            prevOrders.map(order => 
              order.id === selectedOrder.id ? result.data : order
            )
          );
          
          toast({
            title: "Success",
            description: "Order updated successfully!",
          });
        }
      } else {
        // Create new order
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create order');
        }

        if (result.success) {
          setOrders(prevOrders => [result.data, ...prevOrders]);
          
          toast({
            title: "Success",
            description: "Order created successfully!",
          });
        }
      }
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save order",
        variant: "destructive",
      });
      throw error; // Re-throw to prevent dialog from closing
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete order');
      }

      if (result.success) {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        
        toast({
          title: "Success",
          description: "Order deleted successfully!",
        });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete order",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (order: LaundryOrderWithRelations) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedOrder(null);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Laundry Orders</CardTitle>
              <CardDescription>
                Create and manage customer laundry orders with automated pricing.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading orders...</span>
              </div>
            </div>
          ) : (
            <LaundryOrdersTable 
              data={orders}
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          )}
        </CardContent>
      </Card>
      
      <LaundryOrderDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        orderData={selectedOrder}
        customers={customers}
        packages={packages}
        paymentMethods={paymentMethods}
        onSave={handleSave}
      />
    </>
  );
}
