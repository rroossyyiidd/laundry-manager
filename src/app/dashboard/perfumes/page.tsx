"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { PerfumeDialog } from "@/components/perfumes/perfume-dialog";
import { PerfumesTable } from "@/components/perfumes/perfumes-table";
import type { Perfume } from "@/lib/types";
import { PlusCircle, RefreshCw, Sparkles } from "lucide-react";
import { perfumeSchema } from "@/lib/schemas";
import * as z from "zod";

export default function PerfumesPage() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch perfumes
  useEffect(() => {
    fetchPerfumes();
  }, []);

  const fetchPerfumes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/perfumes');
      const data = await response.json();

      if (data.success) {
        setPerfumes(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch perfumes');
      }
    } catch (error) {
      console.error('Failed to fetch perfumes:', error);
      toast({
        title: "Error",
        description: "Failed to load perfumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: z.infer<typeof perfumeSchema>) => {
    try {
      if (selectedPerfume) {
        // Update existing perfume
        const response = await fetch(`/api/perfumes/${selectedPerfume.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update perfume');
        }

        if (result.success) {
          setPerfumes(prevPerfumes => 
            prevPerfumes.map(perfume => 
              perfume.id === selectedPerfume.id ? result.data : perfume
            )
          );
          
          toast({
            title: "Success",
            description: "Perfume updated successfully!",
          });
        }
      } else {
        // Create new perfume
        const response = await fetch('/api/perfumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create perfume');
        }

        if (result.success) {
          setPerfumes(prevPerfumes => [result.data, ...prevPerfumes]);
          
          toast({
            title: "Success",
            description: "Perfume created successfully!",
          });
        }
      }
    } catch (error) {
      console.error('Error saving perfume:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save perfume",
        variant: "destructive",
      });
      throw error; // Re-throw to prevent dialog from closing
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/perfumes/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete perfume');
      }

      if (result.success) {
        setPerfumes(prevPerfumes => prevPerfumes.filter(perfume => perfume.id !== id));
        
        toast({
          title: "Success",
          description: "Perfume deleted successfully!",
        });
      }
    } catch (error) {
      console.error('Error deleting perfume:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete perfume",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    setDialogOpen(true);
  };
  
  const handleAddNew = () => {
    setSelectedPerfume(null);
    setDialogOpen(true);
  };

  const availableCount = perfumes.filter(p => p.available).length;
  const totalCount = perfumes.length;

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Perfumes</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Sparkles className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{availableCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Not Available</CardTitle>
              <Sparkles className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalCount - availableCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Perfumes
                </CardTitle>
                <CardDescription>
                  Manage perfume options for your laundry services.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={fetchPerfumes} disabled={isLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={handleAddNew}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Perfume
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Loading perfumes...</span>
                </div>
              </div>
            ) : (
              <PerfumesTable 
                data={perfumes}
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <PerfumeDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
        perfumeData={selectedPerfume}
        onSave={handleSave}
      />
    </>
  );
}
