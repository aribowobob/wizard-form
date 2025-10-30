export interface Department {
  id: string;
  name: string;
}

export async function fetchDepartments(
  searchQuery?: string
): Promise<Department[]> {
  const url = new URL("http://localhost:4001/departments");
  if (searchQuery) {
    url.searchParams.append("name_like", searchQuery);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch departments");
  }

  return response.json();
}
