"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { useDraftPersistence, Role } from "@/lib/hooks/useDraftPersistence";
import { useQueryDepartments } from "@/lib/hooks/useQueryDepartments";

const basicInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface Step1Props {
  role: Role;
  onNext: (data: BasicInfoFormData) => void;
  initialData?: BasicInfoFormData;
}

export function Step1({ role, onNext, initialData }: Step1Props) {
  const { data: departments = [] } = useQueryDepartments();

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      fullName: "",
      email: "",
      department: "",
      employeeId: "",
    },
  });

  const { clearDraft, hasDraft, storageKey } = useDraftPersistence({
    form,
    role,
  });

  const hasDraftState = hasDraft();

  const handleSubmit = (data: BasicInfoFormData) => {
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
    onNext(data);
  };

  const handleClearDraft = () => {
    clearDraft();
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Step 1: Basic Info</h2>
        <p className="text-gray-600">
          Enter the employee&apos;s basic information
        </p>
      </div>

      {hasDraftState && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center">
          <p className="text-sm text-yellow-800">
            You have a saved draft for this form
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearDraft}
          >
            Clear Draft
          </Button>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Employee Full Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Combobox
                    options={departmentOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select department..."
                    searchPlaceholder="Search departments..."
                    emptyText="No departments found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="EMP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={!form.formState.isValid}>
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
