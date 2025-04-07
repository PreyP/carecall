import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { InsertPatient, insertPatientSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extended schema with validation
const addPatientSchema = insertPatientSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  mrn: z.string().min(3, { message: "MRN must be at least 3 characters" }),
  age: z.coerce.number().min(18).max(120),
  phone: z.string().min(7, { message: "Please enter a valid phone number" }),
});

type AddPatientFormValues = z.infer<typeof addPatientSchema>;

interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddPatientDialog({ isOpen, onClose }: AddPatientDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Initialize the form with default values
  const form = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: "",
      initials: "",
      mrn: "",
      age: 65,
      gender: "Male",
      phone: "",
      address: "",
      emergencyContact: "",
      primaryDoctorId: user?.id ?? null,
      hasRedAlert: false,
      hasYellowAlert: false,
    },
  });

  // Calculate initials whenever the name changes
  const watchedName = form.watch("name");
  if (watchedName && watchedName.trim() !== "") {
    const nameParts = watchedName.trim().split(" ");
    if (nameParts.length > 1) {
      const firstInitial = nameParts[0][0] || "";
      const lastInitial = nameParts[nameParts.length - 1][0] || "";
      const initials = (firstInitial + lastInitial).toUpperCase();
      form.setValue("initials", initials);
    } else if (nameParts.length === 1) {
      const initial = nameParts[0][0] || "";
      form.setValue("initials", initial.toUpperCase());
    }
  }

  // Mutation for creating a new patient
  const createPatientMutation = useMutation({
    mutationFn: async (patientData: InsertPatient) => {
      const res = await apiRequest("POST", "/api/patients", patientData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Patient has been added successfully",
      });
      // Invalidate and refetch patients
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients/recent'] });
      onClose();
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add patient: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddPatientFormValues) => {
    createPatientMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's information to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mrn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Record Number (MRN)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={18}
                        max={120}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe (555) 987-6543" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose} 
                disabled={createPatientMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createPatientMutation.isPending}
              >
                {createPatientMutation.isPending ? "Adding..." : "Add Patient"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}