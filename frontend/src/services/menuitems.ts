import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services";
import { failedGetError, failedPostError } from "@/helpers";
import { addMenuItemRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/menu/menuitems/`;

export async function getMenuItems() {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
}

export async function addMenuItem(request: addMenuItemRequest) {
  const headersConfig = await getHeaders();
  const endpoint = `${apiUrl}`;
  const formData = new FormData();

  formData.append("menuitem_name", `${request.menuitem_name}`);
  formData.append("available", `${request.available}`);
  formData.append("cost", `${request.cost}`);
  formData.append("description", `${request.description}`);

  for (var i = 0; i < request.category.length; ++i) {
    formData.append("category", request.category[i]);
  }
  for (var i = 0; i < request.ingredients.length; ++i) {
    formData.append("ingredients", request.ingredients[i]);
  }
  for (var i = 0; i < request.tags.length; ++i) {
    formData.append("tags", request.tags[i]);
  }
  if (request.image != null) {
    formData.append("image", request.image as Blob);
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Authorization": headersConfig.Authorization },
    body: formData
  });

  if(!res.ok && res.status != 400 && res.status != 401) failedPostError();
  return res.status;
}
