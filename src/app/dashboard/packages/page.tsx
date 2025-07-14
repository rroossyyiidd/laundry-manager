"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageDialog } from "@/components/packages/package-dialog";
import { PackagesTable } from "@/components/packages/packages-table";
import type { Package } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const initialPackages: Package[] = [
  { id: "pkg_1", name: "Daily Wear", description: "Standard wash and fold for everyday clothes.", active: true },
  { id: "pkg_2", name: "Beddings & Linens", description: "Special care for bedsheets, blankets, and towels.", active: true },
  { id: "pkg_3", name: "Delicates", description: "Gentle wash for delicate fabrics.", active: false },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const addPackage = (pkg: Omit<Package, 'id'>) => {
    setPackages([...packages, { ...pkg, id: `pkg_${Date.now()}` }]);
  };

  const updatePackage = (updatedPkg: Package) => {
    setPackages(packages.map(p => p.id === updatedPkg.id ? updatedPkg : p));
  };

  const deletePackage = (id: string) => {
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleEdit = (pkg: Package) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedPackage(null);
    setDialogOpen(true);
  };

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
        onSave={(data) => {
          if (selectedPackage) {
            updatePackage({ ...selectedPackage, ...data });
          } else {
            addPackage(data);
          }
        }}
      />
    </>
  );
}
