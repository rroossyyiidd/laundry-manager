
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LaundryOrderDialog } from "@/components/laundry-orders/laundry-order-dialog";
import { LaundryOrdersTable } from "@/components/laundry-orders/laundry-orders-table";
import type { LaundryOrder, Customer, Package } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const initialOrders: LaundryOrder[] = [
  { id: "ord_1", customerId: "cust_1", packageId: "pkg_1", weight: 5, status: "Completed", orderDate: new Date("2023-10-01") },
  { id: "ord_2", customerId: "cust_2", packageId: "pkg_2", weight: 7, status: "Processing", orderDate: new Date("2023-10-02") },
  { id: "ord_3", customerId: "cust_3", packageId: "pkg_1", weight: 3, status: "Pending", orderDate: new Date("2023-10-03") },
];

const dummyCustomers: Customer[] = [
  { id: "cust_1", name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  { id: "cust_2", name: "Jane Smith", email: "jane.smith@example.com", phone: "098-765-4321" },
  { id: "cust_3", name: "Peter Jones", email: "peter.jones@example.com", phone: "555-555-5555" },
];

const dummyPackages: Package[] = [
  { id: "pkg_1", name: "Daily Wear", description: "Standard wash and fold for everyday clothes.", active: true },
  { id: "pkg_2", name: "Beddings & Linens", description: "Special care for bedsheets, blankets, and towels.", active: true },
  { id: "pkg_3", name: "Delicates", description: "Gentle wash for delicate fabrics.", active: false },
];


export default function LaundryOrdersPage() {
  const [orders, setOrders] = useState<LaundryOrder[]>(initialOrders);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<LaundryOrder | null>(null);

  // In a real app, you would fetch these from your backend
  const customers = dummyCustomers;
  const packages = dummyPackages;

  const addOrder = (order: Omit<LaundryOrder, 'id' | 'orderDate'>) => {
    setOrders([...orders, { ...order, id: `ord_${Date.now()}`, orderDate: new Date() }]);
  };

  const updateOrder = (updatedOrder: LaundryOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleEdit = (order: LaundryOrder) => {
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
              <CardDescription>Create and manage customer laundry orders.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LaundryOrdersTable 
            data={orders}
            customers={customers}
            packages={packages} 
            onEdit={handleEdit} 
            onDelete={deleteOrder} 
          />
        </CardContent>
      </Card>
      <LaundryOrderDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        orderData={selectedOrder}
        customers={customers}
        packages={packages}
        onSave={(data) => {
          if (selectedOrder) {
            updateOrder({ ...selectedOrder, ...data });
          } else {
            addOrder(data);
          }
        }}
      />
    </>
  );
}
