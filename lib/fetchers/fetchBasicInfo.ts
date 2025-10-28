export interface BasicInfoEmployee {
  id: string;
  fullName: string;
  email: string;
  department: number;
  role: string;
}

export async function fetchBasicInfo(): Promise<BasicInfoEmployee[]> {
  const response = await fetch("http://localhost:4001/employees");

  if (!response.ok) {
    throw new Error("Failed to fetch basic info");
  }

  return response.json();
}
