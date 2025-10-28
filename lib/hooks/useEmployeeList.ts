"use client";

import { useMemo, useState } from "react";
import { useQueryBasicInfo } from "./useQueryBasicInfo";
import { useQueryDetails } from "./useQueryDetails";
import { useQueryDepartments } from "./useQueryDepartments";
import { useQueryLocations } from "./useQueryLocations";

export interface MergedEmployee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  photo: string;
  location: string;
  employeeType: string;
  notes: string;
}

interface UseEmployeeListResult {
  employees: MergedEmployee[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

const DEFAULT_PAGE_SIZE = 10;

export function useEmployeeList(): UseEmployeeListResult {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const basicInfoQuery = useQueryBasicInfo();
  const detailsQuery = useQueryDetails();
  const departmentsQuery = useQueryDepartments();
  const locationsQuery = useQueryLocations();

  const isLoading =
    basicInfoQuery.isLoading ||
    detailsQuery.isLoading ||
    departmentsQuery.isLoading ||
    locationsQuery.isLoading;
  const isError =
    basicInfoQuery.isError ||
    detailsQuery.isError ||
    departmentsQuery.isError ||
    locationsQuery.isError;
  const error =
    basicInfoQuery.error ||
    detailsQuery.error ||
    departmentsQuery.error ||
    locationsQuery.error;

  const mergedData = useMemo(() => {
    if (
      !basicInfoQuery.data ||
      !detailsQuery.data ||
      !departmentsQuery.data ||
      !locationsQuery.data
    ) {
      return [];
    }

    const employees = basicInfoQuery.data;
    const employeeDetails = detailsQuery.data;
    const departments = departmentsQuery.data;
    const locations = locationsQuery.data;

    // Create maps for quick lookup
    const detailsMap = new Map(
      employeeDetails.map((detail) => [detail.id, detail])
    );
    const departmentsMap = new Map(
      departments.map((dept) => [dept.id, dept.name])
    );
    const locationsMap = new Map(locations.map((loc) => [loc.id, loc.name]));

    // Merge employee data
    const merged = employees.map((emp) => {
      const detail = detailsMap.get(emp.id);
      return {
        id: emp.id,
        fullName: emp.fullName,
        email: emp.email,
        department: departmentsMap.get(emp.department) || "Unknown",
        role: emp.role,
        photo: detail?.photo || "",
        location: detail
          ? locationsMap.get(detail.officeLocation) || "Unknown"
          : "Unknown",
        employeeType: detail?.employeeType || "",
        notes: detail?.notes || "",
      };
    });

    return merged;
  }, [
    basicInfoQuery.data,
    detailsQuery.data,
    departmentsQuery.data,
    locationsQuery.data,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(mergedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEmployees = mergedData.slice(startIndex, endIndex);

  return {
    employees: paginatedEmployees,
    isLoading,
    isError,
    error: error as Error | null,
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
  };
}
