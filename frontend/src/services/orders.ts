import { orderMenuItemRequest } from "@/models";
import { failedPostError } from "@/helpers";
import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services/auth";

const apiBase = `${apiUrlBase}/api/orders`;

export async function addItemToCart(request: orderMenuItemRequest) {
  const apiUrl = `${apiBase}/addtocart/`;

  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(request),
  });

  if (!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}
