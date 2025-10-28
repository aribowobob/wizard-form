export interface PostBasicInfoPayload {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
}

export async function postBasicInfo(
  payload: PostBasicInfoPayload
): Promise<{ id: string }> {
  const response = await fetch("http://localhost:4001/employees", {
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
