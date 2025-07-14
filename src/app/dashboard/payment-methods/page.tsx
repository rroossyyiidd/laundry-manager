"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaymentMethodDialog } from "@/components/payment-methods/payment-method-dialog";
import { PaymentMethodsTable } from "@/components/payment-methods/payment-methods-table";
import { useToast } from "@/hooks/use-toast";
import { PaymentMethodService } from "@/lib/services/paymentMethodService";
import type { PaymentMethod } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  // Load payment methods on component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    setLoading(true);
    try {
      const result = await PaymentMethodService.getAll();
      if (result.success && result.data) {
        setPaymentMethods(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load payment methods",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment methods",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMethod = async (methodData: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await PaymentMethodService.create(methodData);
      if (result.success && result.data) {
        setPaymentMethods([...paymentMethods, result.data]);
        toast({
          title: "Success",
          description: result.message || "Payment method created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create payment method",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment method",
        variant: "destructive",
      });
    }
  };

  const updateMethod = async (updatedMethod: PaymentMethod) => {
    try {
      const result = await PaymentMethodService.update(updatedMethod.id, {
        name: updatedMethod.name,
        description: updatedMethod.description,
        active: updatedMethod.active,
      });
      if (result.success && result.data) {
        setPaymentMethods(paymentMethods.map(p => p.id === updatedMethod.id ? result.data! : p));
        toast({
          title: "Success",
          description: result.message || "Payment method updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update payment method",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment method",
        variant: "destructive",
      });
    }
  };

  const deleteMethod = async (id: number) => {
    try {
      const result = await PaymentMethodService.delete(id);
      if (result.success) {
        setPaymentMethods(paymentMethods.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: result.message || "Payment method deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete payment method",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete payment method",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedMethod(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Loading payment methods...</CardDescription>
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
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your accepted payment methods.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentMethodsTable 
            data={paymentMethods} 
            onEdit={handleEdit} 
            onDelete={deleteMethod} 
          />
        </CardContent>
      </Card>
      <PaymentMethodDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        paymentMethodData={selectedMethod}
        onSave={async (data) => {
          if (selectedMethod) {
            await updateMethod({ ...selectedMethod, ...data });
          } else {
            await addMethod(data);
          }
        }}
      />
    </>
  );
}
