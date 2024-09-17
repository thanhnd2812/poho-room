"use server";

import { FirebaseUser } from "@/lib/definitions";
import { cookies } from "next/headers";

export const getProfile = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/profiles/me`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get profile");
  }

  const { data } = await response.json();

  return data as FirebaseUser;
};