import { failedGetError, failedPostError } from "@/helpers";
import { addCategoryRequest } from "@/models";

// replace this to env file when have time
const apiUrl = "http://localhost:4000/api/menu/categories/";

export async function getCategories() {
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
};

export async function addCategory(addCategoryRequest: addCategoryRequest) {
  const endpoint = `${apiUrl}`;
  const req = addCategoryRequest;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req)
  });

  if(!res.ok && res.status != 400) failedPostError();
  return res.status;
};
