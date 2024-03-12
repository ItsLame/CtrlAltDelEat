import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services";
import { failedDeleteError, failedGetError, failedPostError } from "@/helpers";
import { addCategoryRequest, deleteCategoryRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/menu/categories/`;

export async function getCategories() {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
};

export async function addCategory(request: addCategoryRequest) {
  const headersConfig = await getHeaders();
  const req = request;
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(req)
  });

  if(!res.ok && res.status !== 400 && res.status !== 401) failedPostError();
  return res.status;
};

export async function deleteCategory(request: deleteCategoryRequest) {
  const headersConfig = await getHeaders();
  const { uuid } = request;
  const endpoint = `${apiUrl}${uuid}/delete`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: headersConfig
  });

  if(!res.ok) failedDeleteError();
  return res.status;
};