"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { perfumeSchema } from "@/lib/schemas";
import type { Perfume } from "@/lib/types";
import { useEffect, useState } from "react";

type PerfumeDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  perfumeData: Perfume | null;
  onSave: (data: z.infer<typeof perfumeSchema>) => Promise<void>;
};

export function PerfumeDialog({ isOpen, setIsOpen, perfumeData, onSave }: PerfumeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof perfumeSchema>>({
    resolver: zodResolver(perfumeSchema),
    defaultValues: {
      name: "",
      description: "",
      available: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (perfumeData) {
        form.reset({
          name: perfumeData.name,
          description: perfumeData.description,
          available: perfumeData.available,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          available: true,
        });
      }
    }
  }, [perfumeData, form, isOpen]);

  const onSubmit = async (data: z.infer<typeof perfumeSchema>) => {
    setIsLoading(true);
    try {
      await onSave(data);
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving perfume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{perfumeData ? "Edit Perfume" : "Add New Perfume"}</DialogTitle>
          <DialogDescription>
            {perfumeData ? "Update the perfume details below." : "Fill in the details for the new perfume."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfume Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lavender Breeze" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the perfume scent and characteristics..." 
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Available</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Toggle whether this perfume is currently available for use
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : perfumeData ? "Update Perfume" : "Add Perfume"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
