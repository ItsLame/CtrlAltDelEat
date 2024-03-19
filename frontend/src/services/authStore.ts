"use server";

import { cookies } from "next/headers";

import { accessTokenCookieName, refreshTokenCookieName, usernameCookieName, isSuperUserCookieName, userGroupsCookieName } from "@/constants";
import { storeTokenRequest } from "@/models";

export async function storeToken(request: storeTokenRequest) {
  console.log("Test");
  const cookie_map = {
    [accessTokenCookieName]: request.access,
    [refreshTokenCookieName]: request.refresh,
    [usernameCookieName]: request.username,
    [isSuperUserCookieName]: request.isSuperUser,
    [userGroupsCookieName]: JSON.stringify(request.groups),
  };
  for (const [key, value] of Object.entries(cookie_map)) {
    cookies().set({
      name: `${key}`,
      value: `${value}`,
      httpOnly: true,
      sameSite: "strict",
      secure: true
    });
  };

}

export async function clearAuthRefreshTokens(){
  const cookie_names = [accessTokenCookieName, refreshTokenCookieName, usernameCookieName, isSuperUserCookieName, userGroupsCookieName];
  for (let i = 0; i < cookie_names.length; i++) {
    console.log(`${cookie_names[i]}`);
    cookies().delete(`${cookie_names[i]}`);
  };
}

export async function getAuthToken(){
  const authToken = cookies().get(accessTokenCookieName)?.value;
  return authToken;
}

export async function getRefreshToken(){
  const refreshToken = cookies().get(refreshTokenCookieName)?.value;
  return refreshToken;
}
