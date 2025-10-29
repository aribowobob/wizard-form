"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBasicInfo } from "../fetchers/postBasicInfo";
import { EmployeeBasicInfo } from "@/definitions/types";

export function useMutationSubmitBasicInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EmployeeBasicInfo) => {
      const result = await postBasicInfo(payload);
      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["basicInfo"] });
    },
  });
}
