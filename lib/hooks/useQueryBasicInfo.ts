"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBasicInfo } from "../fetchers/fetchBasicInfo";

export function useQueryBasicInfo() {
  return useQuery({
    queryKey: ["basicInfo"],
    queryFn: fetchBasicInfo,
  });
}
