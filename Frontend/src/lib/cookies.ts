"use server";

import { cookies } from "next/headers";

// Now we are using ID as the token
export async function setAuthTokens(token: string | null) {
  const cookieStore = cookies();
  if (token) {
    (await cookieStore).set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1.98, // 2 Dias com uma margem de erro
    });
  }
}

export async function getAuthTokens() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value ?? null;
  return { accessToken };
}

export async function clearAuthTokens() {
  const cookieStore = cookies();
  (await cookieStore).delete("access_token");
}

export async function isTheSameUser(token: string) {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value ?? null;
  return token === accessToken;
}