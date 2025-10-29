import { EmployeeDetail } from "@/definitions/types";

export async function fetchDetails(): Promise<EmployeeDetail[]> {
  const response = await fetch("http://localhost:4002/details");

  if (!response.ok) {
    throw new Error("Failed to fetch details");
  }

  return response.json();
}
