"use client";

import { UseFormReturn } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxAsync } from "@/components/ui/combobox-async";
import { EmployeeRole } from "@/definitions/enums";

export { type BasicInfoFormData } from "@/lib/hooks/useWizard";
import { BasicInfoFormData } from "@/lib/hooks/useWizard";
import { ArrowRight } from "lucide-react";

interface Step1Props {
  form: UseFormReturn<BasicInfoFormData>;
  hasDraftState: boolean;
  onSubmit: (data: BasicInfoFormData) => void;
  onClearDraft: () => void;
  departmentOptions: { value: string; label: string }[];
  roleOptions: { value: EmployeeRole; label: string }[];
  isDepartmentsLoading?: boolean;
  onDepartmentSearch: (search: string) => void;
  formKey?: number;
}

export function Step1({
  form,
  hasDraftState,
  onSubmit,
  onClearDraft,
  departmentOptions,
  roleOptions,
  isDepartmentsLoading = false,
  onDepartmentSearch,
  formKey = 0,
}: Step1Props) {
  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-col gap-6 md:flex-row mb-6">
        <div className="grow">
          <h2 className="text-2xl font-bold mb-1">Step 1: Basic Info</h2>
          <p className="text-gray-600 text-sm">
            Enter the employee&apos;s basic information
          </p>
        </div>

        {hasDraftState && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center self-start gap-2">
            <p className="text-xs text-yellow-800">
              You have a saved draft for this form
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClearDraft}
            >
              Clear Draft
            </Button>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Full Name <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
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
                <FormLabel>
                  Department <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ComboboxAsync
                    options={departmentOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    onSearchChange={onDepartmentSearch}
                    placeholder="Select department..."
                    searchPlaceholder="Search departments..."
                    emptyText="No departments found."
                    isLoading={isDepartmentsLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employee Role <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  key={formKey}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employee ID <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Auto generated!" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">
              Next
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
