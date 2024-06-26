import { apiUrlBase } from "@/constants";
import { getHeaders } from "@/services";
import { failedDeleteError, failedGetError, failedPostError } from "@/helpers";
import { addCategoryRequest, category, deleteCategoryRequest, editCategoryRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/menu/categories/`;

export async function getCategories(): Promise<category[]> {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if (!res.ok) failedGetError();
  return res.json();
};

export async function addCategory(request: addCategoryRequest) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(req)
  });

  if (!res.ok && res.status !== 400 && res.status !== 401) failedPostError();
  return res.status;
};

export async function editCategory(request: editCategoryRequest) {
  const headersConfig = await getHeaders.json();
  const { category_name, uuidUrl, position } = request;
  const endpoint = `${uuidUrl}update/`;
  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: headersConfig,
    body: JSON.stringify({ category_name, position })
  });

  if (!res.ok && res.status !== 400 && res.status !== 401) failedPostError();
  return res.status;
};

export async function deleteCategory(request: deleteCategoryRequest) {
  const headersConfig = await getHeaders.json();
  const { uuidUrl } = request;
  const endpoint = `${uuidUrl}delete/`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: headersConfig
  });

  if (!res.ok) failedDeleteError();
  return res.status;
};
