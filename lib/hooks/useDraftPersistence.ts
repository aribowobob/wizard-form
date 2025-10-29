"use client";

import { useEffect, useRef, useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";

export type Role = "admin" | "ops";

interface UseDraftPersistenceOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  role: Role;
  debounceMs?: number;
  onDraftLoad?: (draft: T) => void;
}

export function useDraftPersistence<T extends FieldValues>({
  form,
  role,
  debounceMs = 2000,
  onDraftLoad,
}: UseDraftPersistenceOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const storageKey = `draft_${role}`;
  const [hasDraftState, setHasDraftState] = useState(false);

  // Load draft on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          form.reset(parsedDraft);
          setHasDraftState(true);
          if (onDraftLoad) {
            onDraftLoad(parsedDraft);
          }
        } catch (error) {
          console.error("Failed to parse draft:", error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem(storageKey, JSON.stringify(formData));
          setHasDraftState(true);
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, storageKey, debounceMs]);

  const clearDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      form.reset();
      setHasDraftState(false);
    }
  };

  const hasDraft = () => {
    return hasDraftState;
  };

  return { clearDraft, hasDraft, storageKey };
}
