import { EmployeeBasicInfo } from "@/definitions/types";

export async function postBasicInfo(
  payload: EmployeeBasicInfo
): Promise<{ id: string }> {
  const response = await fetch("http://localhost:4001/basicInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to post basic info");
  }

  return response.json();
}
