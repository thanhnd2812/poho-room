"use client";

import { getStreamToken } from "@/actions/stream.actions";
import Loader from "@/components/loader";
import { useProfile } from "@/hooks/use-profile";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const { data: user, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading || !user) return;
    if (!apiKey) throw new Error("No API key found");

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.uid,
        name: user.fullname,
        image: user.avatarUrl,
      },
      tokenProvider: getStreamToken,
    });
    setVideoClient(client);

    return () => {
      client.disconnectUser();
    };
  }, [user, isLoading]);

  if (!videoClient) return <Loader />;

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
