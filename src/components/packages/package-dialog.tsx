"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription as FormItemDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { packageSchema } from "@/lib/schemas";
import type { Package } from "@/lib/types";
import { useEffect } from "react";

type PackageDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  packageData: Package | null;
  onSave: (data: z.infer<typeof packageSchema>) => void;
};

export function PackageDialog({ isOpen, setIsOpen, packageData, onSave }: PackageDialogProps) {
  const form = useForm<z.infer<typeof packageSchema>>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: "",
      description: "",
      active: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (packageData) {
        form.reset(packageData);
      } else {
        form.reset({ name: "", description: "", active: true });
      }
    }
  }, [packageData, form, isOpen]);

  const onSubmit = (data: z.infer<typeof packageSchema>) => {
    onSave(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{packageData ? "Edit Package" : "Add New Package"}</DialogTitle>
          <DialogDescription>
            {packageData ? "Update the details of the laundry package." : "Fill in the details for the new laundry package."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Express Wash" {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe what this package includes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <FormItemDescription>
                      Inactive packages won't be available for selection.
                    </FormItemDescription>
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
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
