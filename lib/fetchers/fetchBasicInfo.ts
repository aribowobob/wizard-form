import { EmployeeBasicInfo } from "@/definitions/types";

export async function fetchBasicInfo(): Promise<EmployeeBasicInfo[]> {
  const response = await fetch("http://localhost:4001/basicInfo");

  if (!response.ok) {
    throw new Error("Failed to fetch basic info");
  }

  return response.json();
}
