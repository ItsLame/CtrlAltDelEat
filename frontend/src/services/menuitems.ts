import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services";
import { failedDeleteError, failedGetError, failedPostError } from "@/helpers";
import { addMenuItemRequest, deleteMenuItemRequest, editMenuItemRequest, menuItems, uploadMenuItemImageRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/menu/menuitems/`;

export async function getMenuItems(): Promise<menuItems[]> {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if (!res.ok) failedGetError();
  return res.json();
}

export async function addMenuItem(request: addMenuItemRequest) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const endpoint = `${apiUrl}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(req),
  });

  if (!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}

export async function editMenuItem(request: editMenuItemRequest) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const { uuidUrl } = req;
  const endpoint = `${uuidUrl}update/`;
  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: headersConfig,
    body: JSON.stringify(req),
  });

  if (!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}

export async function deleteMenuItem(request: deleteMenuItemRequest) {
  const headersConfig = await getHeaders.json();
  const { uuidUrl } = request;
  const endpoint = `${uuidUrl}delete/`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: headersConfig,
  });

  if (!res.ok) failedDeleteError();
  return res.status;
}

export async function uploadMenuItemImage(request: uploadMenuItemImageRequest) {
  const headersConfig = await getHeaders.form();
  const req = request;
  const { image } = req;
  const endpoint = `${apiUrl}images/`;

  const formData = new FormData();
  if (request.image != null) formData.append("image", image as Blob);

  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: formData
  });

  if (!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.json();
}
