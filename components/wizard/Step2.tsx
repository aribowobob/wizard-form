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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { useDraftPersistence, Role } from "@/lib/hooks/useDraftPersistence";
import { useQueryLocations } from "@/lib/hooks/useQueryLocations";
import { ChangeEvent, useState } from "react";

const detailsSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  employeeType: z.string().min(1, "Employment type is required"),
  officeLocation: z.string().min(1, "Office location is required"),
  notes: z.string(),
});

export type DetailsFormData = z.infer<typeof detailsSchema>;

interface Step2Props {
  role: Role;
  onSubmit: (data: DetailsFormData) => void;
  onBack?: () => void;
  initialData?: DetailsFormData;
  isSubmitting?: boolean;
}

export function Step2({
  role,
  onSubmit,
  onBack,
  initialData,
  isSubmitting = false,
}: Step2Props) {
  const [photoPreview, setPhotoPreview] = useState<string>(
    initialData?.photo || ""
  );
  const { data: locations = [] } = useQueryLocations();

  const form = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: initialData || {
      photo: "",
      employeeType: "",
      officeLocation: "",
      notes: "",
    },
  });

  const { clearDraft, hasDraft } = useDraftPersistence({
    form,
    role,
    onDraftLoad: (draft) => {
      if (draft.photo) {
        setPhotoPreview(draft.photo);
      }
    },
  });

  const hasDraftState = hasDraft();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        form.setValue("photo", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearDraft = () => {
    clearDraft();
    setPhotoPreview("");
  };

  const locationOptions = locations.map((loc) => ({
    value: loc.id.toString(),
    label: loc.name,
  }));

  const employmentTypes = [
    { value: "Full Time", label: "Full Time" },
    { value: "Part Time", label: "Part Time" },
    { value: "Contract", label: "Contract" },
    { value: "Intern", label: "Intern" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Step 2: Details & Submit</h2>
        <p className="text-gray-600">
          Complete the employee&apos;s details and submit
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="photo"
            render={() => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
                <FormLabel>Employment Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employmentTypes.map((type) => (
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
                <FormLabel>Office Location</FormLabel>
                <FormControl>
                  <Combobox
                    options={locationOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select office location..."
                    searchPlaceholder="Search locations..."
                    emptyText="No locations found."
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
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
