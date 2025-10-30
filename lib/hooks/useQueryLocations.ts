"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../fetchers/fetchLocations";

export function useQueryLocations(searchQuery?: string) {
  return useQuery({
    queryKey: ["locations", searchQuery],
    queryFn: () => fetchLocations(searchQuery),
  });
}
