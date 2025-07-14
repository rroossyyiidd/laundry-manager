
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { LaundryOrder, Customer, Package } from "@/lib/types";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { format } from 'date-fns';

type LaundryOrdersTableProps = {
  data: LaundryOrder[];
  customers: Customer[];
  packages: Package[];
  onEdit: (order: LaundryOrder) => void;
  onDelete: (id: string) => void;
};

export function LaundryOrdersTable({ data, customers, packages, onEdit, onDelete }: LaundryOrdersTableProps) {
  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown Customer';
  const getPackageName = (id: string) => packages.find(p => p.id === id)?.name || 'Unknown Package';

  const getStatusVariant = (status: LaundryOrder['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Processing':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      case 'Pending':
      default:
        return 'outline';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{getCustomerName(order.customerId)}</TableCell>
              <TableCell className="text-muted-foreground">{getPackageName(order.packageId)}</TableCell>
              <TableCell className="text-muted-foreground">{order.weight.toFixed(1)}</TableCell>
              <TableCell className="text-muted-foreground">{format(order.orderDate, 'PPP')}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(order)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(order.id)}
                        variant="destructive"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No orders found. Start by creating a new order.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
