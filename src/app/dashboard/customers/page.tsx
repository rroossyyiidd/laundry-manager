"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { CustomersTable } from "@/components/customers/customers-table";
import { useToast } from "@/hooks/use-toast";
import { CustomerService } from "@/lib/services/customerService";
import type { Customer } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  // Load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const result = await CustomerService.getAll();
      if (result.success && result.data) {
        setCustomers(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load customers",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await CustomerService.create(customerData);
      if (result.success && result.data) {
        setCustomers([...customers, result.data]);
        toast({
          title: "Success",
          description: result.message || "Customer created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const updateCustomer = async (updatedCustomer: Customer) => {
    try {
      const result = await CustomerService.update(updatedCustomer.id, {
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
      });
      if (result.success && result.data) {
        setCustomers(customers.map(c => c.id === updatedCustomer.id ? result.data! : c));
        toast({
          title: "Success",
          description: result.message || "Customer updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const result = await CustomerService.delete(id);
      if (result.success) {
        setCustomers(customers.filter(c => c.id !== id));
        toast({
          title: "Success",
          description: result.message || "Customer deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete customer",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedCustomer(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>Loading customers...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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
        onSave={async (data) => {
          if (selectedCustomer) {
            await updateCustomer({ ...selectedCustomer, ...data });
          } else {
            await addCustomer({ ...data, address: null });
          }
        }}
      />
    </>
  );
}
