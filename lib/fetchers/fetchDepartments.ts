export interface Department {
  id: number;
  name: string;
}

interface DepartmentApiResponse {
  id: string;
  name: string;
}

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch("http://localhost:4001/departments");

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  const data: DepartmentApiResponse[] = await response.json();

  // Convert string IDs to numbers for consistency
  return data.map((dept) => ({
    ...dept,
    id: parseInt(dept.id, 10),
  }));
}
