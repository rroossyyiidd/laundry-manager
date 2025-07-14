"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { CustomersTable } from "@/components/customers/customers-table";
import type { Customer } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const initialCustomers: Customer[] = [
  { id: "cust_1", name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
  { id: "cust_2", name: "Jane Smith", email: "jane.smith@example.com", phone: "098-765-4321" },
  { id: "cust_3", name: "Peter Jones", email: "peter.jones@example.com", phone: "555-555-5555" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers([...customers, { ...customer, id: `cust_${Date.now()}` }]);
  };

  const updateCustomer = (updatedCustomer: Customer) => {
    setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>View and manage your customer list.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CustomersTable 
            data={customers} 
            onEdit={handleEdit} 
            onDelete={deleteCustomer} 
          />
        </CardContent>
      </Card>
      <CustomerDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        customerData={selectedCustomer}
        onSave={(data) => {
          if (selectedCustomer) {
            updateCustomer({ ...selectedCustomer, ...data });
          } else {
            addCustomer(data);
          }
        }}
      />
    </>
  );
}
