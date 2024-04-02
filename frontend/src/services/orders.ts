import { addToCartRequest, cartView } from "@/models";
import { failedGetError, failedPostError, mapCartToOrder } from "@/helpers";
import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services/auth";

const apiBase = `${apiUrlBase}/api/orders`;

export async function addItemToCart(request: addToCartRequest) {
  const headersConfig = await getHeaders.json();
  const apiUrl = `${apiBase}/addtocart/`;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(request),
  });

  if (!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}

export async function getCartStatus(tableNumber: number): Promise<cartView[]> {
  const apiUrl = `${apiBase}/getCartForTable/?tableNumber=${tableNumber}`;
  const res = await fetch(apiUrl);
  if (!res.ok) failedGetError();
  return res.json();
}

export async function orderCart(cart: cartView[]): Promise<number> {
  const apiUrl = `${apiBase}/orderitems/`;
  let order_body = mapCartToOrder(cart);
  console.log(JSON.stringify(order_body));
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order_body),
  });

  if (!res.ok) failedGetError();
  return res.status;
}
