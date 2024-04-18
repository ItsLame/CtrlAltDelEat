import { apiUrlBase } from "@/constants";
import { failedGetError } from "@/helpers";
import { getHeaders } from "@/services";
import { items } from "@/models";

const apiUrl = `${apiUrlBase}/api/orders/viewReceivedOrders/`;

export async function getOrderItems(): Promise<items[]> {
  const headersConfig = await getHeaders.json();
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    headers: headersConfig,
  });

  if (!res.ok) failedGetError();
  return res.json();
}
