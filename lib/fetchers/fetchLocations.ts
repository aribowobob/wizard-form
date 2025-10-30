export interface Location {
  id: string;
  name: string;
}

export async function fetchLocations(
  searchQuery?: string
): Promise<Location[]> {
  const url = new URL("http://localhost:4002/locations");
  if (searchQuery) {
    url.searchParams.append("name_like", searchQuery);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}
