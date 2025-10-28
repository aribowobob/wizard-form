export interface Department {
  id: string;
  name: string;
}

export async function fetchDepartments(): Promise<Department[]> {
  const response = await fetch("http://localhost:4001/departments");

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  return response.json();
}
