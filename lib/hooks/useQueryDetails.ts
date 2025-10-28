"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDetails } from "../fetchers/fetchDetails";

export function useQueryDetails() {
  return useQuery({
    queryKey: ["details"],
    queryFn: fetchDetails,
  });
}
