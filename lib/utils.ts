import { EmployeeBasicInfo } from "@/definitions/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmployeeId(
  employees: EmployeeBasicInfo[],
  departmentId: string,
  departmentName: string
): string {
  const countEmployeesWithRole = employees.filter(
    (emp) => emp.department === departmentId
  ).length;
  const roleCode = departmentName.slice(0, 3).toUpperCase();
  const idNumber = String(countEmployeesWithRole + 1).padStart(3, "0");
  return `${roleCode}-${idNumber}`;
}
