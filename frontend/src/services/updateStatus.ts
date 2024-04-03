import { apiUrlBase } from "@/constants";
import { failedPutError } from "@/helpers";
import { getHeaders } from "@/services";
import { changeItemStatus } from "@/models";

const apiUrl = `${apiUrlBase}/api/orders/changeItemStatus/`;

export async function updateItemStatus(
  itemID: number,
  request: changeItemStatus
) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const endpoint = `${apiUrl}${itemID}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: headersConfig,
    body: JSON.stringify(req),
  });

  if (!res.ok) failedPutError();
  return res.json();
}
