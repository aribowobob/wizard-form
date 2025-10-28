export interface PostDetailsPayload {
  photo: string;
  employeeType: string;
  officeLocation: string;
  notes: string;
}

export async function postDetails(
  payload: PostDetailsPayload
): Promise<{ id: string }> {
  const response = await fetch("http://localhost:4002/employeeDetails", {
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
