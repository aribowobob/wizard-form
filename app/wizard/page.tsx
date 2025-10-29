"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Step1 } from "@/components/wizard/Step1";
import { Step2 } from "@/components/wizard/Step2";
import { useWizard } from "@/lib/hooks/useWizard";
import { Role } from "@/lib/hooks/useDraftPersistence";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function WizardContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: Role = (roleParam === "ops" ? "ops" : "admin") as Role;

  const {
    currentStep,
    form,
    hasDraftState,
    handleStep1Submit,
    handleClearDraft,
    departmentOptions,
    roleOptions,
    detailsForm,
    photoPreview,
    hasDetailsDraftState,
    handleFileChange,
    handleClearDetailsDraft,
    locationOptions,
    employmentTypeOptions,
    handleStep2Back,
    handleStep2Submit,
    isSubmitting,
    isError,
    handleBackToList,
  } = useWizard({ role });

  return (
    <div className="py-8">
      <div className="mb-8 text-center flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold">Employee Wizard</h1>
        </div>

        <p className="text-gray-600">
          Role: <span className="font-semibold capitalize">{role}</span>
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {currentStep === 1 && role === "admin" && (
          <Step1
            form={form}
            hasDraftState={hasDraftState}
            onSubmit={handleStep1Submit}
            onClearDraft={handleClearDraft}
            departmentOptions={departmentOptions}
            roleOptions={roleOptions}
          />
        )}

        {currentStep === 2 && (
          <Step2
            form={detailsForm}
            photoPreview={photoPreview}
            hasDraftState={hasDetailsDraftState}
            onSubmit={handleStep2Submit}
            onClearDraft={handleClearDetailsDraft}
            onFileChange={handleFileChange}
            locationOptions={locationOptions}
            employmentTypeOptions={employmentTypeOptions}
            onBack={role === "admin" ? handleStep2Back : undefined}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {isError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">
            Error submitting form. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default function WizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <WizardContent />
    </Suspense>
  );
}
