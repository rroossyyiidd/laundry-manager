"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageDialog } from "@/components/packages/package-dialog";
import { PackagesTable } from "@/components/packages/packages-table";
import { useToast } from "@/hooks/use-toast";
import { PackageService } from "@/lib/services/packageService";
import type { Package } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  // Load packages on component mount
  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const result = await PackageService.getAll();
      if (result.success && result.data) {
        setPackages(result.data);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to load packages",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const result = await PackageService.create(packageData);
      if (result.success && result.data) {
        setPackages([...packages, result.data]);
        toast({
          title: "Success",
          description: result.message || "Package created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create package",
        variant: "destructive",
      });
    }
  };

  const updatePackage = async (updatedPackage: Package) => {
    try {
      const result = await PackageService.update(updatedPackage.id, {
        name: updatedPackage.name,
        description: updatedPackage.description,
        price: updatedPackage.price,
        active: updatedPackage.active,
      });
      if (result.success && result.data) {
        setPackages(packages.map(p => p.id === updatedPackage.id ? result.data! : p));
        toast({
          title: "Success",
          description: result.message || "Package updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update package",
        variant: "destructive",
      });
    }
  };

  const deletePackage = async (id: number) => {
    try {
      const result = await PackageService.delete(id);
      if (result.success) {
        setPackages(packages.filter(p => p.id !== id));
        toast({
          title: "Success",
          description: result.message || "Package deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete package",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedPackage(null);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Laundry Packages</CardTitle>
          <CardDescription>Loading packages...</CardDescription>
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
              <CardTitle>Laundry Packages</CardTitle>
              <CardDescription>Manage your services and pricing.</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PackagesTable 
            data={packages} 
            onEdit={handleEdit} 
            onDelete={deletePackage} 
          />
        </CardContent>
      </Card>
      <PackageDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        packageData={selectedPackage}
        onSave={async (data) => {
          if (selectedPackage) {
            await updatePackage({ ...selectedPackage, ...data, price: data.price || null });
          } else {
            await addPackage({ ...data, price: data.price || null });
          }
        }}
      />
    </>
  );
}
