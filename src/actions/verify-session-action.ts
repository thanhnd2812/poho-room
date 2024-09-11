"use server";

import { admin } from "@/lib/firebase";
import { cookies } from "next/headers";

export async function verifySession() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return false;

  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    return true;
  } catch (error) {
    console.error("Error verifying session cookie", error);
    return false;
  }
}
