"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDepartments } from "../fetchers/fetchDepartments";

export function useQueryDepartments(searchQuery?: string) {
  return useQuery({
    queryKey: ["departments", searchQuery],
    queryFn: () => fetchDepartments(searchQuery),
  });
}
