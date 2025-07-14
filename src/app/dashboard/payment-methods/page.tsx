"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PaymentMethodDialog } from "@/components/payment-methods/payment-method-dialog";
import { PaymentMethodsTable } from "@/components/payment-methods/payment-methods-table";
import type { PaymentMethod } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const initialPaymentMethods: PaymentMethod[] = [
  { id: "pm_1", name: "Cash", description: "Payment by cash", active: true },
  { id: "pm_2", name: "Credit Card", description: "Payment by credit card", active: true },
  { id: "pm_3", name: "Bank Transfer", description: "Payment via bank transfer", active: false },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const addMethod = (method: Omit<PaymentMethod, 'id'>) => {
    setPaymentMethods([...paymentMethods, { ...method, id: `pm_${Date.now()}` }]);
  };

  const updateMethod = (updatedMethod: PaymentMethod) => {
    setPaymentMethods(paymentMethods.map(p => p.id === updatedMethod.id ? updatedMethod : p));
  };

  const deleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
  };

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedMethod(null);
    setDialogOpen(true);
  };

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
        onSave={(data) => {
          if (selectedMethod) {
            updateMethod({ ...selectedMethod, ...data });
          } else {
            addMethod(data);
          }
        }}
      />
    </>
  );
}
