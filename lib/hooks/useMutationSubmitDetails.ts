"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDetails } from "../fetchers/postDetails";
import { EmployeeDetail } from "@/definitions/types";

export function useMutationSubmitDetails() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: EmployeeDetail) => {
      const result = await postDetails(payload);
      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["details"] });
    },
  });
}
