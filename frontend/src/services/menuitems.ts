import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services";
import { failedGetError, failedPostError } from "@/helpers";
import { addMenuItemRequest, editMenuItemRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/menu/menuitems/`;

export async function getMenuItems() {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
}

export async function addMenuItem(request: addMenuItemRequest) {
  const headersConfig = await getHeaders();
  const req = request;
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(req)
  });

  if(!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}

export async function editMenuItem(request: editMenuItemRequest) {
  const headersConfig = await getHeaders();
  const req = request;
  const { uuidUrl } = req;
  const endpoint = `${uuidUrl}update/`;
  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: headersConfig,
    body: JSON.stringify(req)
  });

  if(!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}
