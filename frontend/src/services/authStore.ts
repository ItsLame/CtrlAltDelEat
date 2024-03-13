"use server";

import { cookies } from "next/headers";

import { accessTokenCookieName, refreshTokenCookieName } from "@/constants";
import { storeTokenRequest } from "@/models";

export async function storeToken(request: storeTokenRequest) {
  cookies().set({
    name: accessTokenCookieName,
    value: request.access,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  cookies().set({
    name: refreshTokenCookieName,
    value: request.refresh,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export async function getAuthToken(){
  const authToken = cookies().get(accessTokenCookieName)?.value;
  return authToken;
}

export async function getRefreshToken(){
  const refreshToken = cookies().get(refreshTokenCookieName)?.value;
  return refreshToken;
}
