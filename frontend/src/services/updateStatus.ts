import { apiUrlBase } from "@/constants";
import { failedPutError } from "@/helpers";
import { getHeaders } from "@/services";

const apiUrl = `${apiUrlBase}/api/orders/changeItemStatus/`;

export async function updateItemStatus (itemID: number, status: string) {
  const headersConfig = await getHeaders.json();
  const endpoint = `${apiUrl}?itemId=${itemID}&status=${status}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: headersConfig,
  });

  if (!res.ok) failedPutError();
  return res.json();
}
