import { apiUrlBase } from "@/constants";

const apiBase = `${apiUrlBase}/api/tables`;

export async function requestAssistance(tableNo: number) {
  const apiUrl = `${apiBase}/customer_request_assistance/`;
  const request = { tableNumber: tableNo };
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return res.status;
}
