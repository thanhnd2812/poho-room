"use server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const getPublicStreamToken = async (id?: string) => {
  if (!apiKey || !apiSecret) {
    throw new Error("No API key or secret");
  }

  const client = new StreamClient(apiKey, apiSecret, {
    timeout: 6000,
  });
  const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
  const issued = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

  const token = client.generateUserToken({
    user_id: id as string,
    exp,
    iat: issued,
  });

  return token;
};

export const updateUserFullname = async (id: string, fullname: string, isHost: boolean = false) => {
  if (!apiKey || !apiSecret) {
    throw new Error("No API key or secret");
  }
  const displayName = isHost ? `${fullname} (Host)` : fullname;
  console.log("updateUserFullname", id, displayName);
  const client = new StreamClient(apiKey, apiSecret, {
    timeout: 6000,
  });
  return await client.updateUsersPartial({
    users: [
      {
        id,
        set: {
          name: displayName,
        },
      },
    ],
  });
};