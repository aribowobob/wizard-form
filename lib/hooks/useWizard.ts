"use client";

import { useState, useMemo, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutationSubmitBasicInfo } from "./useMutationSubmitBasicInfo";
import { useMutationSubmitDetails } from "./useMutationSubmitDetails";
import { useDraftPersistence, Role } from "./useDraftPersistence";
import { useQueryDepartments } from "./useQueryDepartments";
import { useQueryLocations } from "./useQueryLocations";
import { useQueryBasicInfo } from "./useQueryBasicInfo";
import { EmployeeRole, EmployeeType } from "@/definitions/enums";
import { getEmployeeId } from "@/lib/utils";

export const basicInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  id: z.string().min(1, "Employee ID is required. Please select a department."),
  role: z.nativeEnum(EmployeeRole),
});

export const detailsSchema = z.object({
  photo: z.string().min(1, "Photo is required"),
  employeeType: z.nativeEnum(EmployeeType),
  officeLocation: z.string().min(1, "Office location is required"),
  notes: z.string(),
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type DetailsFormData = z.infer<typeof detailsSchema>;

interface UseWizardProps {
  role: Role;
  initialData?: BasicInfoFormData;
  initialDetailsData?: DetailsFormData;
}

export function useWizard({
  role,
  initialData,
  initialDetailsData,
}: UseWizardProps) {
  const router = useRouter();
  const initialStep = useMemo(() => (role === "ops" ? 2 : 1), [role]);
  const [currentStep, setCurrentStep] = useState<1 | 2>(initialStep);
  const [basicInfoData, setBasicInfoData] = useState<
    BasicInfoFormData | undefined
  >();
  const [photoPreview, setPhotoPreview] = useState<string>(
    initialDetailsData?.photo || ""
  );

  const { data: departments = [] } = useQueryDepartments();
  const { data: locations = [] } = useQueryLocations();
  const { data: allEmployees = [] } = useQueryBasicInfo();

  const submitBasicInfo = useMutationSubmitBasicInfo();
  const submitDetails = useMutationSubmitDetails();

  // Step 1 form
  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData || {
      fullName: "",
      email: "",
      department: "",
      id: "",
      role: undefined,
    },
  });

  const { clearDraft, hasDraft, storageKey } = useDraftPersistence({
    form,
    role,
  });

  const hasDraftState = hasDraft();

  // Auto-generate employee ID when department is selected
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value, { name }) => {
      if (name === "department" && value.department) {
        const selectedDept = departments.find(
          (dept) => dept.id.toString() === value.department
        );
        if (selectedDept) {
          const newEmployeeId = getEmployeeId(
            allEmployees,
            selectedDept.id.toString(),
            selectedDept.name
          );
          form.setValue("id", newEmployeeId, { shouldValidate: true });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, departments, allEmployees]);

  // Step 2 form
  const detailsForm = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: initialDetailsData || {
      photo: "",
      employeeType: undefined,
      officeLocation: "",
      notes: "",
    },
  });

  const { clearDraft: clearDetailsDraft, hasDraft: hasDetailsDraft } =
    useDraftPersistence({
      form: detailsForm,
      role,
      onDraftLoad: (draft: DetailsFormData) => {
        if (draft.photo) {
          setPhotoPreview(draft.photo);
        }
      },
    });

  const hasDetailsDraftState = hasDetailsDraft();

  const handleStep1Submit = (data: BasicInfoFormData) => {
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
    setBasicInfoData(data);
    setCurrentStep(2);
  };

  const handleClearDraft = () => {
    clearDraft();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
        detailsForm.setValue("photo", base64String, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearDetailsDraft = () => {
    clearDetailsDraft();
    setPhotoPreview("");
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    label: dept.name,
  }));

  const locationOptions = locations.map((loc) => ({
    value: loc.id.toString(),
    label: loc.name,
  }));

  const roleOptions = [
    { value: EmployeeRole.Admin, label: "Admin" },
    { value: EmployeeRole.Ops, label: "Operations" },
    { value: EmployeeRole.Engineer, label: "Engineer" },
    { value: EmployeeRole.Finance, label: "Finance" },
  ];

  const employmentTypeOptions = [
    { value: EmployeeType.FullTime, label: "Full Time" },
    { value: EmployeeType.PartTime, label: "Part Time" },
    { value: EmployeeType.Contract, label: "Contract" },
    { value: EmployeeType.Intern, label: "Intern" },
  ];

  const handleStep2Back = () => {
    setCurrentStep(1);
  };

  const handleStep2Submit = async (detailsData: DetailsFormData) => {
    let basicInfo = basicInfoData;

    // If basicInfo is not set (e.g., role=ops skips Step 1), generate it with defaults
    if (!basicInfo) {
      const opsDepartmentId = "3"; // Operations department
      const opsDepartment = departments.find(
        (dept) => dept.id.toString() === opsDepartmentId
      );

      if (opsDepartment) {
        const generatedId = getEmployeeId(
          allEmployees,
          opsDepartmentId,
          opsDepartment.name
        );

        basicInfo = {
          fullName: "",
          email: "",
          department: opsDepartmentId,
          id: generatedId,
          role: EmployeeRole.Ops,
        };
      } else {
        // Fallback if department not found
        basicInfo = {
          fullName: "",
          email: "",
          department: "",
          id: "",
          role: EmployeeRole.Ops,
        };
      }
    }

    try {
      // Submit basic info first
      await submitBasicInfo.mutateAsync({
        id: basicInfo.id,
        fullName: basicInfo.fullName,
        email: basicInfo.email,
        department: basicInfo.department,
        role: basicInfo.role,
      });

      // Then submit details
      await submitDetails.mutateAsync({
        id: basicInfo.id,
        photo: detailsData.photo,
        employeeType: detailsData.employeeType,
        officeLocation: detailsData.officeLocation,
        notes: detailsData.notes,
      });

      // Clear localStorage drafts for the role
      if (typeof window !== "undefined") {
        localStorage.removeItem(`draft_${role}`);
      }

      // Navigate to employee list page
      router.push("/");
    } catch (error) {
      // Errors will be handled by the mutation error states
      console.error("Error submitting form:", error);
    }
  };

  const handleBackToList = () => {
    router.push("/");
  };

  return {
    // Step 1
    currentStep,
    basicInfoData,
    form,
    hasDraftState,
    handleStep1Submit,
    handleClearDraft,
    departmentOptions,
    roleOptions,
    // Step 2
    detailsForm,
    photoPreview,
    hasDetailsDraftState,
    handleFileChange,
    handleClearDetailsDraft,
    locationOptions,
    employmentTypeOptions,
    handleStep2Back,
    handleStep2Submit,
    // Common
    isSubmitting: submitBasicInfo.isPending || submitDetails.isPending,
    isError: submitBasicInfo.isError || submitDetails.isError,
    // Back to list
    handleBackToList,
  };
}
