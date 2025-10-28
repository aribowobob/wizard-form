"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../fetchers/fetchLocations";

export function useQueryLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}
