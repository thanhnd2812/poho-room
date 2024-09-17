"use client";

import { getStreamToken } from "@/actions/stream.actions";
import Loader from "@/components/loader";
import { useProfile } from "@/hooks/use-profile";

import viTranslation from "@/languages/stream/vi.json";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );
  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  // Determine the language based on the pathname
  const language = pathname?.startsWith('/vi') ? 'vi' : 'en';

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // Redirect to login if user is null or undefined
      router.push("/login");
      return;
    }

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
  }, [user, isLoading, router]);

  if (!videoClient) return <Loader />;

  return (
    <StreamVideo
      client={videoClient}
      language={language}
      translationsOverrides={{
        vi: viTranslation,
      }}
    >
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider;
