export interface Location {
  id: number;
  name: string;
}

interface LocationApiResponse {
  id: string;
  name: string;
}

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch("http://localhost:4002/locations");

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  const data: LocationApiResponse[] = await response.json();

  // Convert string IDs to numbers for consistency
  return data.map((loc) => ({
    ...loc,
    id: parseInt(loc.id, 10),
  }));
}
