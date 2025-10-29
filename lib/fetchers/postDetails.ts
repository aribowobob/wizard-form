import { EmployeeDetail } from "@/definitions/types";

export async function postDetails(
  payload: EmployeeDetail
): Promise<{ id: string }> {
  const response = await fetch("http://localhost:4002/details", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to post details");
  }

  return response.json();
}
