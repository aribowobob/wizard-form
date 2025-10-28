export interface EmployeeDetail {
  id: string;
  photo: string;
  employeeType: string;
  officeLocation: string;
  notes: string;
}

export async function fetchDetails(): Promise<EmployeeDetail[]> {
  const response = await fetch("http://localhost:4002/employeeDetails");

  if (!response.ok) {
    throw new Error("Failed to fetch details");
  }

  return response.json();
}
