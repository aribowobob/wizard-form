"use client";

import { UseFormReturn } from "react-hook-form";
import { ChangeEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxAsync } from "@/components/ui/combobox-async";
import { EmployeeType } from "@/definitions/enums";

export { type DetailsFormData } from "@/lib/hooks/useWizard";
import { DetailsFormData } from "@/lib/hooks/useWizard";

interface Step2Props {
  form: UseFormReturn<DetailsFormData>;
  photoPreview: string;
  hasDraftState: boolean;
  onSubmit: (data: DetailsFormData) => void;
  onClearDraft: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  locationOptions: { value: string; label: string }[];
  employmentTypeOptions: { value: EmployeeType; label: string }[];
  onBack?: () => void;
  isSubmitting?: boolean;
  isLocationsLoading?: boolean;
  onLocationSearch: (search: string) => void;
  loadingMessage?: string;
  fileInputKey?: number;
  formKey?: number;
}

export function Step2({
  form,
  photoPreview,
  hasDraftState,
  onSubmit,
  onClearDraft,
  onFileChange,
  locationOptions,
  employmentTypeOptions,
  onBack,
  isSubmitting = false,
  isLocationsLoading = false,
  onLocationSearch,
  loadingMessage = "",
  fileInputKey = 0,
  formKey = 0,
}: Step2Props) {
  return (
    <div className="w-full mx-auto p-6">
      <div className="flex flex-col gap-6 md:flex-row mb-6">
        <div className="grow">
          <h2 className="text-2xl font-bold mb-1">Step 2: Details & Submit</h2>
          <p className="text-gray-600 text-sm">
            Complete the employee&apos;s details and submit
          </p>
        </div>

        {hasDraftState && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center self-start gap-2">
            <p className="text-sm text-yellow-800">
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
            name="photo"
            render={() => (
              <FormItem>
                <FormLabel>
                  Photo <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                  />
                </FormControl>
                {photoPreview && (
                  <div className="mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employeeType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Employment Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  key={formKey}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employmentTypeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
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
            name="officeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Office Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <ComboboxAsync
                    options={locationOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    onSearchChange={onLocationSearch}
                    placeholder="Select office location..."
                    searchPlaceholder="Search locations..."
                    emptyText="No locations found."
                    isLoading={isLocationsLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional notes..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>

          {loadingMessage && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 text-center font-medium">
                {loadingMessage}
              </p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
