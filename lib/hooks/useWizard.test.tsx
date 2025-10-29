/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWizard } from "./useWizard";
import { useQueryDepartments } from "./useQueryDepartments";
import { useQueryLocations } from "./useQueryLocations";
import { useQueryBasicInfo } from "./useQueryBasicInfo";
import { useMutationSubmitBasicInfo } from "./useMutationSubmitBasicInfo";
import { useMutationSubmitDetails } from "./useMutationSubmitDetails";
import { useDraftPersistence } from "./useDraftPersistence";
import { ReactNode, ChangeEvent } from "react";
import { EmployeeRole, EmployeeType } from "@/definitions/enums";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the query and mutation hooks
jest.mock("./useQueryDepartments");
jest.mock("./useQueryLocations");
jest.mock("./useQueryBasicInfo");
jest.mock("./useMutationSubmitBasicInfo");
jest.mock("./useMutationSubmitDetails");
jest.mock("./useDraftPersistence");

const mockUseQueryDepartments = useQueryDepartments as jest.MockedFunction<
  typeof useQueryDepartments
>;
const mockUseQueryLocations = useQueryLocations as jest.MockedFunction<
  typeof useQueryLocations
>;
const mockUseQueryBasicInfo = useQueryBasicInfo as jest.MockedFunction<
  typeof useQueryBasicInfo
>;
const mockUseMutationSubmitBasicInfo =
  useMutationSubmitBasicInfo as jest.MockedFunction<
    typeof useMutationSubmitBasicInfo
  >;
const mockUseMutationSubmitDetails =
  useMutationSubmitDetails as jest.MockedFunction<
    typeof useMutationSubmitDetails
  >;
const mockUseDraftPersistence = useDraftPersistence as jest.MockedFunction<
  typeof useDraftPersistence
>;

// Test data
const mockDepartments = [
  { id: "1", name: "Lending" },
  { id: "2", name: "Funding" },
  { id: "3", name: "Operations" },
  { id: "4", name: "Engineering" },
];

const mockLocations = [
  { id: "1", name: "Jakarta" },
  { id: "2", name: "Depok" },
  { id: "3", name: "Surabaya" },
];

const mockEmployees = [
  {
    id: "ENG-001",
    fullName: "John Doe",
    email: "john@example.com",
    department: "4",
    role: EmployeeRole.Engineer,
  },
  {
    id: "OPE-001",
    fullName: "Jane Smith",
    email: "jane@example.com",
    department: "3",
    role: EmployeeRole.Ops,
  },
];

// Helper to create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useWizard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Default mock implementations
    mockUseQueryDepartments.mockReturnValue({
      data: mockDepartments,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryLocations.mockReturnValue({
      data: mockLocations,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryBasicInfo.mockReturnValue({
      data: mockEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseMutationSubmitBasicInfo.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({ id: "TEST-001" }),
      isPending: false,
      isError: false,
    } as any);

    mockUseMutationSubmitDetails.mockReturnValue({
      mutateAsync: jest.fn().mockResolvedValue({ id: "TEST-001" }),
      isPending: false,
      isError: false,
    } as any);

    mockUseDraftPersistence.mockReturnValue({
      clearDraft: jest.fn(),
      hasDraft: jest.fn().mockReturnValue(false),
      storageKey: "draft_admin",
    } as any);
  });

  describe("Initial State", () => {
    it("should initialize with step 1 for admin role", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should initialize with step 2 for ops role", () => {
      const { result } = renderHook(() => useWizard({ role: "ops" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should initialize with provided initial data", () => {
      const initialData = {
        fullName: "Test User",
        email: "test@example.com",
        department: "1",
        id: "LEN-001",
        role: EmployeeRole.Admin,
      };

      const { result } = renderHook(
        () => useWizard({ role: "admin", initialData }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.form.getValues()).toEqual(initialData);
    });

    it("should initialize photo preview with initial details data", () => {
      const initialDetailsData = {
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      };

      const { result } = renderHook(
        () => useWizard({ role: "admin", initialDetailsData }),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.photoPreview).toBe("base64photo");
    });
  });

  describe("Options Generation", () => {
    it("should generate department options from query data", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.departmentOptions).toEqual([
        { value: "1", label: "Lending" },
        { value: "2", label: "Funding" },
        { value: "3", label: "Operations" },
        { value: "4", label: "Engineering" },
      ]);
    });

    it("should generate location options from query data", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.locationOptions).toEqual([
        { value: "1", label: "Jakarta" },
        { value: "2", label: "Depok" },
        { value: "3", label: "Surabaya" },
      ]);
    });

    it("should provide role options", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.roleOptions).toEqual([
        { value: EmployeeRole.Admin, label: "Admin" },
        { value: EmployeeRole.Ops, label: "Operations" },
        { value: EmployeeRole.Engineer, label: "Engineer" },
        { value: EmployeeRole.Finance, label: "Finance" },
      ]);
    });

    it("should provide employment type options", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.employmentTypeOptions).toEqual([
        { value: EmployeeType.FullTime, label: "Full Time" },
        { value: EmployeeType.PartTime, label: "Part Time" },
        { value: EmployeeType.Contract, label: "Contract" },
        { value: EmployeeType.Intern, label: "Intern" },
      ]);
    });
  });

  describe("Step 1 Handling", () => {
    it("should handle step 1 submit and move to step 2", async () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const formData = {
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        id: "ENG-002",
        role: EmployeeRole.Engineer,
      };

      act(() => {
        result.current.handleStep1Submit(formData);
      });

      await waitFor(() => {
        expect(result.current.currentStep).toBe(2);
        expect(result.current.basicInfoData).toEqual(formData);
      });
    });

    it("should save data to localStorage on step 1 submit", async () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const formData = {
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        id: "ENG-002",
        role: EmployeeRole.Engineer,
      };

      act(() => {
        result.current.handleStep1Submit(formData);
      });

      await waitFor(() => {
        const savedData = localStorage.getItem("draft_admin");
        expect(savedData).toBe(JSON.stringify(formData));
      });
    });

    it("should handle clear draft", () => {
      const mockClearDraft = jest.fn();
      mockUseDraftPersistence.mockReturnValue({
        clearDraft: mockClearDraft,
        hasDraft: jest.fn().mockReturnValue(true),
        storageKey: "draft_admin",
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleClearDraft();
      });

      expect(mockClearDraft).toHaveBeenCalled();
    });
  });

  describe("Step 2 Handling", () => {
    it("should handle back from step 2 to step 1", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      // Move to step 2 first
      act(() => {
        result.current.handleStep1Submit({
          fullName: "John Doe",
          email: "john@example.com",
          department: "4",
          id: "ENG-002",
          role: EmployeeRole.Engineer,
        });
      });

      // Go back to step 1
      act(() => {
        result.current.handleStep2Back();
      });

      expect(result.current.currentStep).toBe(1);
    });

    it("should handle clear details draft", () => {
      const mockClearDetailsDraft = jest.fn();
      mockUseDraftPersistence.mockReturnValue({
        clearDraft: mockClearDetailsDraft,
        hasDraft: jest.fn().mockReturnValue(false),
        storageKey: "draft_admin",
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleClearDetailsDraft();
      });

      expect(result.current.photoPreview).toBe("");
    });

    it("should handle file change and set photo preview", async () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const mockEvent = {
        target: { files: [mockFile] },
      } as unknown as ChangeEvent<HTMLInputElement>;

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: "data:image/jpeg;base64,testdata",
        onloadend: null as any,
      };

      jest
        .spyOn(global, "FileReader")
        .mockImplementation(() => mockFileReader as any);

      act(() => {
        result.current.handleFileChange(mockEvent);
      });

      // Trigger onloadend
      act(() => {
        if (mockFileReader.onloadend) {
          mockFileReader.onloadend({} as any);
        }
      });

      await waitFor(() => {
        expect(result.current.photoPreview).toBe(
          "data:image/jpeg;base64,testdata"
        );
      });
    });
  });

  describe("Step 2 Submit", () => {
    it("should submit both basic info and details with admin role", async () => {
      const mockSubmitBasicInfo = jest
        .fn()
        .mockResolvedValue({ id: "ENG-002" });
      const mockSubmitDetails = jest.fn().mockResolvedValue({ id: "ENG-002" });

      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: mockSubmitBasicInfo,
        isPending: false,
        isError: false,
      } as any);

      mockUseMutationSubmitDetails.mockReturnValue({
        mutateAsync: mockSubmitDetails,
        isPending: false,
        isError: false,
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const basicInfo = {
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        id: "ENG-002",
        role: EmployeeRole.Engineer,
      };

      const detailsData = {
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      };

      // Submit step 1
      act(() => {
        result.current.handleStep1Submit(basicInfo);
      });

      // Submit step 2
      await act(async () => {
        await result.current.handleStep2Submit(detailsData);
      });

      expect(mockSubmitBasicInfo).toHaveBeenCalledWith({
        id: "ENG-002",
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        role: EmployeeRole.Engineer,
      });

      expect(mockSubmitDetails).toHaveBeenCalledWith({
        id: "ENG-002",
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      });
    });

    it("should auto-generate basic info for ops role when submitting step 2", async () => {
      const mockSubmitBasicInfo = jest
        .fn()
        .mockResolvedValue({ id: "OPE-002" });
      const mockSubmitDetails = jest.fn().mockResolvedValue({ id: "OPE-002" });

      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: mockSubmitBasicInfo,
        isPending: false,
        isError: false,
      } as any);

      mockUseMutationSubmitDetails.mockReturnValue({
        mutateAsync: mockSubmitDetails,
        isPending: false,
        isError: false,
      } as any);

      const { result } = renderHook(() => useWizard({ role: "ops" }), {
        wrapper: createWrapper(),
      });

      const detailsData = {
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      };

      await act(async () => {
        await result.current.handleStep2Submit(detailsData);
      });

      expect(mockSubmitBasicInfo).toHaveBeenCalledWith({
        id: "OPE-002", // Auto-generated based on Operations department
        fullName: "",
        email: "",
        department: "3", // Operations department ID
        role: EmployeeRole.Ops,
      });

      expect(mockSubmitDetails).toHaveBeenCalledWith({
        id: "OPE-002",
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      });
    });

    it("should clear localStorage and navigate to home after successful submit", async () => {
      const mockSubmitBasicInfo = jest
        .fn()
        .mockResolvedValue({ id: "ENG-002" });
      const mockSubmitDetails = jest.fn().mockResolvedValue({ id: "ENG-002" });

      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: mockSubmitBasicInfo,
        isPending: false,
        isError: false,
      } as any);

      mockUseMutationSubmitDetails.mockReturnValue({
        mutateAsync: mockSubmitDetails,
        isPending: false,
        isError: false,
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const basicInfo = {
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        id: "ENG-002",
        role: EmployeeRole.Engineer,
      };

      const detailsData = {
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      };

      // Set localStorage
      localStorage.setItem("draft_admin", JSON.stringify(basicInfo));

      act(() => {
        result.current.handleStep1Submit(basicInfo);
      });

      await act(async () => {
        await result.current.handleStep2Submit(detailsData);
      });

      await waitFor(() => {
        expect(localStorage.getItem("draft_admin")).toBeNull();
        expect(mockPush).toHaveBeenCalledWith("/");
      });
    });

    it("should handle submission errors gracefully", async () => {
      const mockSubmitBasicInfo = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));

      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: mockSubmitBasicInfo,
        isPending: false,
        isError: true,
      } as any);

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      const basicInfo = {
        fullName: "John Doe",
        email: "john@example.com",
        department: "4",
        id: "ENG-002",
        role: EmployeeRole.Engineer,
      };

      const detailsData = {
        photo: "base64photo",
        employeeType: EmployeeType.FullTime,
        officeLocation: "1",
        notes: "Test notes",
      };

      act(() => {
        result.current.handleStep1Submit(basicInfo);
      });

      await act(async () => {
        await result.current.handleStep2Submit(detailsData);
      });

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Submission States", () => {
    it("should indicate submitting state when mutations are pending", () => {
      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true,
        isError: false,
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isSubmitting).toBe(true);
    });

    it("should indicate error state when mutations fail", () => {
      mockUseMutationSubmitBasicInfo.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: false,
        isError: true,
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isError).toBe(true);
    });
  });

  describe("Navigation", () => {
    it("should navigate back to list when handleBackToList is called", () => {
      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.handleBackToList();
      });

      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  describe("Draft State", () => {
    it("should reflect draft state from useDraftPersistence", () => {
      mockUseDraftPersistence.mockReturnValue({
        clearDraft: jest.fn(),
        hasDraft: jest.fn().mockReturnValue(true),
        storageKey: "draft_admin",
      } as any);

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasDraftState).toBe(true);
    });

    it("should reflect details draft state from useDraftPersistence", () => {
      let callCount = 0;
      mockUseDraftPersistence.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call for Step 1 form
          return {
            clearDraft: jest.fn(),
            hasDraft: jest.fn().mockReturnValue(false),
            storageKey: "draft_admin",
          } as any;
        } else {
          // Second call for Step 2 form
          return {
            clearDraft: jest.fn(),
            hasDraft: jest.fn().mockReturnValue(true),
            storageKey: "draft_admin",
          } as any;
        }
      });

      const { result } = renderHook(() => useWizard({ role: "admin" }), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasDetailsDraftState).toBe(true);
    });
  });
});
