import { apiUrlBase } from "@/constants";
import { failedGetError } from "@/helpers";
import { getHeaders } from "@/services";

const apiUrl = `${apiUrlBase}/api/orders/orderitems/`;

export async function getOrderItems() {
  const headersConfig = await getHeaders.json();
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    headers: headersConfig,
  });

  if (!res.ok) failedGetError();
  return res.json();
}
