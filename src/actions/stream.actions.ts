"use server";

export const getStreamToken = async () => {
  const response = await fetch("/api/rooms/token", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get stream token");
  }

  const { data } = await response.json();

  return data as string;
};