"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDepartments } from "../fetchers/fetchDepartments";

export function useQueryDepartments() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
}
