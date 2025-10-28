"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBasicInfo, PostBasicInfoPayload } from "../fetchers/postBasicInfo";
import { postDetails, PostDetailsPayload } from "../fetchers/postDetails";
import { useRouter } from "next/navigation";
import { Role } from "./useDraftPersistence";

interface SubmitWizardPayload {
  basicInfo: PostBasicInfoPayload;
  details: PostDetailsPayload;
  role: Role;
}

export function useSubmitWizard() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ basicInfo, details }: SubmitWizardPayload) => {
      // Post basic info first
      const basicInfoResult = await postBasicInfo(basicInfo);

      // Then post details
      const detailsResult = await postDetails(details);

      return { basicInfoResult, detailsResult };
    },
    onSuccess: (data, variables) => {
      // Clear localStorage drafts for the role
      if (typeof window !== "undefined") {
        localStorage.removeItem(`draft_${variables.role}`);
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["basicInfo"] });
      queryClient.invalidateQueries({ queryKey: ["details"] });

      // Navigate to employee list page
      router.push("/");
    },
  });
}
