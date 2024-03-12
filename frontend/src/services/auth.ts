import { apiUrlBase } from "@/constants";
import { getAuthToken } from "@/services";
import { failedAuthError } from "@/helpers";
import { generateAuthTokenRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/auth/token/`;

export async function generateAuthToken(request: generateAuthTokenRequest) {
  const req = request;
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req)
  });

  if(!res.ok) failedAuthError();
  return res.json();
};

export async function getHeaders() {
  const authToken = await getAuthToken();
  const headersConfig = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`
  };
  return headersConfig;
}