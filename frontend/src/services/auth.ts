import { apiUrlBase } from "@/constants";
import { getAuthToken, getRefreshToken, clearAuthRefreshTokens } from "@/services";
import { failedAuthError } from "@/helpers";
import { generateAuthTokenRequest } from "@/models";

const apiUrl = `${apiUrlBase}/api/auth/token/`;

export async function generateAuthToken(request: generateAuthTokenRequest) {
  const headersConfig = await getHeaders.json();
  const req = request;
  const endpoint = `${apiUrl}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify(req),
  });
  if (!res.ok) failedAuthError();
  return res.json();
}

export async function blacklistAuthToken() {
  const headersConfig = await getHeaders.json();
  const refreshToken = await getRefreshToken();
  const endpoint = `${apiUrl}blacklist/`;

  if (!refreshToken) {
    clearAuthRefreshTokens();
    return;
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: headersConfig,
    body: JSON.stringify( { refresh: refreshToken } ),
  });

  clearAuthRefreshTokens();
  if (!res.ok) failedAuthError();
}

export const getHeaders = {
  async json() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAuthToken()}`,
    };
  },
  async form() {
    return {
      // "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${await getAuthToken()}`,
    };
  }
};
