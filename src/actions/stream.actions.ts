"use server";

import { cookies } from "next/headers";

export const getStreamToken = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/rooms/token`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
    }
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to get stream token");
  }

  const { data } = await response.json();

  return data as string;
};