"use server";

import { cookies } from "next/headers";

import { accessTokenCookieName, refreshTokenCookieName, usernameCookieName, isSuperUserCookieName, userGroupsCookieName } from "@/constants";
import { storeTokenRequest } from "@/models";

export async function storeToken(request: storeTokenRequest) {
  const cookieMap = {
    [accessTokenCookieName]: request.access,
    [refreshTokenCookieName]: request.refresh,
    [usernameCookieName]: request.username,
    [isSuperUserCookieName]: request.isSuperUser,
    [userGroupsCookieName]: JSON.stringify(request.groups),
  };

  for (const [key, value] of Object.entries(cookieMap)) {
    cookies().set({
      name: `${key}`,
      value: `${value}`,
      httpOnly: true,
      sameSite: "strict",
      secure: true
    });
  };
}

export async function clearAuthRefreshTokens() {
  const cookieNames = [accessTokenCookieName, refreshTokenCookieName, usernameCookieName, isSuperUserCookieName, userGroupsCookieName];
  for (let i = 0; i < cookieNames.length; i++) cookies().delete(`${cookieNames[i]}`);
}

export async function getUserCookies() {
  const loginInfo = {
    username: cookies().get(usernameCookieName)?.value,
    isSuperUser: cookies().get(isSuperUserCookieName)?.value,
    groups: cookies().get(userGroupsCookieName)?.value,
  };

  return loginInfo;
}

export async function getAuthToken() {
  const authToken = cookies().get(accessTokenCookieName)?.value;
  return authToken;
}

export async function getRefreshToken() {
  const refreshToken = cookies().get(refreshTokenCookieName)?.value;
  return refreshToken;
}
