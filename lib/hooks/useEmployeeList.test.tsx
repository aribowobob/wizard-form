/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEmployeeList } from "./useEmployeeList";
import { useQueryBasicInfo } from "./useQueryBasicInfo";
import { useQueryDetails } from "./useQueryDetails";
import { useQueryDepartments } from "./useQueryDepartments";
import { useQueryLocations } from "./useQueryLocations";
import { ReactNode } from "react";

// Mock the query hooks
jest.mock("./useQueryBasicInfo");
jest.mock("./useQueryDetails");
jest.mock("./useQueryDepartments");
jest.mock("./useQueryLocations");

const mockUseQueryBasicInfo = useQueryBasicInfo as jest.MockedFunction<
  typeof useQueryBasicInfo
>;
const mockUseQueryDetails = useQueryDetails as jest.MockedFunction<
  typeof useQueryDetails
>;
const mockUseQueryDepartments = useQueryDepartments as jest.MockedFunction<
  typeof useQueryDepartments
>;
const mockUseQueryLocations = useQueryLocations as jest.MockedFunction<
  typeof useQueryLocations
>;

// Test data
const mockEmployees = [
  {
    id: "EMP-001",
    fullName: "John Doe",
    email: "john@example.com",
    department: 1,
    role: "ENGINEER",
  },
  {
    id: "EMP-002",
    fullName: "Jane Smith",
    email: "jane@example.com",
    department: 2,
    role: "ADMIN",
  },
  {
    id: "EMP-003",
    fullName: "Bob Wilson",
    email: "bob@example.com",
    department: 1,
    role: "OPS",
  },
];

const mockEmployeeDetails = [
  {
    id: "EMP-001",
    photo: "https://example.com/photo1.jpg",
    employeeType: "FULL_TIME",
    officeLocation: 1,
    notes: "Test notes 1",
  },
  {
    id: "EMP-002",
    photo: "https://example.com/photo2.jpg",
    employeeType: "CONTRACT",
    officeLocation: 2,
    notes: "Test notes 2",
  },
  {
    id: "EMP-003",
    photo: "https://example.com/photo3.jpg",
    employeeType: "FULL_TIME",
    officeLocation: 1,
    notes: "Test notes 3",
  },
];

const mockDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Operations" },
];

const mockLocations = [
  { id: 1, name: "Jakarta" },
  { id: 2, name: "Surabaya" },
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

describe("useEmployeeList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loading state when queries are loading", () => {
    mockUseQueryBasicInfo.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDepartments.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    mockUseQueryLocations.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.employees).toEqual([]);
  });

  it("should return error state when any query fails", () => {
    const mockError = new Error("Failed to fetch");

    mockUseQueryBasicInfo.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: mockError,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: mockEmployeeDetails,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it("should merge employee data correctly", async () => {
    mockUseQueryBasicInfo.mockReturnValue({
      data: mockEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: mockEmployeeDetails,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.employees).toHaveLength(3);
    });

    const firstEmployee = result.current.employees[0];
    expect(firstEmployee).toEqual({
      id: "EMP-001",
      fullName: "John Doe",
      email: "john@example.com",
      department: "Engineering",
      role: "ENGINEER",
      photo: "https://example.com/photo1.jpg",
      location: "Jakarta",
      employeeType: "FULL_TIME",
      notes: "Test notes 1",
    });
  });

  it("should handle missing employee details gracefully", async () => {
    const incompleteDetails = [mockEmployeeDetails[0]]; // Missing details for EMP-002 and EMP-003

    mockUseQueryBasicInfo.mockReturnValue({
      data: mockEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: incompleteDetails,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.employees).toHaveLength(3);
    });

    const secondEmployee = result.current.employees[1];
    expect(secondEmployee.photo).toBe("");
    expect(secondEmployee.location).toBe("Unknown");
    expect(secondEmployee.employeeType).toBe("");
    expect(secondEmployee.notes).toBe("");
  });

  it("should handle missing department mapping", async () => {
    const employeeWithUnknownDept = [
      {
        id: "EMP-004",
        fullName: "Test User",
        email: "test@example.com",
        department: 999, // Non-existent department
        role: "ENGINEER",
      },
    ];

    mockUseQueryBasicInfo.mockReturnValue({
      data: employeeWithUnknownDept,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.employees).toHaveLength(1);
    });

    expect(result.current.employees[0].department).toBe("Unknown");
  });

  it("should paginate employees correctly", async () => {
    mockUseQueryBasicInfo.mockReturnValue({
      data: mockEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: mockEmployeeDetails,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.totalPages).toBe(1);
    });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it("should change page correctly", async () => {
    // Create more employees to test pagination
    const manyEmployees = Array.from({ length: 25 }, (_, i) => ({
      id: `EMP-${i + 1}`,
      fullName: `Employee ${i + 1}`,
      email: `emp${i + 1}@example.com`,
      department: 1,
      role: "ENGINEER",
    }));

    mockUseQueryBasicInfo.mockReturnValue({
      data: manyEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.totalPages).toBe(3); // 25 employees / 10 per page = 3 pages
    });

    expect(result.current.employees).toHaveLength(10); // First page

    // Change to page 2
    act(() => {
      result.current.setCurrentPage(2);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(2);
    });

    expect(result.current.employees).toHaveLength(10); // Second page

    // Change to page 3
    act(() => {
      result.current.setCurrentPage(3);
    });

    await waitFor(() => {
      expect(result.current.currentPage).toBe(3);
    });

    expect(result.current.employees).toHaveLength(5); // Last page has 5 employees
  });

  it("should change page size correctly", async () => {
    const manyEmployees = Array.from({ length: 25 }, (_, i) => ({
      id: `EMP-${i + 1}`,
      fullName: `Employee ${i + 1}`,
      email: `emp${i + 1}@example.com`,
      department: 1,
      role: "ENGINEER",
    }));

    mockUseQueryBasicInfo.mockReturnValue({
      data: manyEmployees,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    } as any);

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

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.totalPages).toBe(3);
    });

    // Change page size to 5
    act(() => {
      result.current.setPageSize(5);
    });

    await waitFor(() => {
      expect(result.current.pageSize).toBe(5);
    });

    expect(result.current.totalPages).toBe(5); // 25 employees / 5 per page = 5 pages
    expect(result.current.employees).toHaveLength(5);
  });

  it("should return empty array when no data is available", () => {
    mockUseQueryBasicInfo.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDetails.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryDepartments.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    mockUseQueryLocations.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useEmployeeList(), {
      wrapper: createWrapper(),
    });

    expect(result.current.employees).toEqual([]);
    expect(result.current.totalPages).toBe(0);
  });
});
