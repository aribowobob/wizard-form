export interface Location {
  id: string;
  name: string;
}

export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch("http://localhost:4002/locations");

  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }

  return response.json();
}
