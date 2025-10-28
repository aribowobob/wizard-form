"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Step1, BasicInfoFormData } from "@/components/wizard/Step1";
import { Step2, DetailsFormData } from "@/components/wizard/Step2";
import { useSubmitWizard } from "@/lib/hooks/useSubmitWizard";
import { Role } from "@/lib/hooks/useDraftPersistence";

function WizardContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: Role = (roleParam === "ops" ? "ops" : "admin") as Role;

  const initialStep = useMemo(() => (role === "ops" ? 2 : 1), [role]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(initialStep);
  const [basicInfoData, setBasicInfoData] = useState<
    BasicInfoFormData | undefined
  >();

  const submitWizard = useSubmitWizard();

  const handleStep1Next = (data: BasicInfoFormData) => {
    setBasicInfoData(data);
    setCurrentStep(2);
  };

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Submit = (detailsData: DetailsFormData) => {
    // For ops role, we need to get basic info from somewhere
    // For now, we'll use default values if not available
    const basicInfo = basicInfoData || {
      fullName: "",
      email: "",
      department: "",
      employeeId: "",
    };

    submitWizard.mutate({
      basicInfo: {
        id: basicInfo.employeeId,
        fullName: basicInfo.fullName,
        email: basicInfo.email,
        department: basicInfo.department,
        role: role === "admin" ? "ADMIN" : "OPS",
      },
      details: {
        photo: detailsData.photo,
        employeeType: detailsData.employeeType,
        officeLocation: detailsData.officeLocation,
        notes: detailsData.notes,
      },
      role,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Employee Wizard</h1>
          <p className="text-gray-600">
            Role: <span className="font-semibold capitalize">{role}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {currentStep === 1 && role === "admin" && (
            <Step1
              role={role}
              onNext={handleStep1Next}
              initialData={basicInfoData}
            />
          )}

          {currentStep === 2 && (
            <Step2
              role={role}
              onSubmit={handleStep2Submit}
              onBack={role === "admin" ? handleStep2Back : undefined}
              isSubmitting={submitWizard.isPending}
            />
          )}
        </div>

        {submitWizard.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Error submitting form. Please try again.
            </p>
          </div>
        )}
      </div>
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
