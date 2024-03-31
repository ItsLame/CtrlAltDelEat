import { apiUrlBase } from "@/constants";
import { failedGetError } from "@/helpers";

const apiUrl = `${apiUrlBase}/api/menu/`;

export async function getIngredients() {
  const endpoint = `${apiUrl}ingredients/`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
};

export async function getTags() {
  const endpoint = `${apiUrl}tags/`;
  const res = await fetch(endpoint);

  if(!res.ok) failedGetError();
  return res.json();
};
